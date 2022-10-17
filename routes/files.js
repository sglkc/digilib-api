const express = require('express');
const { unlink } = require('fs');
const path = require('path');
const multer = require('multer');
const admin = require('../middleware/admin');
const auth = require('../middleware/authentication');
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../static', file.fieldname));
  },
  filename: function (req, file, cb) {
    const filename = file.originalname.replace(/ /g, '');
    cb(null, filename);
  }
});

const upload = multer({ storage });

router.use(auth);

router.get('/:foldername/:filename', (req, res) => {
  const { foldername, filename } = req.params;

  if (!(['cover', 'media'].includes(foldername))) {
    return res.status(403).send({ message: 'folder access forbidden' });
  }

  res
    .status(200)
    .sendFile(
      path.join(__dirname, '../static', foldername, filename),
      (err) => {
        if (err) return res.status(404).send({ message: 'file not found' });
      }
    );
})

router.post(
  '/',
  admin,
  upload.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'media', maxCount: 1 }
  ]),
  (req, res) => {
    return res.status(200).send({ message: 'file(s) uploaded' });
  }
);

router.delete('/:foldername/:filename', admin, (req, res) => {
  const { foldername, filename } = req.params;

  if (!(['cover', 'media'].includes(foldername))) {
    return res.status(403).send({ message: 'folder access forbidden' });
  }

  unlink(path.join(__dirname, '../static', foldername, filename), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ message: err });
    }

    return res.status(200).send({ message: 'file deleted' });
  });
});

module.exports = {
  endpoint: '/files',
  router
};
