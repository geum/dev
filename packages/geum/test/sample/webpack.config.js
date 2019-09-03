const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: [
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './client/index.js'
    ]
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: { presets: ['@babel/env'] }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: { extensions: ['*', '.js', '.jsx'] },
  output: {
    path: path.resolve(__dirname, 'client/'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
};
