const { fn } = require('sequelize');
const router = require('express').Router();
const admin = require('#middleware/admin');
const auth = require('#middleware/authentication');
const { Quote } = require('#models');

router.use(auth);

router.get('/', (req, res) => {
  Quote.findAndCountAll()
    .then(({ count, rows }) => res.status(200).send({ count, result: rows }))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err });
    });
});

router.get('/random', (req, res) => {
  Quote.findOne({ order: fn('RAND') })
    .then((result) => res.status(200).send({ result }))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ result: err });
    });
});

router.post('/', admin, (req,res) => {
  const { text, author } = req.body;

  Quote.create({ text, author })
    .then((result) => res.status(200).send({ message: 'QUOTE_ADDED', result }))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err });
    });
});

router.patch('/:quote_id', admin, (req, res) => {
  const { quote_id } = req.params;
  const { text, author } = req.body;

  Quote.update({ text, author }, { where: { quote_id }})
    .then(() => res.status(200).send({ message: 'QUOTE_UPDATED' }))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err });
    });
});

router.delete('/:quote_id', admin, (req, res) => {
  const { quote_id } = req.params;

  Quote.destroy({ where: { quote_id } })
    .then(() => res.status(200).send({ message: 'QUOTE_DELETED' }))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err });
    });
});

module.exports = {
  endpoint: '/quotes',
  router
};
