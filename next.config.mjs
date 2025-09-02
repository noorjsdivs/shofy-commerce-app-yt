/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Cloudflare Pages configuration - remove static export since we have API routes
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Cloudflare Pages optimization
  poweredByHeader: false,
  // External packages for server components (updated syntax for Next.js 15+)
  serverExternalPackages: ["firebase-admin"],
  // Optimize for Cloudflare Pages
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
