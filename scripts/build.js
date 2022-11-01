const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {version} = require('../package');
const bundles = require('./bundles');
const util = require('util');
const webpack = util.promisify(require('webpack'));
const path = require('path');

(async () => {
    const banner = new webpack.BannerPlugin(`Pickr ${version} MIT | https://github.com/Simonwep/pickr`);

    // CSS
    await webpack({
        mode: 'production',
        entry: {
            'classic': path.resolve('./src/scss/themes/classic.scss'),
            'monolith': path.resolve('./src/scss/themes/monolith.scss'),
            'nano': path.resolve('./src/scss/themes/nano.scss')
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
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        require('autoprefixer')
                                    ]
                                }
                            },
                        },
                        'sass-loader'
                    ]
                }
            ]
        },

        plugins: [
            banner,
            new RemoveEmptyScriptsPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].min.css'
            })
        ]
    });

    // Chaining promises to prevent issues caused by both filename configurations
    // writing a minified CSS file; both processes having handles on the files can
    // result in strange suffixes that fail to parse due to an extra `ap*/`
    for (const {filename, babelConfig} of bundles) {
        console.log(`Create ${filename}`);

        await webpack({
            mode: 'production',
            entry: path.resolve('./src/js/pickr.js'),

            output: {
                filename,
                path: path.resolve('./dist'),
                library: 'Pickr',
                libraryExport: 'default',
                libraryTarget: 'umd'
            },

            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /@babel(?:\/|\\{1,2})runtime|core-js/,
                        include: [
                            path.join(__dirname, '..', 'node_modules/nanopop'),
                            path.join(__dirname, '..', 'src')
                        ],
                        use: [
                            {
                                loader: 'babel-loader',
                                options: babelConfig
                            }
                        ]
                    }
                ]
            },

            plugins: [
                banner,
                new webpack.SourceMapDevToolPlugin({
                    filename: `${filename}.map`
                }),
                new webpack.DefinePlugin({
                    VERSION: JSON.stringify(version)
                })
            ],

            optimization: {
                minimizer: [
                    new TerserPlugin({
                        extractComments: false
                    })
                ]
            }
        });
    }

    console.log('Done');
})();
