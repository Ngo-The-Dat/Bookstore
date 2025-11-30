/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bookstore2k5.s3.ap-southeast-2.amazonaws.com",
      },
      // Nếu bạn có dùng ảnh placeholder thì thêm dòng dưới, không thì thôi
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

export default nextConfig;