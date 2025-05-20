var express = require("express");
var router = express.Router();
require("../models/connection"); //import de la connection string
const User = require("../models/users"); //import du schema user

const { checkBody } = require("../modules/checkBody"); //import de la fonction checkBody qui verifie que tout le champs soit ni null ni une string vide
const uid2 = require("uid2"); // module qui permet de genere une num de token
const bcrypt = require("bcrypt"); //module permet de haché le password

router.post("/signup", (req, res) => {
  //route post endpoint /signup
  if (!checkBody(req.body, ["email", "password"])) {
    //fonction checkBody qui verifie que tout le champs soit ni null ni une string vide prend en parametre du body ['username', 'password']
    res.json({ result: false, error: "Missing or empty fields" }); //la fun renvoi un json resiltat false error: 'Missing or empty fields'
    return;
  }

  // Check if the user has not already been registered
  User.findOne({ email: req.body.email }).then((data) => {
    //recherche dans la db User UN seul User avec le nom en param
    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;
    console.log(emailRegex.test(req.body.email));

    if (data === null && emailRegex.test(req.body.email)) {
      const hash = bcrypt.hashSync(req.body.password, 10); // cryptage du password (hashé 10x)

      const newUser = new User({
        email: req.body.email,
        password: hash, // cryptage du password (hashé 10x)
        token: uid2(32), //token de 32 caracteres
      });

      newUser
        .save()
        .catch((error) => {
          res.status(500).json({ error: "error while saving doc" }); // Si une erreur survient lors de la sauvegarde du document
        })
        .then((newDoc) => {
          //save pour les new users et renvoi un doc json
          res.json({ result: true, token: newDoc.token }); //doc json qui mentionne que tout c'est bien passé et le num du token
        });
    } else {
      // User already exists in database
      res.json({ result: false, error: "Wrong email or already exists " }); //doc json qui mentionne que l'user a deja ete trouvé dans la db
    }
  });
});

router.post("/signin", (req, res) => {
  //route post endpoint /signin
  if (!checkBody(req.body, ["email", "password"])) {
    //fonction checkBody qui verifie que tout le champs soit ni null ni une string vide prend en parametre du body ['username', 'password']
    res.json({ result: false, error: "wrong or empty fields" }); //la fun renvoi un json resiltat false error: 'Missing or empty fields'
    return;
  }

  User.findOne({ email: req.body.email })
    .then((data) => {
      // const emailRegex = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;
      // console.log(emailRegex.test(req.body.email));

      //recherche dans la db User UN seul User avec le nom en param et renvoi des donné le consernant
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        //si data et password rentré et crypté est identique au password en db
        res.json({ 
            result: true, 
            token: data.token, 
            sportPlayed: data.User,
            username: data.username, 
            admin: data.admin,
            xp:data.xp,
            level:data.level,
            photoUrl:data.photoUrl,
            
        }); //renvoi un json avec un resultat true et le token
      } else {
        res.json({ result: false, error: "User not found or wrong password" }); // renvoi un json resultat false et un msg error
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "connection data base error " }); // Si une erreur survient lors de la sauvegarde du document
    });
});

// router.post('/form/p1', (req, res) => { //
//   if (!checkBody(req.body, ['username', 'name'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }
//   User.updateOne({token: res.json() },
//   {username: req.body.username, name:req.body.name}).then(()=>{User.find().then(data=>{console.log(data);
//   }).

//       res.send()
//         // username: req.body.username, //username
//         // name:req.body.name

// })})

// router.post('/form/p2', (req, res) => { //
//   if (!checkBody(req.body, ['gender'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }
//  User.updateOne({token:res.json() },
//   {gender:req.body.gender}).then(()=>{User.find().then (data=>{console.log(data);
//   }).
//        // gender:req.body.gender

// })})

// router.post('/form/p3', (req, res) => { //
//   if (!checkBody(req.body, ['age', 'city'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }
//   User.updateOne({token:res.json() },
//   {age: req.body.age, city:req.body.city }).then(()=>{User.find().then(data=>{console.log(data);
//   }).

//         // age: req.body.age
//         // // coordinate:req.body
//         // city:req.body.city

// })})

