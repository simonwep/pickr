const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJs = require('uglifyjs-webpack-plugin');

module.exports = {

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'color-picker.min.css'
        })
    ],

    entry: './src/js/color-picker.js',

    output: {
        path: __dirname + '/dist',
        publicPath: 'dist/',
        filename: 'color-picker.min.js',
        library: 'ColorPicker',
        libraryTarget: 'umd'
    },

    devServer: {
        contentBase: __dirname + '/',
        host: '0.0.0.0',
        port: 8080
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    },

    optimization: {
        minimizer: [
            new UglifyJs({
                uglifyOptions: {
                    output: {
                        comments: false
                    }
                }
            })
        ]
    }
};