/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_DOMAIN:
      process.env.NEXT_PUBLIC_DOMAIN || 'https://bolao-api.onrender.com/v1',
  },
};

export default nextConfig;
