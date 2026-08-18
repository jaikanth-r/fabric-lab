import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['172.20.10.2'],
  serverExternalPackages: ['fabric-network', 'fabric-ca-client', 'fabric-protos'],
  experimental: {
    serverActions: {
      allowedOrigins: [
        "*.app.github.dev",
        "localhost:3000",
        "localhost:3001",
        "localhost:3002",
        "localhost:3003",
        "172.20.10.2:3000"
      ]
    }
  }
};

export default nextConfig;
