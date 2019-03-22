const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

const isDevMode = process.argv.includes('development');
const isES5Mode = process.argv.includes('es5') || isDevMode;

const babelLoaderConfigurationES5 = {
    presets: [
        [
            '@babel/env',
            {
                targets: '> 1%'
            }
        ]
    ]
};

module.exports = {
    entry: './src/js/pickr.js',

    output: {
        path: __dirname + '/dist',
        publicPath: 'dist/',
        filename: isES5Mode ? 'pickr.es5.min.js' : 'pickr.min.js',
        library: 'Pickr',
        libraryExport: 'default',
        libraryTarget: 'umd'
    },

    devServer: {
        contentBase: __dirname + '/',
        host: '0.0.0.0',
        port: 3005
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: isES5Mode ? babelLoaderConfigurationES5 : {}
                    },
                    'eslint-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
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
            filename: isES5Mode ? 'pickr.es5.min.js.map' : 'pickr.min.js.map'
        })
    ]
};
