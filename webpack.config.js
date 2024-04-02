import pkg from './package.json' assert { type: 'json' };
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';

const { version } = pkg;

export default {
    entry: {
        'dist/pickr.es5.min': './src/js/pickr.js',
        'dist/themes/classic.min': './src/scss/themes/classic.scss',
        'dist/themes/nano.min': './src/scss/themes/nano.scss',
        'dist/themes/monolith.min': './src/scss/themes/monolith.scss'
    },

    output: {
        filename: '[name].js',
        library: {
            type: 'umd',
            name: 'Pickr',
            export: 'default',
            umdNamedDefine: true
        }
    },

    devServer: {
        static: '.',
        host: '0.0.0.0',
        port: 3006
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
        new ESLintPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(version)
        })
    ]
};
