import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'happy-dom',
        setupFiles: ['./vitest.setup.mts'],
        // The template ships no sources, so `make ci` must pass before the first test exists.
        passWithNoTests: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            // Count every source file, not just the ones imported by tests —
            // otherwise untested modules are silently absent from the report.
            // Covers both a root layout (app/, components/) and a src/ layout.
            include: ['{app,pages,components,hooks,lib,src}/**/*.{ts,tsx}'],
            exclude: ['**/*.d.ts'],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            },
        },
    },
});
