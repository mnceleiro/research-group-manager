import webpack from "webpack"
import config from "./webpack.config.base.babel"

const webpackConfig = {
    ...config,
    devtool: "source-map"
}

module.exports = webpackConfig