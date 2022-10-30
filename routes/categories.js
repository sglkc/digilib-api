const { Op } = require('sequelize');
const router = require('express').Router();
const auth = require('#middleware/authentication');
const includeBookmark = require('#middleware/bookmark');
const { Category, Item } = require('#models');

router.use(auth);

router.get('/', (req, res) => {
  const { search } = req.query;

  Category.findAll({
    where: {
      name: { [Op.substring]: (search || '') }
    }
  })
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

router.get('/items', (req, res) => {
  const { limit, page, search, type } = req.query;
  const perPage = parseInt(limit) || 5;
  const offset = (parseInt(page) * perPage - perPage) || 0;
  const { user_id } = res.locals;

  if (offset < 0) return res.status(400).send({ message: 'INVALID_PAGE' });

  Category.findAndCountAll({
    attributes: {
      include: [ includeBookmark(user_id, 'Category.item_id') ]
    },
    distinct: true,
    group: ['item_id'],
    include: {
      model: Item,
      where: {
        type: { [Op.substring]: (type || '') }
      }
    },
    limit: perPage,
    offset,
    where: {
      name: { [Op.in]: search }
    }
  })
    .then(({ count, rows }) => {
      const result = rows.map(row => ({
        ...row.Item.toJSON(),
        Bookmark: Boolean(row.get('Bookmark'))
      }));

      if (!result.length) {
        return res.status(400).send({ message: 'PAGE_NOT_FOUND' });
      }

      return res.status(200).send({ result, count: count.length });
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
