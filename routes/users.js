const router = require('express').Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/authentication');
const { User } = require('#models');

router.use(auth);

router.get('/', (req, res) => {
  const { user_id } = res.locals;

  User.findByPk(
    user_id,
    { attributes: { exclude: 'password' }, rejectOnEmpty: true }
  )
    .then((user) => {
      return res.status(200).send({ result: user.toJSON() });
    })
    .catch((err) => {
      return res.status(400).send({ message: 'user not found' });
    });
});

router.patch('/', async (req, res) => {
  const { nama, email, password, tanggal_lahir } = req.body;
  const { user_id } = res.locals;
  const user = await User.findByPk(user_id);

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(400).send({ message: 'invalid password' });
    }

    if (!result) return res.status(400).send({ message: 'invalid password' });

    user.update({ nama, email, tanggal_lahir })
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
        return res.status(500).send({ message: err });
      });
  });
});

router.patch('/password', async (req, res) => {
  const { password, old_password } = req.body;
  const { user_id } = res.locals;
  const user = await User.findByPk(user_id);

  bcrypt.compare(old_password, user.password, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(400).send({ message: 'invalid password' });
    }

    if (!result) return res.status(400).send({ message: 'invalid password' });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).send({ message: err });

      bcrypt.hash(password, salt, (err, password) => {
        if (err) return res.status(500).send({ message: err });

        user.update({ password })
          .then(() => {
            return res.status(200).send({ message: 'password changed' });
          })
          .catch((err) => {
            console.error(err);
            return res.status(500).send({ message: err });
          });
      });
    });
  });
});

  module.exports = {
    endpoint: '/users',
    router
  };
