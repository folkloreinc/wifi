module.exports = {
    presets: [
        [
            require.resolve('@babel/preset-env'),
            {
                targets: {
                    node: 14,
                },
                useBuiltIns: false
            },
        ],
    ],

    plugins: [[require.resolve('@babel/plugin-transform-runtime'), {}]],

    ignore: [/node_modules\/(?!is-online|public-ip)/]
    // ignore: [
    //     (filename) => {
    //         console.log(filename);
    //         return false;
    //     },
    // ],
};
