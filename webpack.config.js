const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle-[contenthash].js',
    clean: true, // Limpa a pasta de saída antes de cada nova construção
  },
  stats: {
    children: true,
    errorDetails: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Adicione presets do Babel se necessário
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource', // Usar asset modules em vez de file-loader
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /url/, // Para arquivos SVG importados como URL
            type: 'asset/inline', // Usar asset modules para SVGs importados como URL
          },
          {
            use: ['@svgr/webpack', 'file-loader'], // Para arquivos SVG importados como componentes React
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.svg'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console logs em produção
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    hints: 'warning', // ou 'error' se você quiser que falhe no build
    maxAssetSize: 400000, // 400 KiB em bytes
    maxEntrypointSize: 400000, // 400 KiB em bytes
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
      },
    }),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          plugins: [
            ['gifsicle', { interlaced: true }],
            ['jpegtran', { progressive: true }],
            ['optipng', { optimizationLevel: 5 }],
            ['svgo', {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
              ],
            }],
          ],
        },
      },
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    port: 3000,
  },
};
