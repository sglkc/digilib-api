require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('#models');

router.post('/register', (req, res) => {
  const { nama, email, password, tanggal_lahir } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(400).send({ message: err });

    bcrypt.hash(password, salt, (err, password) => {
      if (err) return res.status(400).send({ message: err });

      User.create({ nama, email, password, tanggal_lahir })
        .then((user) => {
          const token = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
          );

          return res.status(200).send({ message: 'user registered', token });
        })
        .catch((err) => {
          console.error(err);
          return res.status(400).send({ message: err.errors[0].message });
        });
    });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ where: { email }})
    .then((user) => {
      if (!user) return res.status(400).send({ message: 'email not found' });

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(400).send({ message: err });
        }

        if (!result) return res.status(400).send({ message: 'invalid password' });

        const token = jwt.sign(
          { user_id: user.user_id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).send({ message: 'user authenticated', token });
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).send({ message: err.errors[0].message });
    });
});

module.exports = {
  endpoint: '/auth',
  router
};
