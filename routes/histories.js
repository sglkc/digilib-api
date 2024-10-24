const { Op } = require('sequelize');
const router = require('express').Router();
const auth = require('#middleware/authentication');
const includeBookmark = require('#middleware/bookmark');
const { History, Item, User } = require('#models');

router.use(auth);

router.get('/', (req, res) => {
  const { limit, page, type } = req.query;
  const perPage = parseInt(limit) || 10;
  const offset = (parseInt(page) * perPage - perPage) || 0;
  const { user_id } = res.locals;

  if (offset < 0) return res.status(400).send({ message: 'INVALID_PAGE' });

  History.findAndCountAll({
    attributes: {
      include: [ includeBookmark(user_id, 'History.item_id') ],
    },
    distinct: true,
    include: {
      model: Item,
      where: {
        type: { [Op.substring]: (type || '') }
      }
    },
    order: [['history_id', 'DESC']],
    limit: perPage,
    offset,
    where: { user_id }
  })
    .then(({ count, rows }) => {
      const result = rows.map((row) => ({
        ...row.Item.toJSON(),
        Bookmark: Boolean(row.get('Bookmark'))
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

router.post('/:item_id', async (req, res) => {
  const { item_id } = req.params;
  const { user_id } = res.locals;

  try {
    const user = await User.findByPk(user_id);
    const latest = await user.getHistories({ limit: 1 });

    if (item_id === latest.item_id) {
      return res.status(200).send({ message: 'KEEP_HISTORY' });
    }

    const result = await user.addHistory(item_id);

    return res.status(200).send({ message: 'ADDED_HISTORY', result });
  } catch (err) {
    console.error(err);
    return res.status(400).send({ message: 'ITEM_NOT_FOUND' });
  }
});

module.exports = {
  endpoint: '/histories',
  router
};
