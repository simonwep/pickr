module.exports = {

    plugins: [
        '@babel/plugin-proposal-object-rest-spread'
    ],

    presets: [
        [
            '@babel/preset-env',
            {
                'targets': {
                    'browsers': [
                        'Chrome >= 52',
                        'FireFox >= 44',
                        'Safari >= 7',
                        'Explorer 11',
                        'last 4 Edge versions'
                    ]
                }
            }
        ]
    ]

};