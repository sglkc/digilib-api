const router = require('express').Router();
const auth = require('../middleware/authentication');
const { Histories, User } = require('#models');

router.use(auth);

router.get('/', async (req, res) => {
  const { user_id } = res.locals;

  try {
    const user = await User.findByPk(user_id);
    const histories = await user.getHistories();

    return res.status(200).send({ result: histories });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  }
});

router.post('/:item_id', async (req, res) => {
  const { item_id } = req.params;
  const { user_id } = res.locals;

  try {
    const user = await User.findByPk(user_id);
    const result = await user.addHistory(item_id);

    return res.status(200).send({ message: 'added to history', result });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  }
});

module.exports = {
  endpoint: '/histories',
  router
};
