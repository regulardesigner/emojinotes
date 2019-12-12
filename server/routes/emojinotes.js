const express = require('express');

const router = express.Router();

const models = require('../models');

const Emojinotes = models.Emojinotes;

// FETCH All wishes
router.get('/', (req, res) => {
  Emojinotes.findAll()
  .then((notes) => {
    res.json(notes);
  })
  .catch((err) => {
      res.json(err);
  });
});

router.get('/:token', (req, res) => {
  Emojinotes.findOne({
      where: { token: req.params.token },
      attributes: { 
          exclude: [ 'token', 'createdAt', 'updatedAt' ] 
        }
  })
    .then((note) => {
      if (note) {
        res.json(note);
      }
      else {
        res.status(404).send();
      }
    });
});


module.exports = router;