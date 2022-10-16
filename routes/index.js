const fs = require('fs');
const path = require('path');
const routes = require('express').Router();

/*
 * Require every .js files in directory and use the routes
 */
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.endsWith('.js'));
  })
  .forEach(file => {
    const { endpoint, router } = require(path.join(__dirname, file));
    routes.use(endpoint, router);
  });

routes.get('/', (req, res) => {
  return res.status(200).send({ message: 'root endpoint of the api' });
})

module.exports = routes;
