const fs = require('fs');
const babelrc = JSON.parse(fs.readFileSync('.babelrc'));

module.exports = [
    {
        'filename': 'pickr.es5.min.js',
        'babelConfig': {
            ...babelrc,
            'presets': [
                [
                    '@babel/preset-env',
                    {
                        'targets': '> 1%'
                    }
                ]
            ]
        }
    },
    {
        'filename': 'pickr.min.js',
        'babelConfig': {
            ...babelrc,
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
