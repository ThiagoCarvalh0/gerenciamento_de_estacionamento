import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para Docker
  output: 'standalone',
  
  // Configurações de otimização
  experimental: {
    // Otimizações para produção
    optimizeCss: true,
  },
  
  // Configurações de compressão
  compress: true,
  
  // Configurações de headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
