import webpack from "webpack"
import config from "./webpack.config.base.babel"
var BrowserSyncPlugin = require("browser-sync-webpack-plugin")

const webpackConfig = {
    ...config,
    plugins: [
      ...config.plugins,
      new webpack.LoaderOptionsPlugin({
        options: {
          eslint: {
            configFile: "ui/.eslintrc.json"
          }
        }
      }),
      new BrowserSyncPlugin({
        host: "localhost",
        port: 9001,
        proxy: "http://localhost:9000/"
      }),
    ]
}

module.exports = webpackConfig