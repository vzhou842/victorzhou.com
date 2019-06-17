// This is a super simple web server, so there's no need to use Flow here.
const express = require('express');
const path = require('path');
const { PUBLIC_PATH } = require('./constants');
const initSubscribeAPI = require('./subscribe');


const app = express();

// Serve the public folder
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

// Redirect categories to tags
app.use('/category/:id', (req, res) => {
  res.redirect(301, `/tag/${req.params.id}/`);
});
app.use('/categories/', (req, res) => {
  res.redirect(301, '/tags/');
});

// Subscribe API
initSubscribeAPI(app);

// Catch 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_PATH, '/404/index.html'));
});

const port = process.env.PORT || '8000';
app.listen(port);
console.log(`Server listening on port ${port}`);
