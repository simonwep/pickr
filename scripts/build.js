import pkg from '../package.json' assert { type: 'json' };
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import autoprefixer from 'autoprefixer';
import bundles from './bundles.js';
import util from 'util';
import path from 'path';
import url from 'url';
import webpack from 'webpack';

const asyncWebpack = util.promisify(webpack);
const dirname = path.dirname(url.fileURLToPath(import.meta.url));
const { version } = pkg;

(async () => {
    const banner = new webpack.BannerPlugin(`Pickr ${version} MIT | https://github.com/Simonwep/pickr`);

    // CSS
    console.log('Bundle themes');
    await asyncWebpack({
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
                                        autoprefixer
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
        console.log(`Bundle ${filename}`);

        await asyncWebpack({
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
                            path.join(dirname, '..', 'node_modules/nanopop'),
                            path.join(dirname, '..', 'src')
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
})();
