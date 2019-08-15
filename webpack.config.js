const path = require('path');

module.exports = {
  entry: {
    app: './main.js'
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        "presets" : ["env"]
      }
    }]
  }
}