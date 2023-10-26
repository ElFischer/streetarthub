/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
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
            },
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: ''
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: ''
            },
            {
                protocol: 'https',
                hostname: 'plus.unsplash.com',
                port: ''
            }
        ]
    }
}

module.exports = nextConfig