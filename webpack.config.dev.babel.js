import webpack from "webpack"
import config from "./webpack.config.base.babel"

const webpackConfig = {
    ...config,
    externals: {
      config: JSON.stringify({
        serverUrl: "http://localhost:9000"
      })
    }
}

module.exports = webpackConfig