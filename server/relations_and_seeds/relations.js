const models = require('../models');

const Emojinotes = models.Emojinotes;

// 1:1
// Get the Emojinote linked to a given Token
Emojinotes.findOne({
  where: {token: 'B1P7HPD43E6CY6AC'}
})
.then((findedNote) => {
  // Get the Token with the Emojinote datas included
  console.log(findedNote)
  // Get the emojinote record only
  // console.log(findedNote.note)
})
.catch((err) => {
  console.log("Error while find Emojinote : ", err)
})