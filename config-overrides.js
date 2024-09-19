const webpack = require('webpack');
const path = require('path');

module.exports = function override(config, env) {
    config.resolve.fallback = {
        ...config.resolve.fallback,
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify")
    };
    
    config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ];

    config.resolve.alias = {
        ...config.resolve.alias,
        'crypto-browserify': path.resolve(__dirname, 'node_modules/crypto-browserify'),
    };

    return config;
}
