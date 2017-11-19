const path = require('path');
const webpack = require('webpack');
function resolve (dir) {
  return path.join(__dirname, '../../', dir)
}
module.exports = function (grunt) {
  grunt.config.set('webpack', {
    dev: {
      entry: './client/web/main.js',
      output: {
        path: __dirname + '/../../assets/js',
        filename: 'main.js'
      },
      stats: {
        colors: false,
        modules: false,
        reasons: false
      },
      progress: false,
      failOnError: true,
      devtool: '#source-map',
      resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
          'vue$': 'vue/dist/vue.esm.js',
          '@': resolve('client/web'),
        }
      },
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            include: [resolve('client/web')]
          },
          {test: /\.vue$/, loader: 'vue-loader'}
        ]
      },
      plugins: [
        new webpack.optimize.CommonsChunkPlugin({name:'vendor', filename:'0_vendor.js'})
      ]
    }
  });

  grunt.registerTask('webpack', [
    'webpack:dev'
  ]);

  grunt.loadNpmTasks('grunt-webpack');
};
