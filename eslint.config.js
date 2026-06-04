const nextConfig = require('eslint-config-next/core-web-vitals');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

module.exports = [
    ...nextConfig,
    {
        plugins: {
            'react-hooks': reactHooksPlugin,
        },
        rules: {},
    },
];
