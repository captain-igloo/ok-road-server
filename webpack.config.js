const path = require('path');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
    mode,
    entry: {
        app: './assets/ts/index.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name].bundle.js',
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: 'babel-loader',
        }],
    },
};
