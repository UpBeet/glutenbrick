var path = require('path');

module.exports = {
  entry: {
    app: './app/app.js',
  },

  output: {
    path: path.resolve('build'),
    filename: 'js/[name].js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'app'),
          path.resolve(__dirname, 'lib'),
        ],
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
