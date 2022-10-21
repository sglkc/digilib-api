const router = require('express').Router();
const admin = require('../middleware/admin');
const auth = require('../middleware/authentication');
const { Category, Item, Tag } = require('#models');

router.use(auth);

router.get('/', (req, res) => {
  const { page, limit } = req.query;
  const perPage = parseInt(limit) || 10;
  const offset = (page * perPage - perPage) || 0;

  Item.findAndCountAll({
    distinct: true,
    include: [Category],
    offset,
    limit: perPage
  })
    .then(({ count, rows }) => {
      return res.status(200).send({ result: rows, count: count });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err });
    });
});

router.get('/:item_id', (req, res) => {
  const { item_id } = req.params;

  Item.findByPk(item_id, { include: [Category] })
    .then((item) => {
      return res.status(200).send({ result: item.toJSON() });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err });
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
        { message: 'item addded', result: item.toJSON() }
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
      { message: 'item updated', result: item.toJSON() }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  }
});

router.delete('/:item_id', admin, async (req, res) => {
  const { item_id } = req.params;
  const count = await Item.count({ where: { item_id }});

  if (!count) return res.status(400).send({ message: 'item not found' });

  try {
    await Category.destroy({ where: { item_id }});
    await Tag.destroy({ where: { item_id }});
    await Item.destroy({ where: { item_id }});

    return res.status(200).send({ message: 'item deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  };
});

module.exports = {
  endpoint: '/items',
  router
};
