const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// Определяет через переменную окружения в каком режиме выполняется процесс
const isDev = process.env.NODE_ENV === 'development'

// Формирует имя файла основываясь на значении переменной окружения
const fileName = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

// Объект конфигурации
module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: `./${fileName('js')}`,
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },

  // Локальный сервер
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    open: true,
    port: 9999,
    hot: true,
  },

  // Генерирует карты исходного кода
  devtool: isDev ? 'eval-source-map' : 'source-map',

  // Плагины
  plugins: [

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),

    new MiniCssExtractPlugin(),

  ],

  // Загрузчики
  module: {
    rules: [

      // html-loader
      // Без данного загрузчика не работает горячая замена html
      {
        test: /\.html$/i,
        loader: "html-loader",
      },

      // Компилирует SCSS в CSS
      {
        test: /\.s[ac]ss$/i,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },

      // Транспилирует JavaScript ( в формат для старых браузеров )
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ],
          }
        }
      },

      // Переносит изображения
      {
        test: /\.(png|jpg|jpeg|gif|webp)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name]-[hash][ext]'
        },
      },

      // Переносит и минифицирует SVG графику
      {
        test: /\.svg$/i,
        type: 'asset/resource',
        loader: 'svgo-loader',
        generator: {
          filename: 'svg/[name]-[hash][ext]'
        },
      },

      // Переносит шрифты
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name]-[hash][ext]'
        },
      },

    ],
  },
}
