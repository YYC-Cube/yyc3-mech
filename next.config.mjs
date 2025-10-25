/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 不再忽略ESLint和TypeScript错误，确保代码质量
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // 图片优化配置
  images: {
    domains: ["placeholder.com"],
    unoptimized: false,
    formats: ['image/webp', 'image/avif'], // 添加AVIF格式支持
    minimumCacheTTL: 86400, // 增加缓存时间至1天
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 性能优化配置
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true,
    emotion: false, // 禁用emotion支持，因为未安装
  },
  // 静态资源压缩
  compress: true,
  // 代码分割
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'recharts'],
  },
  // 服务器外部包配置
  serverExternalPackages: ['@radix-ui'],
  // 缓存策略优化
  headers: async () => {
    const common = [
      {
        key: 'Cache-Control',
        value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      },
      { key: 'X-Frame-Options', value: 'DENY' },
    ];

    const security = process.env.NODE_ENV === 'production' ? [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; img-src 'self' data: blob: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https: ws:; media-src 'self' https:; frame-ancestors 'none'",
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      { key: 'Referrer-Policy', value: 'no-referrer' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] : [];

    return [
      {
        source: '/(.*)',
        headers: [...common, ...security],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, immutable, max-age=31536000' },
        ],
      },
    ];
  },
  // 确保在Vercel上正确处理API路由
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
  // 添加环境变量配置
  env: {
    BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  },
  // 添加模块解析配置
  webpack: (config, { isServer, webpack }) => {
    // 添加模块解析别名
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": ".",
    };
    
    // 生产环境下的额外优化
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 20,
        })
      );
    }
    
    return config;
  },
};

export default nextConfig;
