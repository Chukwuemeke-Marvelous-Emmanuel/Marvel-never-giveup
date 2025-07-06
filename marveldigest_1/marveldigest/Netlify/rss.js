const { readFileSync, readdirSync } = require('fs');
const { resolve, extname } = require('path');
const matter = require('gray-matter');
const RSS = require('rss');

exports.handler = async () => {
  try {
    // 1) Read all .md files in content/posts
    const postsDir = resolve(__dirname, '..', 'content', 'posts');
    const filenames = readdirSync(postsDir).filter(f => extname(f) === '.md');

    // 2) Parse front-matter into an array of post objects
    const posts = filenames.map(name => {
      const file = readFileSync(resolve(postsDir, name), 'utf-8');
      const { data } = matter(file);
      return data;  // { title, slug, date, excerpt, author, image }
    });

    // 3) Create feed
    const feed = new RSS({
      title: 'MarvelDigest',
      description: 'News, articles, history & products from MarvelDigest',
      feed_url: 'https://marveldigest.com/rss.xml',
      site_url: 'https://marveldigest.com',
      image_url: 'https://marveldigest.com/logo.png',
      managingEditor: 'Marvelous Emmanuel (editor@marveldigest.com)',
      webMaster: 'Marvelous Emmanuel (webmaster@marveldigest.com)',
      language: 'en',
      pubDate: new Date().toUTCString(),
      ttl: '60',
    });

    // 4) Add each post to the feed
    posts
      // optional: sort by date descending
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(post => {
        const url = `https://marveldigest.com/${post.slug}`;
        feed.item({
          title: post.title,
          description: post.excerpt,
          url,
          guid: url,
          author: post.author,
          date: post.date,
          enclosure: post.image ? { url: post.image } : undefined,
        });
      });

    // 5) Return XML
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=0, s-maxage=3600'
      },
      body: feed.xml({ indent: true })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'RSS generation failed.' };
  }
};
