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
    if (err) return res.status(401).send({ message: err.message });

    res.locals.user_id = user.user_id;

    User.count({ where: { user_id: user.user_id, is_admin: 1 }})
      .then((count) => {
        if (!count) return res.status(403).send({ message: 'user is not admin' });
        next();
      })
      .catch((err) => {
        console.error(err);
        return res.status(401).send({ message: err.errors[0].message });
      });
  });
});

module.exports = routes;
