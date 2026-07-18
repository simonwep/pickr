import {defineConfig} from 'vite';
import pkg from "../package.json" with {type: 'json'};

export default defineConfig({
    base: '',
    define: {
        VERSION: JSON.stringify(pkg.version)
    }
});
