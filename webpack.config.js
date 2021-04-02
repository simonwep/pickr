const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {version} = require('./package.json');
const webpack = require('webpack');

module.exports = {
    entry: {
        'pickr.es5.min': './src/js/pickr.js',
        'themes/classic.min': './src/scss/themes/classic.scss',
        'themes/nano.min': './src/scss/themes/nano.scss',
        'themes/monolith.min': './src/scss/themes/monolith.scss'
    },

    output: {
        publicPath: 'dist',
        filename: '[name].js',
        library: 'Pickr',
        libraryExport: 'default',
        libraryTarget: 'umd'
    },

    devServer: {
        contentBase: `${__dirname}/`,
        disableHostCheck: true,
        host: '0.0.0.0',
        port: 3006
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(version)
        })
    ]
};
