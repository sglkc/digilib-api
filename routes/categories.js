const { Op } = require('sequelize');
const router = require('express').Router();
const auth = require('#middleware/authentication');
const { Category, Item } = require('#models');

router.use(auth);

router.get('/', (req, res) => {
  const { search } = req.query;
  const searchArray = typeof(search) === 'object';

  Category.findAll(
    Object.assign({}, search && {
      where: {
        name: {
          [searchArray ? Op.in : Op.like]: searchArray ? search : `%${search}%`
        }
      }
    })
  )
    .then((rows) => {
      const mapped = rows.map(row => row.name);
      const result = [ ...new Set(mapped) ];
      const count = result.length;

      return res.status(200).send({ result, count });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err });
    });
});

// TODO
router.get('/items', (req, res) => {
  const { page, limit } = req.query;
  const perPage = parseInt(limit) || 5;
  const offset = (parseInt(page) * perPage - perPage) || 0;

  if (offset < 0) return res.status(400).send({ message: 'INVALID_PAGE' });

  Category.findAndCountAll({
    include: Item.unscoped(),
    limit: perPage,
    offset,
  })
    .then(({ count, rows }) => {
      const result = rows;

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
