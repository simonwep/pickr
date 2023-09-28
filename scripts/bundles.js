module.exports = [
    {
        'filename': 'pickr.es5.min.js',
        'babelConfig': {
            'babelrc': false,
            'presets': [
                [
                    '@babel/preset-env',
                    {
                        'targets': '> 1%, ie 11',
                        'useBuiltIns': 'usage',
                        'corejs': 3,
                        'loose': true
                    }
                ]
            ]
        }
    },
    {
        'filename': 'pickr.min.js',
        'babelConfig': {
            'babelrc': false,
            'presets': [
                [
                    '@babel/preset-env',
                    {
                        'targets': '> 1.5%, not dead, not ie <= 11'
                    }
                ]
            ]
        }
    }
];
