var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
  entry: './ui/entry.js',
  output: { 
	  path: __dirname + '/public/compiled', 
	  filename: 'bundle.js' 
  },
  module: {
    loaders: [{ 
	  test: /\.jsx?$/, 
	  loader: 'babel-loader', 
	  include: /ui/, 
	  query: { presets: ['es2015', 'stage-0', 'react'] } 
    },
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader?sourceMap'
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
	  test: /\.scss$/,
	  loader: ExtractTextPlugin.extract({
		  fallback: 'style-loader', 
		  use: 'css-loader!sass-loader'
	  })
	}]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 9001,
      proxy: 'http://localhost:9000/'
    })
  ]
}