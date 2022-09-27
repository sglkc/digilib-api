require('dotenv').config();
const routes = require('express').Router();
const jwt = require('jsonwebtoken');
const { User } = require('#models');

routes.use((req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ message: 'authorization header not set' });
  }

  const [, token] = authorization.split(' ');

  if (!token) return res.status(401).send({ message: 'token not set' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).send({ message: err });

    delete user.iat;
    delete user.exp;

    User.findOne({ where: { ...user }})
      .then(() => next())
      .catch((err) => {
        console.error(err);
        return res.status(401).send({ message: err });
      });
  });
});

module.exports = routes;
