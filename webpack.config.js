const webpack = require('webpack');

module.exports = {
    entry: {
        'pickr.es5.min.js': './src/js/pickr.js',
        'pickr.min.css': './src/scss/pickr.scss'
    },

    output: {
        publicPath: './dist/',
        filename: '[name]',
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
                use: ['babel-loader']
            },
            {
                test: /\.scss$/,
                use: ['css-loader', 'sass-loader']
            }
        ]
    },

    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: 'pickr.es5.min.js.map'
        })
    ]
};
