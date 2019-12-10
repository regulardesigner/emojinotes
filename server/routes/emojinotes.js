const express = require('express');

const router = express.Router();

const models = require('../models');

const Emojinotes = models.Emojinotes;

// FETCH All wishes
router.get('/', (req, res) => {
  Emojinotes.findAll()
  .then((notes) => {
    res.status(200).json(notes);
  })
  .catch((err) => {
      res.status(500).json(err);
  });
});

router.get('/:token', (req, res) => {
  Emojinotes.findOne({
      where: { token: req.params.token },
      attributes: { 
          include: [ emoji, notes ] 
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