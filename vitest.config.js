import {defineConfig} from 'vitest/config';

export default defineConfig({
    define: {
        VERSION: JSON.stringify('test')
    },
    test: {
        environment: 'jsdom'
    }
});
