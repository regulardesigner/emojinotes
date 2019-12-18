const express = require('express');

const router = express.Router();

const models = require('../models');

const Emojinotes = models.Emojinotes;

// GET All EMOJI-NOTES
router.get('/', (req, res) => {
  Emojinotes.findAll()
  .then((notes) => {
    res.json(notes);
  })
  .catch((err) => {
      res.json(err);
  });
});

// GET ONE EMOJI-NOTES WITH IT'S TOKEN
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

// SAVE A NEW EMOJI-NOTES
router.post('/', (req, res) => {
  const { emoji, note, token } = req.body;

  const newEmojiNote = {
    emoji,
    note,
    token,
  };

  Emojinotes.create(newEmojiNote).then((newlyCreatedEmojiNote) => {
    res.json(newlyCreatedEmojiNote);
  });
});

module.exports = router;