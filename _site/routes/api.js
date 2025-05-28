// var express = require('express');

// const db = require('../models');

// var router = express.Router();

// /**
//  * @GET /api/
//  */
// router.get('/', function(req, res, next) {
//     db.api.findAll().then(apis => res.json({
//         error: false,
//         data: apis,
//     }))
//     .catch(error => res.json({
//         error: true,
//         data: [],
//         error: error
//     }));
// });
////////////////si dessus code pour api///////////////////////////

/////////////////si dessous le code du fichier index//////////////
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

