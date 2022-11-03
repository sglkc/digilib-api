const { Op } = require('sequelize')
const router = require('express').Router();
const admin = require('#middleware/admin');
const auth = require('#middleware/authentication');
const includeBookmark = require('#middleware/bookmark');
const { Category, Notification, Item, Tag, User } = require('#models');

router.use(auth);

router.get('/', (req, res) => {
  const { limit, order, page, search, type } = req.query;
  const perPage = parseInt(limit) || 10;
  const offset = (parseInt(page) * perPage - perPage) || 0;
  const { user_id } = res.locals;

  if (offset < 0) return res.status(400).send({ message: 'INVALID_PAGE' });

  Item.findAndCountAll({
    attributes: {
      include: [ includeBookmark(user_id) ]
    },
    col: 'Item.item_id',
    distinct: true,
    limit: perPage,
    offset,
    order: [['item_id', order || 'ASC']],
    where: {
      title: { [Op.substring]: (search || '') },
      type: { [Op.substring]: (type || '') }
    }
  })
    .then(({ count, rows }) => {
      if (!rows.length) {
        return res.status(400).send({ message: 'PAGE_EMPTY' });
      }

      const result = rows.map((row) => ({
        ...row.toJSON(),
        Bookmark: Boolean(row.get('Bookmark'))
      }));

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

  Item.findByPk(item_id, {
    attributes: {
      include: [ includeBookmark(user_id) ]
    },
    include: ['Categories', 'Tag']
  })
    .then((item) => {
      const result = {
        ...item.toJSON(),
        Bookmark: Boolean(item.get('Bookmark'))
      };

      return res.status(200).send({ result });
    })
    .catch((err) => {
      return res.status(400).send({ message: 'ITEM_NOT_FOUND' });
    });
});

router.post('/', admin, async (req, res) => {
  const {
    title, author, description, media, cover, type, categories, tag
  } = req.body;

  try {
    const item = await Item.create({
      title, author, description, media, cover, type
    });
    const { item_id } = item;
    const users = await User.findAll({ attributes: ['user_id'], raw: true });

    for (const category of categories) {
      await item.createCategory({ item_id, name: category });
    }

    for (const { user_id } of users) {
      await Notification.create({
        text: `Baru diterbitkan: ${title} karya ${author}`,
        user_id
      });
    }

    await item.createTag({ item_id, ...tag });

    return res.status(200).send(
      { message: 'ITEM_ADDED', result: item.toJSON() }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  }
});

router.patch('/:item_id', admin, async (req, res) => {
  const { item_id } = req.params;
  const {
    title, author, description, media, cover, type, categories, tag
  } = req.body;

  try {
    const item = await Item.findByPk(item_id);

    await item.update({ title, author, description, media, cover, type });
    await Tag.update({ item_id, ...tag }, { where: { item_id }});
    await Category.destroy({ where: { item_id }});

    for (const category of categories) {
      await item.createCategory({ item_id, name: category });
    }

    return res.status(200).send(
      { message: 'ITEM_UPDATED', result: item.toJSON() }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  }
});

router.delete('/:item_id', admin, async (req, res) => {
  const { item_id } = req.params;
  const count = await Item.count({ where: { item_id }});

  if (!count) return res.status(400).send({ message: 'ITEM_NOT_FOUND' });

  try {
    await Category.destroy({ where: { item_id }});
    await Tag.destroy({ where: { item_id }});
    await Item.destroy({ where: { item_id }});

    return res.status(200).send({ message: 'ITEM_DELETED' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  };
});

module.exports = {
  endpoint: '/items',
  router
};
