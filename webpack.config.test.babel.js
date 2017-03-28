import webpack from "webpack"
import config from "./webpack.config.base.babel"

//const plugins = [
// ...config.plugins,
// new webpack.DefinePlugin({
//   ENVI: JSON.stringify("develop"),
//   VERSION: JSON.stringify("5fa3b9"),
//   BROWSER_SUPPORTS_HTML5: true,
//   TWO: "1+1",
//   "typeof window": JSON.stringify("object")
// })
//]

const webpackConfig = {
    ...config
//    plugins
}

module.exports = webpackConfig