const router = require('express').Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/authentication');
const { User } = require('#models');

router.use(auth);

router.get('/:id', (req, res) => {
  const { id } = req.params;

  User.findByPk(
    id,
    { attributes: { exclude: 'password' }, rejectOnEmpty: true }
  )
    .then((user) => {
      return res.status(200).send({ result: user.toJSON() });
    })
    .catch((err) => {
      return res.status(400).send({ message: 'user not found' });
    });
});

router.patch('/:id', async (req, res) => {
  const { nama, email, password, tanggal_lahir } = req.body;
  const { id } = req.params;
  const user = await User.findByPk(id);

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(400).send({ message: 'invalid password' });
    }

    if (!result) return res.status(400).send({ message: 'invalid password' });

    user.update({ nama, email, tanggal_lahir }, { where: { id } })
      .then((user) => {
        const json = user.toJSON();

        delete json.password;

        return res.status(200).send({
          message: 'profile updated',
          result: json
        });
      })
      .catch((err) => {
        console.error(err);
        return res.status(400).send({ message: err.errors[0].message });
      });
  });
});

router.patch('/:id/password', async (req, res) => {
  const { password, old_password } = req.body;
  const id = req.params.id;
  const user = await User.findByPk(id);

  bcrypt.compare(old_password, user.password, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(400).send({ message: 'invalid password' });
    }

    if (!result) return res.status(400).send({ message: 'invalid password' });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(400).send({ message: err });

      bcrypt.hash(password, salt, (err, password) => {
        if (err) return res.status(400).send({ message: err });

        user.update({ password })
          .then(() => {
            return res.status(200).send({ message: 'password changed' });
          })
          .catch((err) => {
            console.error(err);
            return res.status(400).send({ message: err.errors[0].message });
          });
      });
    });
  });
});

  module.exports = {
    endpoint: '/users',
    router
  };
