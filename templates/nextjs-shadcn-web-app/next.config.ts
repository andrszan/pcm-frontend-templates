import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 关闭严格模式以避免开发中的双重渲染
  reactStrictMode: process.env.NODE_ENV === "production",
  output: undefined, // 默认打包方式，支持npm run start部署启动
  // output: "standalone",
};

export default nextConfig;
