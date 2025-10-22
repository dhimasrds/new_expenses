import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  
  // Optimizations
  experimental: {
    // optimizeCss: true, // Disabled to avoid critters error
    browserDebugInfoInTerminal: true, // Enable browser debug info in terminal
  },
  
  // API rewrites for development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3002/api/:path*', // Proxy to backend on port 3002
      },
    ];
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'expense-tracker',
  },
};

export default nextConfig;
