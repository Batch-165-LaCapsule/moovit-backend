var express = require("express");
var router = express.Router();
require("../models/connection"); //import de la connection string
const User = require("../models/users"); //import du schema user
const Activity = require("../models/activities"); //import du schema activity
const Medal = require("../models/medals"); //import du schema medals
const { checkBody } = require("../modules/checkBody"); //import de la fonction checkBody qui verifie que tout le champs soit ni null ni une string vide
const uid2 = require("uid2"); // module qui permet de generer une num de token
const bcrypt = require("bcrypt"); //module permet de haché le password

 //route post endpoint /signup
router.post("/signup", (req, res) => {
 
  //fonction checkBody qui verifie que tout les champs soit ni null ni une string vide prend en parametre du body ['username', 'password']
  if (!checkBody(req.body, ["email", "password"])) {
    
    res.json({ result: false, error: "Missing or empty fields" }); //la fun renvoi un json resiltat false error: 'Missing or empty fields'
    return;
  }

   //recherche dans la db User UN seul User avec le nom en param
  User.findOne({ email: req.body.email }).then((data) => {
   
    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i; //regex pattern d'email (([\w.-]=raccourci de [a-zA-Z0-9_.-])) @ et 2caractere apres le .
    
     //si il n'y a pas de data reçu et que le regex .test renvoie true
    if (data === null && emailRegex.test(req.body.email)) {
     
      const hash = bcrypt.hashSync(req.body.password, 10); // cryptage du password (hashé 10x)

       //creation d'un new user
      const newUser = new User({
       
        email: req.body.email, // inscription de l ecmail en db
        password: hash, // cryptage du password (hashé 10x)
        token: uid2(32), //token de 32 caracteres
      });

      newUser
        .save() //methode crud create avec .save de new user
        .catch(() => {
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

//route post endpoint /signin
router.post("/signin", (req, res) => {
  
      //fonction checkBody qui verifie que tout le champs soit ni null ni une string vide prend en parametre du body ['username', 'password']
  if (!checkBody(req.body, ["email", "password"])) {
    res.json({ result: false, error: "wrong or empty fields" }); //la fun renvoi un json resiltat false error: 'Missing or empty fields'
    return;
  }

  User.findOne({ email: req.body.email }) //recherche en db de l email//recherche dans la db User UN seul User avec le nom en param et renvoi des donné le consernant
    .then((data) => {
      //si data et password rentré et crypté est identique au password en db
      if (data && bcrypt.compareSync(req.body.password, data.password)) {
        
        
        

        res.json({result:true, token:data.token, sport: data.sportPlayed})//renvoi de la reponse si l'authentification a réussi

      } else {
        res.json({ result: false, error: "User not found or wrong password" }); // renvoi un json resultat false et un msg error
      }
    })
    .catch(() => {
      res.status(500).json({ error: "connection data base error " }); // Si une erreur survient lors de la sauvegarde du document
    });
});




//route geoloc
router.post("/geoloc", (req, res) => 
{
  // Récupération des données envoyées dans le body de la requête
  let {token, lat, lon} = req.body

  //recherche de la ville via latitude et longitude en fasant une requete à l' api gratuite 
  fetch(`https://wttr.in/${lat},${lon}?format=j1`).then(r=>r.json()).then(data=>
  {
   
    //verifier que tout les champs sont présents
    if(checkBody(req.body, ["token","lat", "lon"]))
    {
      //si la reponse de l' api est pas null
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
                //reponse envoyée 
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
             
              //verifier que l' activity a été bien trouvée
              if(activityData)
              {
                //recherche le "level" dans la collection "activities"
                let activityLevel
                for(let Vlevel of activityData.levels)
                {
                  if(Vlevel.levelID===userData.currentLevelID)
                  {
                     activityLevel=Vlevel
                  }
                }
                
                //requete vers l' api meteo
                fetch(`https://wttr.in/${userData.city}?format=j1&lang=fr`).then(r=>r.json()).then(meteoData=>
                {
                  //stocker les données meteo
                  let meteoDesc = meteoData.current_condition[0].lang_fr[0].value

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
            let levelId
            if(level==="Aucune expérience")
            {levelId = 1}
            else if(level==="Débutant")
            {levelId = 3}
            else if(level==="Intermédiaire")
            {levelId = 5}
            else if(level==="Avancé")
            {levelId = 7}
            else
            {
              //reponse si le niveau n est pas trouvé
              res.json({result:false, error: "level not found"})
              return 
            }

            //modification de user pour ajouter les données manquants
            User.updateOne({token:token}, {username:username, name:name, gender:gender, age:age, notificationActive:notificationActive, form:{reason:reason, dayTime:dayTime}, sportPlayed:[sportData._id], currentLevelID:levelId, height:height, weight:weight,city:city.toLowerCase(), photoUrl:"https://res.cloudinary.com/deuhttaaq/image/upload/f_auto,q_auto/v1748005964/projectFinDeBatch/front/images/default-profile_cltqmm.png", stats:{nbSessions:0,totalTime:0}}).then(userData=>
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

//route pour updater le level
router.post("/levelupdate", (req, res)=>
{
  // Récupération des données envoyées dans le body de la requête
  let {token, sport, xp, subLevel,level, sessions, playTime} = req.body

  //verifier que tout les champs sont présents
  if(checkBody(req.body, ["token","sport","xp","subLevel","level"]))
  {
    //modification de user pour mettre à jour les données
    User.updateOne({token:token},{xp:xp, currentSubLevelID:subLevel, currentLevelID:level, stats:{nbSessions:sessions,totalTime:playTime}}).then(modifiedUser=>
    {
      //verifier que l' element user a été bien modifié
      if(modifiedUser.modifiedCount>0)
      { 
            //recherche du user modifié dans la collection User
            User.findOne({token:token}).populate("sportPlayed").then(userData=>
            {
                //verifier si le user modifié a été bien trouvé
              if(userData)
              {
                //rechercher l' activité choisi dans la collection "activities"
                  Activity.findOne({title:sport}).then(activityData=>
                  {
                  
                    //verifier que l' activity a été bien trouvée
                    if(activityData)
                    {
                      //recherche le "level" dans la collection "activities"
                      let activityLevel
                      for(let Vlevel of activityData.levels)
                      {
                        if(Vlevel.levelID===userData.currentLevelID)
                        {
                          activityLevel=Vlevel
                        }
                      }
                      //reponse avec les données "level"
                        res.json({result:true, dataActivity:activityLevel})
                      
                      

                    }
                    else
                    {
                        //reponse si l' ectivity n a pas trouvée
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
        //reponse si user n' a pas été modifié
        res.json({result:false, error: "user not updated"})
      } 

    })

  }
  else 
  {
     //reponse si absance du champ
    res.json({result:false, error: "entry not found"})
  }


})

//route pour recuperer un sport
router.post("/getsport", (req, res)=>
{
  let {sport} = req.body

  //verifier que tout les champs sont présents
  if(checkBody(req.body, ["sport"]))
  {
    
    //recherche du sport choisi dans la collection activity
    Activity.findOne({title:sport}).then(dataActivity=>
    {
      //reponse si le sport a ete bien trouvé
      res.json({result:true, data:dataActivity})
    })

  }

})



//route pour tester la collection user
router.post("/testUser", (req, res) => 
{
  let {admin, token, email, password, username, name, gender, age, coordName, coordType, coordLat, coordLon, city, notificationActive, photoUrl, currentLevelID, currentSubLevelID, xp, isSocialConnected, reason, dayTime, nbSessions, totalTime, nbEtaps,height,weight} = req.body
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
              currentSubLevelID:currentSubLevelID,
              currentLevelID:currentLevelID,
              weight:weight, 
              height:height,

              
            })
            testUser.save().then(data=>
              {
                res.json({result:true, data: data})
              })
    })
  })
});



module.exports = router;
