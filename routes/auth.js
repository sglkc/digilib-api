require('dotenv').config();
const routes = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('#models');

routes.use('/auth', routes);

routes.post('/register', (req, res) => {
  const { nama, email, password, tanggal_lahir } = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return res.status(400).send({ message: err });

    bcrypt.hash(password, salt, (err, password) => {
      if (err) return res.status(400).send({ message: err });

      User.create({ nama, email, password, tanggal_lahir })
        .then((user) => {
          delete user.password;

          const token = jwt.sign(
            user.toJSON(),
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

routes.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ attributes: { exclude: 'password' }, where: email })
    .then((user) => {
      if (!user) return res.status(400).send({ message: 'email not found' });

      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(400).send({ message: err });
        }

        if (!invalid) return res.status(400).send({ message: 'invalid password' });

        delete user.password;

        const token = jwt.sign(
          user.toJSON(),
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).send({ message: 'user authenticated', token });
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).send({ message: err });
    });
});

module.exports = routes;
