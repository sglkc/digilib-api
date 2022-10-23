const router = require('express').Router();
const auth = require('#middleware/authentication');
const { Category, Item } = require('#models');

router.get('/', (req, res) => {
  Category.findAndCountAll({
    group: ['name'],
    attributes: ['name']
  })
    .then(({ count, rows }) => {
      const result = rows.map((row) => row.name);

      return res.status(200).send({ result, count });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err });
    });
});

router.get('/search', (req, res) => {
  const { q } = req.query;

  if (!q) return res.status(400).send({ message: 'q query required' });

  Category.findAll({
    where: { name: q },
    include: [
      {
        model: Item,
        include: [ Category ]
      }
    ]
  })
    .then((result) => {
      return res.status(200).send({ result });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err });
    });
});

module.exports = {
  endpoint: '/categories',
  router
};
