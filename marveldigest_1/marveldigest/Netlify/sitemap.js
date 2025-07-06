const { SitemapStream, streamToPromise } = require('sitemap');
const { readFileSync } = require('fs');

exports.handler = async function() {
  // Example: read your posts list from a JSON file
  const posts = JSON.parse(readFileSync('./content/posts.json'));
  const sitemap = new SitemapStream({ hostname: 'https://marveldigest.com' });

  posts.forEach(post => {
    sitemap.write({ url: `/${post.slug}`, changefreq: 'daily', priority: 0.8 });
  });
  sitemap.end();

  const xml = (await streamToPromise(sitemap)).toString();
  return { statusCode: 200, headers: { 'Content-Type': 'application/xml' }, body: xml };
};



<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
