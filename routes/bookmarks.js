const router = require('express').Router();
const auth = require('#middleware/authentication');
const { Bookmark } = require('#models');

router.use(auth);

router.get('/', (req, res) => {
  const { page, limit } = req.query;
  const perPage = parseInt(limit) || 10;
  const offset = (parseInt(page) * perPage - perPage) || 0;
  const { user_id } = res.locals;

  if (offset < 0) return res.status(400).send({ message: 'INVALID_PAGE' });

  Bookmark.findAndCountAll({
    col: 'Bookmark.bookmark_id',
    distinct: true,
    limit: perPage,
    offset,
    where: { user_id }
  })
    .then(({ count, rows }) => {
      const result = rows.map((row) => ({
        ...row.Item.toJSON(),
        Bookmark: true
      }));

      if (!result.length) {
        return res.status(400).send({ message: 'PAGE_EMPTY' });
      }

      return res.status(200).send({ result, count });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).send({ message: 'PAGE_NOT_FOUND' });
    });
});

router.get('/:item_id', (req, res) => {
  const { item_id } = req.params;
  const { user_id } = res.locals;

  Bookmark.findOne({ where: { item_id, user_id } })
    .then((bookmark) => {
      return res.status(200).send({ result: !!bookmark });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err });
    });
});

router.post('/:item_id', (req, res) => {
  const { item_id } = req.params;
  const { user_id } = res.locals;

  Bookmark.create({ item_id, user_id })
    .then((result) => {
      return res.status(200).send({ message: 'ADDED_BOOKMARK', result });
    })
    .catch((err) => {
      console.error(err);

      switch(err.name) {
        case 'SequelizeUniqueConstraintError':
          return res.status(400).send({ message: 'ITEM_IS_BOOKMARKED' });
        case 'SequelizeForeignKeyConstraintError':
          return res.status(400).send({ message: 'ITEM_NOT_FOUND' });
        default:
          return res.status(500).send({ message: err });
      }
    });
});

router.delete('/:item_id', (req, res) => {
  const { item_id } = req.params;
  const { user_id } = res.locals;

  Bookmark.destroy({ where: { item_id, user_id } })
    .then((result) => {
      if (!result) {
        return res.status(200).send({ message: 'ITEM_NOT_BOOKMARKED' });
      }

      return res.status(200).send({ message: 'ITEM_UNBOOKMARKED' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err });
    });
});

module.exports = {
  endpoint: '/bookmarks',
  router
};
