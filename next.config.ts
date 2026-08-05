import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    // 禁用图片优化以避免付费服务
    unoptimized: true,
  },

  // 优化预加载
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },

  // 跳过构建时的 ESLint 检查，避免 lint 规则阻断部署
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;