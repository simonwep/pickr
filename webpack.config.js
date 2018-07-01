const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJs = require('uglifyjs-webpack-plugin');

module.exports = {

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'pickr.min.css'
        })
    ],

    entry: './src/js/pickr.js',

    output: {
        path: __dirname + '/dist',
        publicPath: 'dist/',
        filename: 'pickr.min.js',
        library: 'Pickr',
        libraryTarget: 'umd'
    },

    devServer: {
        contentBase: __dirname + '/',
        host: '0.0.0.0',
        port: 8080,
        hot: true
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