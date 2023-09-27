/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: ''
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                port: ''
            }
        ]
    }
}

module.exports = nextConfig