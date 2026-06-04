/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    // Set basePath when deploying under a sub-path (e.g., /repo-name for project pages).
    // Remove output: 'export' for SSR targets.
    // basePath: '/your-repo-name',
};

module.exports = nextConfig;
