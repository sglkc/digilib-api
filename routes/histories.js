const Sequelize = require('sequelize');
const router = require('express').Router();
const auth = require('../middleware/authentication');
const { History, User } = require('#models');

router.use(auth);

router.get('/', (req, res) => {
  const { page, limit } = req.query;
  const perPage = parseInt(limit) || 10;
  const offset = (parseInt(page) * perPage - perPage) || 0;
  const { user_id } = res.locals;

  if (offset < 0) return res.status(400).send({ message: 'INVALID_PAGE' });

  History.findAndCountAll({
    col: 'History.history_id',
    distinct: true,
    limit: perPage,
    offset,
    where: { user_id }
  })
    .then(({ count, rows }) => {
      if (!rows.length) throw new Error();

      return res.status(200).send({ result: rows, count });
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
