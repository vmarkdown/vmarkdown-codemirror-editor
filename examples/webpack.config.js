const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'none',
    entry: {
        'example-main': path.resolve(__dirname, 'index.js')
    },
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: '[name].js'
    },
    resolve: {
        alias: {
        }
    },
    module: {
        rules: [
            {
                test: /\.md$/,
                use: 'text-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            }
        ]
    },
    externals: {
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'examples/index.html'
        })
    ],
    devServer: {
        hot: false,
        inline: false,
        contentBase: path.join(__dirname, "www"),
        staticOptions: {
        }
    }
};

