const routes = require('express').Router();
const auth = require('../middleware/authentication');
const { User } = require('#models');

routes.use('/users', routes);
routes.get('/', auth, async (req, res) => {
  const count = await User.count();

  return res.status(200).send('Users: ' + count);
});

module.exports = routes;
