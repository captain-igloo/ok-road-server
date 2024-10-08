const path = require('path');

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
    mode,
    entry: {
        shared: [
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/react-fontawesome',
            '@reduxjs/toolkit',
            'bootstrap',
            'leaflet',
            'react',
            'react-bootstrap',
            'react-dom',
            'react-redux',
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
        register: {
            import: './assets/ts/register.tsx',
            dependOn: 'shared',
        }
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
            use: 'ts-loader',
        }],
    },
};
