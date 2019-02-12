const express = require('express');
const path = require('path');
const fs = require('fs');

const PUBLIC_PATH = path.join(__dirname, '../public-live');
const BLOG_DIR_PATH = path.join(PUBLIC_PATH, 'blog');

// Read the /blog/ dir for posts
const blogPostMap = {};
fs.readdirSync(BLOG_DIR_PATH).forEach(post => {
  blogPostMap[post] = true;
});

const app = express();

app.get('/blog/:post', (req, res, next) => {
  const { post } = req.params;
  if (blogPostMap[post]) {
    res.sendFile(path.join(BLOG_DIR_PATH, post, 'index.html'));
  } else {
    next();
  }
});

app.use(express.static(PUBLIC_PATH));

// Route legacy paths
app.use(['/contact', '/projects', '/projects/web', '/projects/iOS', '/projects/Android'], (req, res) => {
  res.redirect(301, '/about');
});
app.use(['/blog', '/cloak'], (req, res) => {
  res.redirect(301, '/');
});

// Catch 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_PATH, '/404/index.html'));
});

const port = process.env.PORT || '8000';
app.listen(port);
console.log(`Server listening on port ${port}`);
