const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {version} = require('../package');
const bundles = require('./bundles');
const webpack = require('webpack');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

for (const {filename, babelConfig} of bundles) {
    console.log(chalk.yellow(`[START] Build ${filename}...`));

    webpack({
        entry: path.resolve('./src/js/pickr.js'),

        mode: 'production',

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
                        'eslint-loader',
                        'thread-loader'
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader',
                        'thread-loader'
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

        const oo = stats.compilation.outputOptions;
        const fstats = fs.statSync(path.resolve(oo.path, oo.filename));
        const bundleSize = readableByteSize(fstats.size);
        const diff = stats.endTime - stats.startTime;
        console.log(chalk.green(`[SUCCESS] Build of ${filename} took ${diff}ms ${chalk.magenta(`(${bundleSize})`)}`));
    });
}

function readableByteSize(bytes, mapValue = v => v) {
    const si = false;
    const unit = si ? 1000 : 1024;
    const block = bytes / unit;

    if (block < 1) {
        return `${bytes} B`;
    }

    for (let i = 1; i <= 6; i++) {
        if (block < Math.pow(unit, i)) {
            const size = Number((block / Math.pow(unit, i - 1)).toFixed(2));
            const desc = ' ' + (si ? 'kMGTPEB' : 'kMGTPEiB').charAt(i - 1) + (si ? '' : 'i') + 'B';
            return mapValue(size) + desc;
        }
    }

    return `${bytes} B`;
}
