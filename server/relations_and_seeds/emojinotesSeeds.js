const models = require('../models');

const Emojinotes = models.Emojinotes;

Emojinotes.bulkCreate([
    { 
        emoji: 'christmas tree',
        note: 'I hope that you\'ll like your present. It is a very precious one. From Santa\'na.',
        token: 'TOBINR3TM0MW1395',
      },
      {
        emoji: 'love letter',
        note: 'I don\'t want a lot for Christmas there is just one thing I need. I don\'t care about the presents underneath the Christmas tree. Mariah',
        token: 'HQIMXT5USPA5MZ6Z',
      },
      {
        emoji: 'heart eyes',
        note: 'I just want you for my own more than you could ever know. Make my wish come true! All I want for Christmas is you... XOXO',
        token: 'B1P7HPD43E6CY6AC',
      },
      {
        emoji: 'tears of joy',
        note: 'All I want for Christmas is my two front teeth, My two front teeth, see my two front teeth.',
        token: 'V7S3QH17CL2HW5C0',
      },
      { 
        emoji: 'christmas tree',
        note: 'Chestnuts roasting on an open fire, Jack Frost nipping at your nose, Yuletide carols being sung by a choir And folks dressed up like eskimos. Nat.',
        token: 'HZ63S64PWVD9IWTA',
      }
])
.then((tokens) => {
    console.log(tokens);
})
.catch((err) => {
    onsole.log("Error while Emojinotes creation : ", err)
});