import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path'; // ✅ Safe under "verbatimModuleSyntax"
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(path.dirname(new URL(import.meta.url).pathname), './src'),
        },
    },
});
