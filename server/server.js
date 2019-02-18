const express = require('express');
const path = require('path');

const PUBLIC_PATH = path.join(__dirname, '../public-live');

const app = express();

app.use(express.static(PUBLIC_PATH));

// Route legacy paths
app.use(
  [
    '/contact',
    '/contact.html',
    '/projects',
    '/projects/web',
    '/projects/iOS',
    '/projects/Android',
    '/presskits',
  ],
  (req, res) => {
    res.redirect(301, '/about/');
  },
);
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
