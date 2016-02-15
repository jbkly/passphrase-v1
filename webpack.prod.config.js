var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var reactMinified = path.resolve(node_modules, 'react/dist/react.min.js');

module.exports = {
  entry: './components/app.jsx',
  resolve: {
    alias: {
      'react': reactMinified
    }
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [node_modules],
        loader: 'babel',
        query: {
          presets: ['react','es2015'],
          plugins: ['lodash']
        }
      }
    ],
    noParse: [reactMinified]
  },
  resolve: {
    extensions: ['','.js','.jsx']
  }
};
