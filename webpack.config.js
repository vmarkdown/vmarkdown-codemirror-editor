const path = require('path');
const merge = require('webpack-merge');

const config = {
    mode: 'none',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].common.js',
        // libraryTarget: "umd",
        libraryTarget: "commonjs2",
        library: "[name]",
        libraryExport: 'default'
    },
    module: {
        rules: [
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
    devServer: {
        // hotOnly: true,
        contentBase: path.join(__dirname, "examples")
    }
};

module.exports = [
    merge(config, {
        entry: {
            'vmarkdown-codemirror-editor': path.resolve(__dirname, 'src/index.js'),
        },
        output: {
            library: "CodeMirrorEditor",
        },
        externals: {
        }
    })
];

