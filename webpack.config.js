const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        'pickr.es5.min': './src/js/pickr.js',
        'pickr.min': './src/scss/themes/default.scss',
        'pickr.monolith.min': './src/scss/themes/monolith.scss'
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
        host: '0.0.0.0',
        port: 3005
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
        new FixStyleOnlyEntriesPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
};
