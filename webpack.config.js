const path = require('path');

module.exports = {
  mode: 'production', // Use 'development' for debugging
  entry: path.resolve(__dirname, 'src', 'langchain-entry.js'),

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'langchain.js',
    clean: true, // Clean the output directory before each build
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
