const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {version} = require('../package');
const bundles = require('./bundles');
const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');

for (const {filename, babelConfig} of bundles) {
    console.log(chalk.yellow(`[START] Build ${filename}...`));

    webpack({
        entry: path.resolve('./src/js/pickr.js'),

        output: {
            path: path.resolve('./dist'),
            filename,
            library: 'Pickr',
            libraryExport: 'default',
            libraryTarget: 'umd'
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelConfig
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
                filename: `${filename}.map`
            }),

            new webpack.BannerPlugin({
                banner: `Pickr ${version} MIT | https://github.com/Simonwep/pickr`
            })
        ]
    }, (err, stats) => {
        if (err || stats.hasErrors()) {
            console.error(err, stats);
            process.exit(-1);
        }

        const diff = stats.endTime - stats.startTime;
        console.log(chalk.green(`[SUCCESS] Build of ${filename} took ${diff}ms`));
    });
}
