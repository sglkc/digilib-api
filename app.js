require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(cors());
app.use(helmet());
app.options('*', cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('Hello world');
});

app.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});
