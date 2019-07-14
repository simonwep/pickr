const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {version} = require('../package');
const bundles = require('./bundles');
const util = require('util');
const webpack = util.promisify(require('webpack'));
const path = require('path');
const fs = require('fs');

(async () => {
    const banner = new webpack.BannerPlugin({
        banner: `Pickr ${version} MIT | https://github.com/Simonwep/pickr`
    });

    // CSS
    await webpack({
        mode: 'production',
        entry: {
            'classic.min.css': path.resolve('./src/scss/themes/classic.scss'),
            'nano.min.css': path.resolve('./src/scss/themes/nano.scss'),
            'monolith.min.css': path.resolve('./src/scss/themes/monolith.scss')
        },

        output: {
            path: path.resolve('./dist/themes')
        },

        module: {
            rules: [
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
            banner,
            new FixStyleOnlyEntriesPlugin(),
            new OptimizeCSSAssetsPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name]'
            })
        ]
    }).catch(console.error);

    // Chaining promises to prevent issues caused by both filename configurations
    // writing a minified CSS file; both processes having handles on the files can
    // result in strange suffixes that fail to parse due to an extra `ap*/`
    for (const {filename, babelConfig} of bundles) {
        await webpack({
            mode: 'production',
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
                    }
                ]
            },

            plugins: [
                banner,
                new webpack.SourceMapDevToolPlugin({
                    filename: `${filename}.map`
                })
            ]
        }).catch(console.error);
    }

    console.log('Done');
})();
