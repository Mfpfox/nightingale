import React, { useState, useEffect, useRef } from "react";
import isEmpty from "lodash-es/isEmpty";
import ProtvistaMSA from "protvista-msa";
import ProtvistaNavigation from "protvista-navigation";
import ProtvistaManager from "protvista-manager";
import loadWebComponent from "../utils/load-web-component";
import Readme from "./Readme";
import readmeContent from "../../../packages/protvista-msa/README.md";
import Console from "./Console";

const AllowedColorschemes = [
  "aliphatic",
  "aromatic",
  "buried_index",
  "charged",
  "cinema",
  "clustal",
  "clustal2",
  "helix_propensity",
  "hydro",
  "lesk",
  "mae",
  "negative",
  "nucleotide",
  "polar",
  "positive",
  "purine_pyrimidine",
  "serine_threonine",
  "strand_propensity",
  "taylor",
  "turn_propensity",
  "zappo",
  "conservation",
];

const nSequences = 400;
const nGaps = 20;
const alphabet = "ACDEFGHIKLMNPQRSTVWY-";

const getRandomBase = () =>
  alphabet[Math.floor(Math.random() * alphabet.length)];

const getRandomPosition = (length) => Math.round(Math.random() * (length - 1));

const changeBaseAtPosition = (sequence, base, position) =>
  `${sequence.substring(0, position)}${base}${sequence.substring(
    position + 1
  )}`;

const addGaps = (sequence, nGaps) => {
  let result = sequence;
  for (let i = 0; i < nGaps; i++) {
    const position = getRandomPosition(sequence.length);
    result = changeBaseAtPosition(result, "-", position);
  }
  return result;
};

let currentColor = null;
const ProtvistaMSAWrapper = () => {
  const [colorScheme, setColorScheme] = useState("clustal");
  const [overlayConservation, setOverlayConservation] = useState(false);
  const [sampleSizeConservation, setSampleSizeConservation] = useState(null);
  const [showLeftCoordinate, setShowLeftCoordinate] = useState(true);
  const [showRightCoordinate, setShowRightCoordinate] = useState(true);
  const [offsetSeqStart, setOffsetSeqStart] = useState(false);
  const [excludeGaps, setExcludeGaps] = useState(false);
  const msaTrack = useRef(null);
  const [logs, setLogs] = useState("");
  const addLog = (log) => setLogs(`${logs}\n${log}`);
  const sequence =
    "MAMYDDEFDTKASDLTFSPWVEVENWKDVTTRLRAIKFALQADRDKIPGVLSDLKTNCPYSAFKRFPDKSLYSVLSKEAVIAVAQIQSASGFKRRADEKNAVSGLVSVTPTQISQSASSSAATPVGLATVKPPRESDSAFQEDTFSYAKFDDASTAFHKALAYLEGLSLRPTYRRKFEKDMNVKWGGSGSAPSGAPAGGSSGSAPPTSGSSGSGAAPTPPPNP";
  useEffect(() => {
    const seqs = [];
    for (let i = 1; i <= nSequences; i++) {
      const mutationPos = getRandomPosition(sequence.length);
      seqs.push({
        name: `seq_${i}`,
        sequence: addGaps(
          changeBaseAtPosition(sequence, getRandomBase(), mutationPos),
          nGaps
        ),
        start: 1 + getRandomPosition(sequence.length),
      });
    }
    msaTrack.current.data = seqs;
    msaTrack.current.addEventListener("conservationProgress", (e) =>
      addLog(`[conservationProgress]: ${e.detail.progress * 100}%`)
    );
    msaTrack.current.addEventListener("drawCompleted", () => {
      const { name, map } = msaTrack.current.getColorMap();
      if (name !== currentColor) {
        if (name && map) {
          addLog(
            `[colors-${name}]:\n${Object.entries(map)
              .map(([base, color]) => `\t${base}: ${color}`)
              .join("\n")}`
          );
        }
        currentColor = name;
      }
    });
    msaTrack.current.onActiveTrackChange = (trackId) => {
      console.log("on active track change:", trackId);
    };
  }, []);

  loadWebComponent("protvista-msa", ProtvistaMSA);
  loadWebComponent("protvista-navigation", ProtvistaNavigation);
  loadWebComponent("protvista-manager", ProtvistaManager);

  const handleColorChange = (event) => {
    setColorScheme(event.target.value);
    addLog(`[setColorScheme]: ${event.target.value}`);
  };
  const labelWidth = 60;
  const coordinateWidth = 30;
  const conservationOptions = {
    "calculate-conservation": true,
  };
  if (overlayConservation) {
    conservationOptions["overlay-conservation"] = true;
  }
  if (sampleSizeConservation > 0) {
    conservationOptions["sample-size-conservation"] = sampleSizeConservation;
  }

  const coordinateOptions = {};
  if (showLeftCoordinate) {
    coordinateOptions["coordinate-left"] = true;
  }
  if (showRightCoordinate) {
    coordinateOptions["coordinate-right"] = true;
  }
  if (!isEmpty(coordinateOptions)) {
    coordinateOptions["coordinate-width"] = coordinateWidth;
    if (excludeGaps) {
      coordinateOptions["coordinate-exclude-gaps"] = true;
    }
    if (offsetSeqStart) {
      coordinateOptions["coordinate-offset-seq-start"] = true;
    }
  }

  return (
    <>
      <h1>protvista-msa</h1>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>
          colorScheme:
          <select
            value={colorScheme}
            onChange={handleColorChange}
            onBlur={handleColorChange}
          >
            {AllowedColorschemes.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          overlayConservation:
          <input
            type="checkbox"
            checked={overlayConservation}
            onChange={() => setOverlayConservation(!overlayConservation)}
          />
        </label>
        <label>
          sampleSizeConservation:
          <input
            type="number"
            value={sampleSizeConservation || ""}
            onChange={(evt) => setSampleSizeConservation(evt.target.value)}
          />
        </label>
        <label>
          show left coordinates:
          <input
            type="checkbox"
            checked={showLeftCoordinate}
            onChange={() => setShowLeftCoordinate(!showLeftCoordinate)}
          />
        </label>
        <label>
          show right coordinates:
          <input
            type="checkbox"
            checked={showRightCoordinate}
            onChange={() => setShowRightCoordinate(!showRightCoordinate)}
          />
        </label>
        {(showLeftCoordinate || showRightCoordinate) && (
          <>
            <label>
              offset coordinates by sequence start:
              <input
                type="checkbox"
                checked={offsetSeqStart}
                onChange={() => setOffsetSeqStart(!offsetSeqStart)}
              />
            </label>
            <label>
              exclude gaps from coordinate count:
              <input
                type="checkbox"
                checked={excludeGaps}
                onChange={() => setExcludeGaps(!excludeGaps)}
              />
            </label>
          </>
        )}
      </div>
      <protvista-manager
        attributes="length displaystart displayend highlight"
        displaystart="1"
        displayend="50"
        id="example"
      >
        <div style={{ display: "flex", width: "100%" }}>
          <protvista-navigation
            length={sequence.length + 1}
            displaystart="1"
            displayend="50"
          />
        </div>
        <protvista-msa
          id="msa-track"
          ref={msaTrack}
          length={sequence.length}
          height="200"
          displaystart="1"
          displayend="50"
          use-ctrl-to-zoom
          labelWidth={labelWidth}
          colorscheme={colorScheme}
          text-font="16px sans-serif"
          {...conservationOptions}
          {...coordinateOptions}
        />
      </protvista-manager>
      <Console>{logs}</Console>
      <Readme content={readmeContent} />
    </>
  );
};

export default ProtvistaMSAWrapper;
