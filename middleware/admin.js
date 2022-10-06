require('dotenv').config();
const routes = require('express').Router();
const authentication = require('./authentication');
const { User } = require('#models');

routes.use(authentication, (req, res, next) => {
  User.count({ where: { user_id: res.locals.user_id, is_admin: 1 }})
    .then((count) => {
      if (!count) return res.status(403).send({ message: 'user is not admin' });
      next();
    })
    .catch((err) => {
      console.error(err);
      return res.status(401).send({ message: err.errors[0].message });
    });
});

module.exports = routes;
