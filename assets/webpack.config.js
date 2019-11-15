const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const devMode = process.env.NODE_ENV !== "production";

const config = [
  {
    name: "client",
    entry: {
      index: ["./src/index.ts"]
    },
    output: {
      path: path.join(__dirname, "../priv/static/js"),
      filename: "[name].js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
      alias: {
        react: path.resolve("./node_modules/react")
      }
    },
    devtool: "source-map",
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader"
        },
        {
          test: /\.(le|sa|sc|c)ss$/,
          use: [
            devMode ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader"
          ]
        },
        {
          test: /\.(jpg|png|svg)$/,
          use: {
            loader: "file-loader",
            options: {
              outputPath: "assets/",
              publicPath: "public/assets/"
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        __isBrowser__: true
      }),
      new MiniCssExtractPlugin(),
      new CopyPlugin([{ from: "./static", to: "../" }])
    ]
  }
];

module.exports = config;
