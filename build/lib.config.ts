import {defineConfig} from 'vite';
import banner from 'vite-plugin-banner'
import pkg from "../package.json" with {type: 'json'};

export default defineConfig({
    define: {
        VERSION: JSON.stringify(pkg.version)
    },
    build: {
        sourcemap: true,
        rolldownOptions: {
          input: {
              'pickr': 'src/js/pickr.js'
          }
        },
        lib: {
            entry: 'src/js/pickr.js',
            name: 'Pickr',
            formats: ['umd', 'es'],
            fileName: (format) => {
                switch (format){
                    case 'umd':
                        return 'pickr.min.js';
                    case 'es':
                        return 'pickr.min.mjs';
                }

                return '';
            }
        }
    },
    plugins: [
        banner(`/*! Pickr ${pkg.version} MIT | https://github.com/simonwep/pickr */`)
    ],
});
