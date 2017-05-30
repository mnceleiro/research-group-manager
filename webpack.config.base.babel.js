import webpack from "webpack"
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var CopyWebpackPlugin = require("copy-webpack-plugin")

const webpackConfig = {
  devtool: "eval",
  entry: {
    main: "./ui/main/entry.js"
  },
  output: {
    path: __dirname + "/public/assets/compiled",
    filename: "[name].bundle.js"
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loaders: ["babel-loader?presets[]=es2015&presets[]=stage-0&presets[]=react", "eslint-loader"],
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      loader: "css-to-string-loader!style-loader!css-loader!?sourceMap"
    }, {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff"
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url-loader?limit=10000&mimetype=application/octet-stream"
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: "file-loader"
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: "url-loader?limit=10000&mimetype=image/svg+xml"
    },
    {
      test: /\.(png|jpg|gif)$/,
      loader: "file-loader?name=images/img-[hash:6].[ext]"
    },
    {
      test: /\.(png|jpg|gif)$/,
      loader: "url-loader?limit=5000&name=img/img-[hash:6].[ext]"
    },
    {
      test: /\.(html)$/,
      loader: "file-loader"
    },
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: "css-loader!sass-loader"
      })
    }]
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
    new CopyWebpackPlugin([{
      from: "ui/main/index.html",
      to: "../index.html"
    }, {
      from: "ui/main/images",
      to: "../images"
    }, {
      from: "node_modules/react-datepicker/dist",
      to: "../lib/react-datepicker"
    }, {
      from: "node_modules/react-select/dist",
      to: "../lib/react-select"
    }, {
      from: "node_modules/react-big-calendar/lib/css/react-big-calendar.css",
      to: "../lib/react-big-calendar"
    }, {
      from: "node_modules/pnotify/dist",
      to: "../lib/pnotify"
    }])
  ]
}

export default webpackConfig
