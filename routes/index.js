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
    const router = require(path.join(__dirname, file));
    routes.use(router);
  });

routes.use((req, res) => {
  return res.status(404).send('Invalid endpoint');
});

module.exports = routes;
