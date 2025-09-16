// Environment
export const isProd = process.env.NODE_ENV === "production";
const _APP_ = {
  name: "SelfUpgrad",
  description: "AI-powered platform to create and sell online courses",
  base_url: isProd ? "https://selfupgrad.vercel.app" : "http://localhost:3000",
};

export default _APP_;
