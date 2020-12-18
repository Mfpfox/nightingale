import React, { useCallback } from "react";

import "@nightingale-elements/nightingale-structure";
import "@nightingale-elements/nightingale-datatable";
import "@nightingale-elements/nightingale-manager";
import { html } from "lit-html";

import "litemol/dist/css/LiteMol-plugin.css";
import Readme from "./Readme";
import readmeContent from "../../../packages/nightingale-structure/README.md";
import xrefData from "../mocks/pdb-xrefs.json";

const selectedId = "1AAP";

const processData = (xrefs) =>
  xrefs.map(({ id, properties }) => {
    if (!properties) {
      return null;
    }
    const { Chains, Resolution, Method } = properties;
    let chain;
    let positions;
    let start;
    if (Chains) {
      const tokens = Chains.split("=");
      if (tokens.length === 2) {
        [chain, positions] = tokens;
        const startEnd = positions.split("-");
        if (startEnd && startEnd.length === 2) {
          [start] = startEnd;
        }
      }
    }
    return {
      id,
      method: Method,
      resolution: !Resolution || Resolution === "-" ? null : Resolution,
      chain,
      positions,
      protvistaFeatureId: id,
      start: Number(start),
    };
  });

const pdbMirrors = [
  {
    name: "PDBe",
    url: (id) => `https://www.ebi.ac.uk/pdbe-srv/view/entry/${id}`,
  },
  {
    name: "RCSB PDB",
    url: (id) => `https://www.rcsb.org/structure/${id}`,
  },
  {
    name: "PDBj",
    url: (id) => `https://pdbj.org/mine/summary/${id}`,
  },
  {
    name: "PDBsum",
    url: (id) => `https://www.ebi.ac.uk/pdbsum/${id}`,
  },
];

const getColumnConfig = () => ({
  type: {
    label: "PDB Entry",
    resolver: ({ id }) => id,
  },
  method: {
    label: "Method",
    resolver: ({ method }) => method,
  },
  resolution: {
    label: "Resolution",
    resolver: ({ resolution }) => resolution && resolution.replace("A", "Å"),
  },
  chain: {
    label: "Chain",
    resolver: ({ chain }) => chain,
  },
  positions: {
    label: "Positions",
    resolver: ({ positions }) => positions,
  },
  links: {
    label: "Links",
    resolver: ({ id }) =>
      html`
        ${pdbMirrors
          .map(({ name, url }) => html` <a href=${url(id)}>${name}</a> `)
          .reduce((prev, curr) => html` ${prev} · ${curr} `)}
      `,
  },
});

const PDBDatatable = ({ xrefs }) => {
  const data = processData(xrefs);
  const setTableData = useCallback(
    (node) => {
      if (node) {
        // eslint-disable-next-line no-param-reassign
        node.data = data;
        // eslint-disable-next-line no-param-reassign
        node.columns = getColumnConfig();
        // eslint-disable-next-line no-param-reassign
        node.rowClickEvent = ({ id }) => ({ "pdb-id": id });
      }
    },
    [data]
  );
  return (
    <nightingale-datatable
      ref={setTableData}
      selectedId={selectedId}
      noScrollToRow
      noDeselect
    />
  );
};

const NightingaleStructureWrapper = () => {
  return (
    <>
      <Readme content={readmeContent} />
      <h2>Examples</h2>
      <h3>Structure with highlighted positions</h3>
      <nightingale-structure
        pdb-id={selectedId}
        accession="P05067"
        highlight="290:300,310:340"
      />
      <h3>Structure with nightingale-datatable</h3>
      <nightingale-manager attributes="pdb-id">
        <nightingale-structure pdb-id={selectedId} accession="P05067" />
        <PDBDatatable xrefs={xrefData} />
      </nightingale-manager>
    </>
  );
};

export default NightingaleStructureWrapper;
