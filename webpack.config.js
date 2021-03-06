const path = require('path');
const merge = require('webpack-merge');
// const ExtractTextPlugin = require("extract-text-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const production = (process.env.NODE_ENV === 'production');

module.exports = {
    mode: 'none',
    entry: {
        'vmarkdown-codemirror-editor': path.resolve(__dirname, 'src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: production?'[name].[hash].min.js':'[name].js',
        libraryTarget: "umd",

        // filename: '[name].common.js',
        // libraryTarget: "commonjs2",

        // library: "[name]",
        // libraryExport: 'default',
        library: "CodeMirrorEditor"
    },
    module: {
        rules: [

            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    // 'postcss-loader',
                    'sass-loader',
                ],
            }

            // {
            //     test: /\.scss$/,
            //     use: ExtractTextPlugin.extract({
            //         fallback: 'style-loader',
            //         use: ['css-loader', 'sass-loader']
            //     })
            // },

            // {
            //     test: /\.scss$/,
            //     use: [
            //         "style-loader",
            //         "css-loader",
            //         "sass-loader"
            //     ]
            // }
        ]
    },
    externals: {
    },
    plugins: [
        // new ExtractTextPlugin("vmarkdown-codemirror-editor.css")
        new MiniCssExtractPlugin({
            filename: production?'[name].[hash].min.css':'[name].css'
        })
    ],
    optimization: {
        // runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vmarkdown-codemirror-editor-vendors',
                    enforce: true,
                    chunks: 'all'
                }
            }
        }
    }
};

