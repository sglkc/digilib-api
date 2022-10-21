const router = require('express').Router();
const bcrypt = require('bcrypt');
const auth = require('../middleware/authentication');
const { User } = require('#models');

router.use(auth);

router.get('/', (req, res) => {
  const { user_id } = res.locals;

  User.findByPk(
    user_id,
    {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      rejectOnEmpty: true
    }
  )
    .then((user) => {
      return res.status(200).send({ result: user.toJSON() });
    })
    .catch((err) => {
      return res.status(400).send({ message: 'USER_NOT_FOUND' });
    });
});

router.patch('/', async (req, res) => {
  const { nama, email, tanggal_lahir } = req.body;
  const { user_id } = res.locals;

  User.findByPk(user_id).then((user) => {
    user.update({ nama, email, tanggal_lahir })
      .then((user) => {
        const json = user.toJSON();

        delete json.password;
        delete json.createdAt;
        delete json.updatedAt;

        return res.status(200).send({
          message: 'USER_UPDATED',
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
  const { password } = req.body;
  const { user_id } = res.locals;
  const user = await User.findByPk(user_id);

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(500).send({ message: err });

    bcrypt.hash(password, salt, (err, password) => {
      if (err) return res.status(500).send({ message: err });

      user.update({ password })
        .then(() => {
          return res.status(200).send({ message: 'PASSWORD_UPDATED' });
        })
        .catch((err) => {
          console.error(err);
          return res.status(500).send({ message: err });
        });
    });
  });
});

module.exports = {
  endpoint: '/user',
  router
};
