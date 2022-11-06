require('dotenv').config();
const express = require('express');
const router = express.Router({ strict: true });
const jwt = require('jsonwebtoken');
const { join } = require('path');
const { User } = require('#models');
const { JWT_EXPIRES_IN, JWT_SECRET, PREFIX } = process.env;

router.use('/assets', express.static(join(__dirname, '../ui/assets')));

router.get('/login.html', (req, res) => {
  return res.sendFile(join(__dirname, '../ui/login.html'));
});

router.get('/', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.set('etag', false);

  try {
    const token = req.cookies.TOKEN;
    const { user_id } = await jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({
      where: { user_id, is_admin: 1 },
      rejectOnEmpty: true
    });

    return res.sendFile(join(__dirname, '../ui/index.html'));
  } catch (err) {
    console.error(err);
    return res.redirect(301, join(PREFIX, '/ui/login.html'));
  }
});

module.exports = {
  endpoint: '/ui',
  router
};
