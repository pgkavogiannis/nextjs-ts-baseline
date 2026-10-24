const nextConfig = require('eslint-config-next/core-web-vitals');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

module.exports = [
    // Vitest's HTML coverage report; eslint-config-next ignores only Next.js build output.
    { ignores: ['coverage/**'] },
    ...nextConfig,
    {
        plugins: {
            'react-hooks': reactHooksPlugin,
        },
        rules: {},
    },
];
