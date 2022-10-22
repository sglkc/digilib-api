require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('#models');

router.post('/register', (req, res) => {
  const { nama, email, password, tanggal_lahir } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(500).send({ message: err });

    bcrypt.hash(password, salt, (err, password) => {
      if (err) return res.status(500).send({ message: err });

      User.create({ nama, email, password, tanggal_lahir })
        .then((user) => {
          const token = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
          );

          const json = user.toJSON();

          delete json.password;
          delete json.createdAt;
          delete json.updatedAt;

          return res.status(200).send({
            message: 'USER_REGISTERED',
            result: json,
            token
          });
        })
        .catch((err) => {
          const isDuplicate = err.name === 'SequelizeUniqueConstraintError';
          const message = isDuplicate ? 'EMAIL_DUPLICATE' : err;
          const status = isDuplicate ? 400 : 500;

          return res.status(status).send({ message });
        });
    });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.unscoped().findOne({ where: { email }})
    .then((user) => {
      if (!user) return res.status(400).send({ message: 'EMAIL_NOT_FOUND' });

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(400).send({ message: 'INVALID_PASSWORD' });
        }

        if (!result) return res.status(400).send({ message: 'INVALID_PASSWORD' });

        const token = jwt.sign(
          { user_id: user.user_id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        const json = user.toJSON();

        delete json.password;
        delete json.createdAt;
        delete json.updatedAt;

        return res.status(200).send({
          message: 'USER_AUTHENTICATED',
          result: json,
          token
        });
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err });
    });
});

module.exports = {
  endpoint: '/auth',
  router
};
