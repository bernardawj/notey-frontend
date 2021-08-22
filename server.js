const express = require('express');

const app = express();

app.use(express.static('./dist/notey-frontend'));

app.get('/*', (req, res) => {
  res.sendfile('index.html', {
    root: 'dist/notey-frontend/'
  });
});

app.listen(process.env.PORT || 8080);
