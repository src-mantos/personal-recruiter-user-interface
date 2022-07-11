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
                source: '/api/data/:path*',
                destination: 'http://localhost:3000/:path*', // Proxy to Backend
            },
        ];
    },
};

module.exports = nextConfig;
