const fs = require("fs");
const path = require("path");

// const webpack = require("webpack");
const camelCase = require("camelcase");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const PACKAGE_ROOT_PATH = process.cwd();
const PKG_JSON = require(path.join(PACKAGE_ROOT_PATH, "package.json"));

const doesFileExists = path => {
  try {
    fs.statSync(path);
    return true;
  } catch (_) {
    return false;
  }
};

const config = {
  entry: [
    doesFileExists("./src/index.ts") ? "./src/index.ts" : "./src/index.js"
  ],
  output: {
    path: path.resolve(PACKAGE_ROOT_PATH, "dist"),
    library: camelCase(PKG_JSON.name, { pascalCase: true }),
    filename: `${PKG_JSON.name}.js`
  },
  target: "web",
  devtool: "source-map",
  resolve: {
    extensions: [".js", ".ts"],
    alias: {
      react: path.resolve("./node_modules/react")
    }
  },
  externals: {
    d3: "d3",
    litemol: "LiteMol",
    "protvista-zoomable": "ProtvistaZoomable",
    "protvista-track": "ProtvistaTrack",
    "protvista-feature-adapter": "ProtvistaFeatureAdapter",
    "protvista-utils": "ProtvistaUtils",
    "protvista-sequence": "ProtvistaSequence"
  },
  plugins: [new CleanWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader", options: { importLoaders: 1 } }
        ]
      },
      {
        test: /\.(js|ts)$/,
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            include: [
              "src",
              path.resolve("node_modules", "lit-html"),
              path.resolve("node_modules", "lit-element"),
              // msa-viewer addded here to reuse the same react.
              path.resolve("node_modules", "react-msa-viewer")
            ],
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    ie: 11,
                    browsers: "last 2 versions"
                  },
                  modules: false,
                  plugins: [
                    "@babel/plugin-proposal-object-rest-spread",
                    "@babel/plugin-proposal-class-properties"
                  ]
                }
              ],
              ["@babel/preset-typescript"]
            ],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  regenerator: true
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader?classPrefix"
      }
    ]
  }
};

module.exports = config;
