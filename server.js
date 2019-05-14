require('dotenv').config();

const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const path = require('path');
const expressip = require('express-ip');

app.use(expressip().getIpInfoMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('./api/apiRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  };

app.listen(PORT);
