const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const merge = require('webpack-merge');

function getFile(filepath) {
    return fs.readFileSync(filepath,'utf-8');
}

const config = {
    mode: 'none',

    output: {
        path: path.resolve(__dirname, 'www'),
        filename: '[name].js'
    },
    resolve: {
        alias: {
            'vmarkdown': path.resolve(__dirname, 'www/vmarkdown.js')
        }
    },
    module: {
        rules: [
            {
                test: /\.md$/,
                use: 'text-loader'
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
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
    ],

};

module.exports = [
    merge(config, {

        entry: {
            'example-editor': path.resolve(__dirname, 'editor/editor.js'),
            'example-preview': path.resolve(__dirname, 'preview/preview.js')
        },

        plugins: [
            new HtmlWebpackPlugin({
                filename: 'index.html',
                inject: false,
                template: 'examples/index.html',
                // templateContent: function () {
                //     return getFile(path.resolve(__dirname, 'index.html'));
                // }
            }),
            new HtmlWebpackPlugin({
                filename: 'editor.html',
                template: 'examples/editor/editor.html',
                inject: false
                // templateContent: function () {
                //     let text = getFile(path.resolve(__dirname, 'index.html'));
                //     let html = text;
                //     return html;
                // }
            }),
            new HtmlWebpackPlugin({
                filename: 'preview.html',
                template: 'examples/preview/preview.html',
                inject: false
            })
        ],

        devServer: {
            hot: false,
            inline: false,
            contentBase: path.join(__dirname, "www"),
            headers: {
                "X-Custom-Foo": "bar"
            }
        }

    })
];