// router.post('/form/p4', (req, res) => { //
//   if (!checkBody(req.body, ['sportplayed'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }
//   User.updateOne({token:res.json() },
//   { sportplayed:req.body.sportplayed}).then(()=>{User.find().then(data=>{console.log(data);
//   }).

//        // sportplayed:req.body.sportplayed

// })})

// router.post('/form/p5', (req, res) => { //
//   if (!checkBody(req.body, ['sportStartingLevel'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }
//    User.updateOne({token:res.json() },
//   { sportStartingLevel:req.body.sportStartingLevel}).then(()=>{User.find().then(data=>{console.log(data);
//   }).

//        // sportStartingLevel:req.body.sportStartingLevel

// })})

// router.post('/form/p6', (req, res) => { //
//   if (!checkBody(req.body, ['coachNeed'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }
//    User.updateOne({token:res.json() },
//   { coachNeed:req.body.coachNeed}).then(()=>{User.find().then(data=>{console.log(data)
//   }).

//        // coachNeed:req.body.coachNeed

// })})

// router.post('/form/p7', (req, res) => { //
//   if (!checkBody(req.body, ['setFreeTime'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }
//    User.updateOne({token:res.json() },
//   {setFreeTime:req.body.setFreeTime}).then(()=>{User.find().then(data=>{console.log(data);
//   }).

//        // setFreeTime:req.body.setFreeTime

// })})

// router.post('/form/p8', (req, res) => { //
//   if (!checkBody(req.body, ['notificationActive'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }
//    User.updateOne({token:res.json() },
//   {notificationActive:req.body.notificationActive}).then(()=>{User.find().then(data=>{console.log(data);
//   }).

//        // notificationActive:req.body.notificationActive

// })})

//  router.post('/signin', (req, res) => { //
//  if (!checkBody(req.body, ['email', 'password'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }
//   User.findOne({ email: req.body.email }).then(data => { //recherche dans la db User UN seul User avec le nom en param et renvoi des donné le consernant
//     if (data && bcrypt.compareSync(req.body.password, data.password)) { //si data et password rentré et crypté est identique au password en db
//       res.json({ result: true, token: data.token }); //renvoi un json avec un resultat true et le token
//     } else {
//       res.json({ result: false, error: 'User not found or wrong password' });// renvoi un json resultat false et un msg error
//     }
//   });
// });

// router.post('/signin/lost', (req, res) => { //pasword perdu
//  if (!checkBody(req.body, ['email'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
//   }

// });
// router.get('/profil', (req, res) => { // get profile

// });
// router.post('/', (req, res) => { // get list

// });
// router.post('/form/p8', (req, res) => { //
// router.post('/form/p8', (req, res) => { //
// router.post('/form/p8', (req, res) => { //
// router.post('/form/p8', (req, res) => { //
// router.post('/form/p8', (req, res) => { //
// router.post('/form/p8', (req, res) => { //
// router.post('/form/p8', (req, res) => { //
// router.post('/form/p8', (req, res) => { //

// router.post('/tempcheck', (req, res) => {//route post endpoint /signup
//   User.findOne({ email: req.body.email }).then(data => { //recherche dans la db User UN seul User avec le nom en param
//     if (!checkBody(req.body, ['email'])) { //fonction checkBody qui verifie que tout le champs soit ni null ni une string vide prend en parametre du body ['username', 'password']
//     res.json({ result: false, error: 'Missing or empty fields' });//la fun renvoi un json resiltat false error: 'Missing or empty fields'
//     return;
//   }
//       if (data === null) {
//         // res.set({
//         //   'Content-Type': 'text/plain',
//         //   'Content-Length': '123',
//         //   ETag: '12345'
//         //   })
//         res.redirect('/form/p1')
//         // res.location('/form/p1')

//       }else{res.json({ result: false, error: 'User already exists' });//doc json qui mentionne que l'user a deja ete trouvé dans la db
// }
// })
// })

// router.get('/canBookmark/:token', (req, res) => {
//   User.findOne({ token: req.params.token }).then(data => {
//     if (data) {
//       res.json({ result: true, canBookmark: data.canBookmark });
//     } else {
//       res.json({ result: false, error: 'User not found' });
//     }
//   });
// });

module.exports = router;
