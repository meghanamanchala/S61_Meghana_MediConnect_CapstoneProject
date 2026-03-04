const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index.js');

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(routes);

app.get('/', (req, res) => {
  res.status(200).send('Connected to DB');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
