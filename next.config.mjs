/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "www.aerosportsparks.ca",
        port: "",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:8080",
  },
};

export default nextConfig;
