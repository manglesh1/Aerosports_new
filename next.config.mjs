/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/brampton",
        destination: "/oakville",
        permanent: true,
      },
      {
        source: "/oakville/programs/summerpass",
        destination: "/oakville/programs/camps",
        permanent: true,
      },
    ];
  },
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
    NEXT_PUBLIC_API_URL: "https://apis-351216.nn.r.appspot.com/api",
    NEXT_PUBLIC_BASE_URL: "https://www.aerosportsparks.ca",
  },
};

export default nextConfig;
