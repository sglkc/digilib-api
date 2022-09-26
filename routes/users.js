const router = require('express').Router();
const { User } = require('#models');

router.use('/users', router);
router.get('/', async (req, res) => {
  const count = await User.count();

  res.status(200).send('Users: ' + count);
});

module.exports = router;
