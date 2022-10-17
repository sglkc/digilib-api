const router = require('express').Router();
const auth = require('../middleware/authentication');
const { Bookmarks, User } = require('#models');

router.use(auth);

router.get('/', async (req, res) => {
  const { user_id } = res.locals;

  try {
    const user = await User.findByPk(user_id);
    const bookmarks = await user.getBookmarks();

    return res.status(200).send({ result: bookmarks });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  }
});

router.get('/:item_id', async (req, res) => {
  const { item_id } = req.params;
  const { user_id } = res.locals;

  try {
    const user = await User.findByPk(user_id);
    const result = await user.hasBookmark(item_id);

    return res.status(200).send({ result });
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
    const result = await user.addBookmark(item_id);

    return res.status(200).send({ message: 'added to bookmark', result });
  } catch (err) {
    console.error(err);

    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(200).send({ message: 'item already bookmarked' });
    }

    return res.status(500).send({ message: err });
  }
});

router.delete('/:item_id', async (req, res) => {
  const { item_id } = req.params;
  const { user_id } = res.locals;

  try {
    const user = await User.findByPk(user_id);
    const result = await user.removeBookmark(item_id);

    if (!result) {
      return res.status(200).send({ message: 'item not bookmarked' });
    }

    return res.status(200).send({
      message: 'removed from bookmark',
      result: Boolean(result)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  }
});

module.exports = {
  endpoint: '/bookmarks',
  router
};
