module.exports = (api) => {
    api.cache(true);

    return {
        env: {
            development: {
                sourceMaps: 'inline',
            }
        },
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: {
                        node: '8.0.0',
                    },
                },
            ],
        ],
    };
};
