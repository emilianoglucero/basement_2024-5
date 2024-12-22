const siteURL = new URL(process.env.NEXT_PUBLIC_SITE_URL)

export default {
  siteUrl: siteURL.href,
  generateRobotsTxt: true,
  exclude: []
}
