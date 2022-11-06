require('dotenv').config();
const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const auth = require('#middleware/authentication');
const { Notification, User } = require('#models');

router.post('/password', async (req, res) => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  const { email } = req.body;
  let user;

  try {
    user = await User.findOne({ where: { email }});
  } catch (err) {
    console.error(err);
    return res.status(400).send({ message: 'EMAIL_NOT_FOUND' });
  }

  try {
    const password = Math.random().toString().slice(2, 8);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await user.update({ password: hash });

    const transporter = nodemailer.createTransport({
      service: 'smtp',
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT == 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.sendMail({
      from: {
        name: 'Yayasan Jalan Rahmat',
        address: SMTP_USER
      },
      to: email,
      subject: 'Setel Ulang Kata Sandi',
      text: `Berikut adalah kata sandi baru untuk akun Anda:
      ${password}
      Jangan berikan kata sandi ini kepada siapapun!`,
      html: `<div style="text-align: center">
        <h4>Berikut adalah kata sandi baru untuk akun Anda:</h4>
        <h3>${password}</h3>
        <p>Jangan berikan kata sandi ini kepada siapapun!</p>
      </div>`
    });

    return res.status(200).send({ message: 'EMAIL_SENT' })
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  }
});

router.use(auth);

router.get('/', (req, res) => {
  const { user_id } = res.locals;

  User.findByPk(user_id, {
    attributes: { include: 'is_admin' },
    rejectOnEmpty: true
  })
    .then((user) => {
      const token = jwt.sign(
        { user_id: user.user_id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      return res.status(200).send({
        message: 'USER_AUTHENTICATED',
        result: user,
        token
      });
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
        return res.status(200).send({
          message: 'USER_UPDATED',
          result: user.toJSON()
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

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await user.update({ password: hash })
    return res.status(200).send({ message: 'PASSWORD_UPDATED' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  }
});

router.get('/notifications', async (req, res) => {
  const { user_id } = res.locals;
  const user = await User.findByPk(user_id);

  try {
    const rows = await user.getNotifications({
      order: [['notification_id', 'DESC']]
    });

    if (!rows.length) {
      return res.status(400).send({ message: 'NOTIFICATIONS_EMPTY' });
    }

    return res.status(200).send({ result: rows });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  }
});

router.delete('/notifications', async (req, res) => {
  const { user_id } = res.locals;

  try {
    await Notification.destroy({ where: { user_id }});

    return res.status(200).send({ message: 'NOTIFICATIONS_DELETED' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  }
});

module.exports = {
  endpoint: '/user',
  router
};
