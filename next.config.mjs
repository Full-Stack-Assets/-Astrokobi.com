/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Keep Render's small build instance from spawning too many prerender
    // workers while generating the site's large tag archive.
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 50,
    webpackMemoryOptimizations: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
  },
};

export default nextConfig;
