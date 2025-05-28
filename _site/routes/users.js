var express = require("express");
var router = express.Router();
require("../models/connection"); //import de la connection string
const User = require("../models/users"); //import du schema user
const Activity = require("../models/activities"); //import du schema activity
const Medal = require("../models/medals")

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
    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i; //regex pattern d'email (([\w.-]=raccourci de [a-zA-Z0-9_.-])) @ et 2caractere apres le .
    // console.log(emailRegex.test(req.body.email));

    if (data === null && emailRegex.test(req.body.email)) {
      //si il n'y a pas de data reçu ou que le regex .test renvoie true
      const hash = bcrypt.hashSync(req.body.password, 10); // cryptage du password (hashé 10x)

      const newUser = new User({
        //creation d'un new user
        email: req.body.email, // inscription de l ecmail en db
        password: hash, // cryptage du password (hashé 10x)
        token: uid2(32), //token de 32 caracteres
      });

      newUser
        .save() //methode crud create avec .save de new user
        .catch((error) => {
          res.status(500).json({ error: "error while saving doc" }); // Si une erreur survient lors de la sauvegarde du document
        })
        .then((newDoc) => {
          //save pour les new users et renvoi un doc json

          // res.sendStatus(200) //renvoi un code de confirmation 200 si tout c'est bien passé a la save
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

  User.findOne({ email: req.body.email }) //recherche en db de l email
    .then((data) => {
      //recherche dans la db User UN seul User avec le nom en param et renvoi des donné le consernant
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        //si data et password rentré et crypté est identique au password en db
        
        // res.json({
        //   //renvoi de toute ces info de la bdd au front
        //   result: true,
        //   token: data.token,
        //   sportPlayed: data.sportPlayed,
        //   username: data.username,
        //   admin: data.admin,
        //   xp: data.xp,
        //   level: data.level,
        //   photoUrl: data.photoUrl,
        // }); //renvoi un json avec un resultat true et le token

        res.json({result:true, token:data.token, sport: data.sportPlayed})//renvoi de la reponse si l'authentification a réussi

      } else {
        res.json({ result: false, error: "User not found or wrong password" }); // renvoi un json resultat false et un msg error
      }
    })
    .catch((error) => {
      res.status(500).json({ error: "connection data base error " }); // Si une erreur survient lors de la sauvegarde du document
    });
});
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

//route geoloc
router.post("/geoloc", (req, res) => 
{
  // Récupération des données envoyées dans le body de la requête
  let {token, lat, lon} = req.body

  //recherche de la ville via latitude et longitude en fasant une requete à l' api gratuite du gouv
  fetch(`https://wttr.in/${lat},${lon}?format=j1`).then(r=>r.json()).then(data=>
  {
   
    //verifier que tout les champs sont présents
    if(checkBody(req.body, ["token","lat", "lon"]))
    {
      if(data)
      {
       
        //stockage de la ville dans la variable "city"
          let city = data.nearest_area[0].areaName[0].value
        if( city)
        {
           //modification de user pour ajouter les coordonées et la ville
          User.updateOne({token:token}, {city:city, coordinate:{name:city,location:{type:"Point",coordinates:[lon, lat]}}}).then(userData=>
          {
             //verifier que l' element user a été bien modifié
              if(userData.modifiedCount>0)
              {
                res.json({result:true, data:userData})

              }
              else
              {
                //reponse si user n' a pas été modifié
                 res.json({result:false, error: "user not updated"})
              }
          })
        }
        else
        {
          //reponse si la ville n' a pas été trouvée
          res.json({result:false, error: "city not found"})
        }
      
      }
      else
      {
        //reponse di les coordonees sont incorrects
        res.json({result:false, error: "error lat or lon incorrect"})
      }
    }
    else
    {
      //reponse si absance du champ
      res.json({result:false, error: "entry not found"})
    }
   

  }).catch(() => {
      res.status(500).json({ error: "connection error " }); // Si une erreur survient lors de la requete
    });
 


})


//Route dashbord
router.post("/dashboard", (req, res) => 
{
  // Récupération des données envoyées dans le body de la requête
  let {token} = req.body

  //verifier que tout les champs sont présents
  if(checkBody(req.body, ["token"]))
  {
      //recupérer le user 
      User.findOne({token:token}).populate("sportPlayed", "title image").then(userData=>{

        //verifier si le user modifié a été bien trouvé
        if(userData)
        {
           //rechercher l' activité choisi dans la collection "activities"
            Activity.findOne({title:userData.sportPlayed[0].title}).then(activityData=>
            {
              // res.json({result:true, data:activityData})

              //verifier que l' activity a été bien trouvée
              if(activityData)
              {
                //recherche le "level" dans la collection "activities"
                let activityLevel
                for(let Vlevel of activityData.levels)
                {
                  if(Vlevel.title===userData.level)
                  {
                     activityLevel=Vlevel
                  }
                }
                
                //requete vers l' api meteo
                fetch(`https://wttr.in/${userData.city}?format=j1`).then(r=>r.json()).then(meteoData=>
                {
                  //stocker les données meteo
                  let meteoDesc = meteoData.current_condition[0].weatherDesc[0].value

                   //reponse avec les données du "user", "level" et meteo
                  res.json({result:true,dataUser:userData, dataLevel:activityLevel, dataMeteo:meteoDesc})
                }) 
                .catch((e) => 
                {
                  // Si une erreur survient lors de la requete API
                  res.json({result:true, dataUser:userData, dataLevel:activityLevel, dataMeteo:"Meteo API error", error:e})
                  //res.status(500).json({ message: "Meteo API error", error: e}) 
                })

              }
              else
              {
                  //reponse si l' ectivity n est pas trouvée
                  res.json({result:false, error: "activity not found"})
              }
            })
        }
        else
        {
          //reponse si user n' a pas été trouvé
          res.json({result:false, error: "user not found"})
        }
      })
  }
  else 
  {
     //reponse si absance du champ
    res.json({result:false, error: "entry not found"})
  }
});










