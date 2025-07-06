require('dotenv').config();
const fetch = require('node-fetch');

async function run() {
  // 1. Discover the latest post URL (assumes posts stored in `public/posts/*.html` sorted by timestamp)
  const fs = require('fs');
  const path = require('path');
  const postsDir = path.join(__dirname, '..', 'public', 'posts');
  const files = fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.html'))
    .map(f => ({ file: f, time: fs.statSync(path.join(postsDir, f)).mtime }))
    .sort((a,b) => b.time - a.time);
  const latest = files[0].file;
  const slug = latest.replace('.html','');
  const postUrl = `${process.env.SITE_URL}/posts/${slug}`;
  const title = slug.replace(/-/g, ' ');
  const message = `${title}\n${postUrl}`;

  try {
    // Facebook
    await fetch(
      `https://graph.facebook.com/v16.0/me/feed?access_token=${process.env.FB_PAGE_ACCESS_TOKEN}`,
      { method: 'POST', body: new URLSearchParams({ message }) }
    );

    // Instagram (Business)
    const ig = await fetch(
      `https://graph.facebook.com/v16.0/${process.env.IG_BUSINESS_ACCOUNT_ID}/media`,
      { method: 'POST', body: new URLSearchParams({ caption: message, image_url: `${process.env.SITE_URL}/images/placeholder.jpg` }) }
    ).then(r=>r.json());
    await fetch(
      `https://graph.facebook.com/v16.0/${process.env.IG_BUSINESS_ACCOUNT_ID}/media_publish`,
      { method: 'POST', body: new URLSearchParams({ creation_id: ig.id }) }
    );

    // Twitter (X)
    await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: message })
    });

    // Reddit
    const token = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')}` },
      body: new URLSearchParams({ grant_type: 'password', username: process.env.REDDIT_USERNAME, password: process.env.REDDIT_PASSWORD })
    }).then(r=>r.json());
    await fetch(`https://oauth.reddit.com/r/${process.env.SUBREDDIT}/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'netlify-automator'
      },
      body: new URLSearchParams({ title, url: postUrl })
    });

    // Pinterest
    await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PINTEREST_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ board_id: process.env.PINTEREST_BOARD_ID, note: title, link: postUrl, media: { media_type: 'image_url', url: `${process.env.SITE_URL}/images/placeholder.jpg` } })
    });

    console.log('✅ Posted latest article to all social accounts:', postUrl);
  } catch (err) {
    console.error('❌ Social post error:', err);
    process.exit(1);
  }
}

run();