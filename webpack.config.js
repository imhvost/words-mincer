const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LessPluginAutoPrefix = require('less-plugin-autoprefix')
const autoprefix = new LessPluginAutoPrefix({
  browsers: ['last 5 versions', 'IE >= 10']
})
const LessPluginCleanCSS = require('less-plugin-clean-css')
const cleanCSSPlugin = new LessPluginCleanCSS({advanced: true})
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const WriteFilePlugin = require('write-file-webpack-plugin')
const NODE_ENV = process.env.NODE_ENV
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: NODE_ENV === 'development' ? 'development' : 'production',
  output: {
    publicPath: '/',
    globalObject: 'this'
  },
  devServer: {
    hot: false,
    historyApiFallback: true,
    watchOptions: {
      poll: true
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: 'vue-loader'
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use:
        [
          {
            loader: 'vue-style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              plugins: [
                autoprefix,
                cleanCSSPlugin
              ]
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|ttf|eot|jpg|png)$/,
        exclude: /node_modules/,
        loader: 'file-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(js|vue)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true
        },
        enforce: 'pre'
      },
      {
        test: /\.(mp3|wav)$/,
        exclude: /node_modules/,
        loader: 'url-loader'
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.worker\.js$/,
        exclude: /node_modules/,
        use: { loader: 'worker-loader' }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new WriteFilePlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './src/static'),
        to: path.resolve(__dirname, './dist/static'),
        toType: 'dir'
      },
      {
        from: path.resolve(__dirname, './src/data'),
        to: path.resolve(__dirname, './dist/data'),
        toType: 'dir'
      },
      {
        from: path.resolve(__dirname, 'share.php'),
        to: path.resolve(__dirname, './dist/share.php')
      },
      {
        from: path.resolve(__dirname, 'manifest.json'),
        to: path.resolve(__dirname, './dist/manifest.json')
      }
    ]),
    new SWPrecacheWebpackPlugin({
      cacheId: 'words-mincer',
      filename: 'service-worker.js',
      staticFileGlobs: ['dist/**/*.{ttf,woff,woff2,js,html,css,mp3,jpg,svg}'],
      minify: true,
      stripPrefix: 'dist/',
      dontCacheBustUrlsMatching: /\.\w{6}\./
    })
    // new BundleAnalyzerPlugin()
  ]
}
