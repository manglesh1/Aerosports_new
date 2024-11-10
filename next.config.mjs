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
    // Dynamic redirect for any URL containing "aboutus"
    {
      source: "/:path*/aboutus",
      destination: "/:path*/about-us",
      permanent: true,
    },
    // Dynamic redirect for any URL containing "aboutus"
    {
      source: "/st-catharines/attractions/open-jumps",
      destination: "/st-catharines/attractions/open-jump",
      permanent: true,
    },
    // Dynamic redirect for any URL containing "brampton" in the path
    {
      source: "/:path*/brampton",
      destination: "/oakville",
      permanent: true,
    },
	{
      source: "/:path*/contact us",
      destination:  "/:path*/contact-us",
      permanent: true,
    },
	{
      source: "/thunderbay/:path*",
      destination:  "/oakville",
      permanent: true,
    }
	,
	{
      source: "/st-catharines/glow",
      destination:  "/st-catharines/attractions/glow",
      permanent: true,
    }
	
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
