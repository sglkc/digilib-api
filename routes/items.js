const router = require('express').Router();
const admin = require('../middleware/admin');
const auth = require('../middleware/authentication');
const { Category, Item, Tag } = require('#models');

router.use(auth);

router.get('/', (req, res) => {
  const { page, limit } = req.query;
  const perPage = parseInt(limit) || 10;
  const offset = (parseInt(page) * perPage - perPage) || 0;

  if (offset < 0) return res.status(400).send({ message: 'INVALID_PAGE' });

  Item.findAndCountAll({
    col: 'Item.item_id',
    distinct: true,
    limit: perPage,
    offset
  })
    .then(({ count, rows }) => {
      if (!rows.length) throw new Error();

      return res.status(200).send({ result: rows, count: count });
    })
    .catch((err) => {
      return res.status(400).send({ message: 'PAGE_NOT_FOUND' });
    });
});

router.get('/:item_id', (req, res) => {
  const { item_id } = req.params;

  Item.scope('withTags').findByPk(item_id)
    .then((item) => {
      return res.status(200).send({ result: item.toJSON() });
    })
    .catch((err) => {
      return res.status(400).send({ message: 'ITEM_NOT_FOUND' });
    });
});

router.post('/', admin, (req, res) => {
  const {
    title, author, description, media, cover, type, categories, tag
  } = req.body;

  Item.create({ title, author, description, media, cover, type })
    .then(async (item) => {
      const { item_id } = item;

      for (const category of categories) {
        await item.createCategory({ item_id, name: category });
      }

      await item.createTag({ item_id, ...tag });

      return res.status(200).send(
        { message: 'ITEM_ADDED', result: item.toJSON() }
      );
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err });
    });
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
