import webpack from "webpack"
//var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var BrowserSyncPlugin = require("browser-sync-webpack-plugin")
var CopyWebpackPlugin = require("copy-webpack-plugin")

const webpackConfig = {
  entry: {
    main: "./ui/main/entry.js"
//    test: "./ui/main/javascripts/__tests__/all-tests.js"
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
    new BrowserSyncPlugin({
      host: "localhost",
      port: 9001,
      proxy: "http://localhost:9000/"
    }),
    new CopyWebpackPlugin([{
      from: "ui/main/index.html",
      to: "../index.html"
    }, {
      from: "ui/main/images",
      to: "../images"
    }, {
      from: "node_modules/react-datepicker/dist",
      to: "../lib/react-datepicker"
    }
    ]),
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          configFile: "ui/.eslintrc.json"
        }
      }
    }),
    new webpack.DefinePlugin({
      ENVI: JSON.stringify("develop"),
      VERSION: JSON.stringify("5fa3b9"),
      BROWSER_SUPPORTS_HTML5: true,
      TWO: "1+1",
      "typeof window": JSON.stringify("object")
    })
  ]
//  externals: {
//    'Config': JSON.stringify(process.env.NODE_ENV === undefined ? {
//      serverUrl: "https://myserver.com"
//    } : {
//      serverUrl: "http://localhost:8090"
//    })
//  }
}

export default webpackConfig