//Route onboarding
router.post("/onboarding", (req, res) => 
{
  // Récupération des données envoyées dans le body de la requête
  let {token,username, name, gender, age, sportsPlayed, level, reason, dayTime, notificationActive, height, weight, city} = req.body

  //verifier que tout les champs sont présents
  if(checkBody(req.body, ["token","username","name","sportsPlayed","level","city" ]))
  {
      //rechercher l' activité choisi dans la collection "activities"
      Activity.findOne({title:sportsPlayed}).then(sportData=>
      {
        //verifier que l' activity a été bien trouvée
        if(sportData)
        {
            //convertit un niveau de compétence en titre de niveau specifique
            let levelTitle
            if(level==="Aucune expérience")
            {levelTitle = "Niveau 1"}
            else if(level==="Débutant")
            {levelTitle = "Niveau 3"}
            else if(level==="Intermédiaire")
            {levelTitle = "Niveau 5"}
            else if(level==="Avancé")
            {levelTitle = "Niveau 7"}
            else
            {
              //reponse si le niveau n est pas trouvé
              res.json({result:false, error: "level not found"})
              return 
            }

            //recherche du title du niveau
            let levelId
            for(let Vlevel of sportData.levels)
            {
              if(Vlevel.title===levelTitle)
              {
                levelId = Vlevel.title
              }
            }

            //modification de user pour ajouter les données manquants
            User.updateOne({token:token}, {username:username, name:name, gender:gender, age:age, notificationActive:notificationActive, form:{reason:reason, dayTime:dayTime}, sportPlayed:[sportData._id], level:levelId, height:height, weight:weight,city:city.toLowerCase(), photoUrl:"https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1748005964/projectFinDeBatch/front/images/default-profile_cltqmm.png"}).then(userData=>
            {
              //verifier que l' element user a été bien modifié
              if(userData.modifiedCount>0)
              { //reponse si l'authentification a réussi
                res.json({result:true})
              }
              else
              {
                //reponse si user n' a pas été modifié
                 res.json({result:false, error: "user not updated"})
              } 
            })
        }
        else
        {
          //reponse si l' ectivity n est pas trouvée
          res.json({result:false, error: "activity not found"})
        }
      })
  }
  else 
  {
     //reponse si absance du champ
    res.json({result:false, error: "entry not found"})
  }
});

//route pour tester la collection user
router.post("/testUser", (req, res) => 
{
  let {admin, token, email, password, username, name, gender, age, coordName, coordType, coordLat, coordLon, city, notificationActive, photoUrl, level, levelTitle, xp, isSocialConnected, reason, dayTime, nbSessions, totalTime, nbEtaps} = req.body
  let lastConnectionDate = new Date()
  let creationDateDate = new Date()
  let lastModifiedDate = new Date()

  Activity.find().then(activityData=>
  {
    let activityDataID = []
    for(let activity of activityData)
    {
      activityDataID.push(activity._id)

    }

    Medal.find().then(medalData=>
    {
        let medalDataID = []
        for(let i=0; i<3; i++)
        {
          medalDataID.push(medalData[i]._id)

        }
        Activity.findOne({title:levelTitle}).then(levelData=>
        {
          let levelId
          
          for(let Vlevel of levelData.levels)
          {
            if(Vlevel.title===level)
            {
              levelId = Vlevel.title

            }
          }
          //res.json({result:true, data:levelId})

        
            let testUser = new User(
            {
              admin:admin,
              token:token,
              email:email,
              password:password,
              username:username,
              name:name,
              gender:gender,
              age:age,
              coordinate:{name:coordName, location:{type:coordType, coordinates:[coordLat, coordLon]}},
              city:city,
              notificationActive:notificationActive,
              photoUrl:photoUrl,
              xp:xp,
              isSocialConnected:isSocialConnected,
              form:
              {
                reason:reason,
                dayTime:dayTime,
              },
              stats:
              {
                nbSessions:nbSessions,
                totalTime:totalTime,
                nbEtaps:nbEtaps,
                lastModified:lastModifiedDate,
                creationDate:creationDateDate,
                lastConnection:lastConnectionDate,
              },
              sportPlayed:activityDataID,
              medals:medalDataID,
              level:levelId, 

              
            })
            testUser.save().then(data=>
              {
                res.json({result:true, data: data})
              })
        })
    })
  })
});



module.exports = router;
