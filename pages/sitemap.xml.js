export async function getServerSideProps({ res }) {
  const baseUrl = "https://newstrac.org";

  const staticPages = [
    "",
    "/signals",
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages
      .map(
        (path) => `
      <url>
        <loc>${baseUrl}${path}</loc>
        <changefreq>hourly</changefreq>
        <priority>1.0</priority>
      </url>
    `,
      )
      .join("")}
  </urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default function Sitemap() {
  return null;
}