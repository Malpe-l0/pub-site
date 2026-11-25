import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  serverExternalPackages: ['better-sqlite3', 'sharp'],
  poweredByHeader: false,
  logging: { serverFunctions: false, incomingRequests: { ignore: [/\/admin\/instagram\/callback/] } },
  experimental: { serverActions: { bodySizeLimit: '45mb' } },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https://www.instagram.com" },
      ...(process.env.NODE_ENV === 'production' ? [{key:'Strict-Transport-Security',value:'max-age=31536000'}] : []),
    ] }, { source: '/admin/:path*', headers: [{key:'Cache-Control',value:'private, no-store'},{key:'X-Robots-Tag',value:'noindex, nofollow'}] }]
  },
}
export default nextConfig
