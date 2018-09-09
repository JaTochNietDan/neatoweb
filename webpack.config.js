const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    watch: true,
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'docs')
    },
    mode: 'development',
    node: {
        fs: "empty"
    },
    plugins: [
        new webpack.ProvidePlugin({
            Neato: '../libs/neato-0.9.0.min.js',
            $: 'jquery',
            CryptoJS: 'crypto-js'
        })
    ],
    module: {
        rules: [
            {
                test: require.resolve('./libs/neato-0.9.0.min.js'),
                use: 'exports-loader?Neato'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.vue$/,
                use: ['vue-loader']
            }
        ]
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    }
};