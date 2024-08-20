const path = require('path');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
    mode,
    entry: {
        shared: [
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/react-fontawesome',
            'bootstrap',
            'react',
            'react-bootstrap',
            'react-dom',
        ],
        index: {
            import: './assets/ts/index.tsx',
            dependOn: 'shared',
        },
        login: {
            import: './assets/ts/login.tsx',
            dependOn: 'shared',
        },
        map: {
            import: './assets/ts/map.tsx',
            dependOn: 'shared',
        },
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
