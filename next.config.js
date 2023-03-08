const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
    rewrites: async () => {
        return [
            {
                source: '/dataservice/:path*',
                destination: 'http://localhost:3000/v1/:path*', // Proxy to Backend
            },
        ];
    },
    output: 'standalone',
};

module.exports = nextConfig;
