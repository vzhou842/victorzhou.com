const express = require('express');
const path = require('path');

const app = express();

const PUBLIC_PATH = path.join(__dirname, '../public-live');

app.use(express.static(PUBLIC_PATH));

// Route legacy paths
app.use(['/contact', '/projects', '/projects/web', '/projects/iOS', '/projects/Android'], (req, res) => {
  res.redirect(301, '/about');
});
app.use('/cloak', (req, res) => {
  res.redirect(301, '/');
});

// Catch 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_PATH, '/404/index.html'));
});

const port = process.env.PORT || '8000';
app.listen(port);
console.log(`Server listening on port ${port}`);
