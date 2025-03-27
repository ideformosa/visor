module.exports = {
  entry: './script/app/app.js',
  devServer: {
    port: 9009,
    hot: true,
    host: '0.0.0.0',
    stats: {
      colors: true
    }
  }
};
