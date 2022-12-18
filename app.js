require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const app = express();

const corsOptions = {
  origin: [
    'http://192.168.1.104:5173',
    'http://192.168.1.104:4173',
    'http://192.168.1.104:9966',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:9966',
    'https://digilib.jalanrahmat.id',
    'https://api.jalanrahmat.id'
  ],
  credentials: true,
};

if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieparser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(process.env.PREFIX, routes);
app.use((req, res) => {
  return res.status(404).send({ message: 'invalid endpoint' });
});

app.listen(process.env.PORT, () => {
  console.log(`Listening to port ${process.env.PORT}`);
});
