const nextConfig = require('eslint-config-next/core-web-vitals');
const nextTypescript = require('eslint-config-next/typescript');

module.exports = [
    // Vitest's HTML coverage report; eslint-config-next ignores only Next.js build output.
    { ignores: ['coverage/**'] },
    // core-web-vitals registers the react-hooks plugin and rules; typescript adds typescript-eslint's recommended set.
    ...nextConfig,
    ...nextTypescript,
    {
        // Tool config files are CommonJS (this one included), so `require()` is how they load plugins.
        files: ['**/*.config.{js,cjs}'],
        rules: { '@typescript-eslint/no-require-imports': 'off' },
    },
];
