module.exports = {
    presets: [
        [
            require.resolve('@babel/preset-env'),
            {
                targets: {
                    node: 12,
                },
                useBuiltIns: false,
            },
        ],
    ],

    plugins: [[require.resolve('@babel/plugin-transform-runtime'), {}]],

    include: [/src/, /node_modules\/is-online/],
};
