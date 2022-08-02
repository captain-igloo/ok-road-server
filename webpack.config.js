const path = require('path');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
    mode,
    entry: {
        login: './assets/ts/login.tsx',
        map: './assets/ts/map.tsx',
        register: './assets/ts/register.tsx',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'public/js'),
    },
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'ts-loader',
            },
        },{
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
        }],
    },
};
