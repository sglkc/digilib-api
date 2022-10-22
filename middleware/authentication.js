require('dotenv').config();
const routes = require('express').Router();
const jwt = require('jsonwebtoken');
const { User } = require('#models');

routes.use((req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization && !req.query.token) {
    return res.status(401).send({ message: 'NO_TOKEN' });
  }

  const token = req.query.token || authorization.replace('Bearer ', '');

  if (!token) return res.status(401).send({ message: 'INVALID_TOKEN' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).send({ message: err.message });

    res.locals.user_id = user.user_id;

    User.findOne({ where: { user_id: user.user_id }})
      .then(() => next())
      .catch((err) => {
        console.error(err);
        return res.status(401).send({ message: 'USER_NOT_FOUND' });
      });
  });
});

module.exports = routes;
