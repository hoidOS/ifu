// Hosts allowed to open the dev server from other devices, e.g. ALLOWED_DEV_ORIGINS=192.168.1.158 in .env.local.
const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  allowedDevOrigins,

  // images: {
  //   loader: 'imgix',
  //   path: '',
  // },

}

module.exports = nextConfig
