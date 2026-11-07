const path = require('path');
const express = require('express');

const app = express();
const publicDir = path.join(__dirname, 'public');

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  });
  next();
});

app.use(express.static(publicDir, { extensions: ['html'], maxAge: '1h' }));

app.get('/healthz', (req, res) => res.json({ ok: true }));

app.use((req, res) => {
  res.status(404).sendFile(path.join(publicDir, 'index.html'));
});

// Vercel imports the app; locally `node server.js` starts a listener.
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Portfolio running at http://localhost:${port}`));
}

module.exports = app;
