const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

module.exports = {

    entry: './src/js/pickr.js',

    output: {
        path: __dirname + '/dist',
        publicPath: 'dist/',
        filename: 'pickr.min.js',
        library: 'Pickr',
        libraryExport: 'default',
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
                use: [
                    'babel-loader',
                    'eslint-loader'
                ]
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

    plugins: [

        new MiniCssExtractPlugin({
            filename: 'pickr.min.css'
        }),

        new OptimizeCssAssetsPlugin({
            cssProcessorPluginOptions: {
                preset: ['default', {discardComments: {removeAll: true}}]
            }
        }),

        new webpack.SourceMapDevToolPlugin({
            filename: 'pickr.min.js.map'
        })
    ]
};