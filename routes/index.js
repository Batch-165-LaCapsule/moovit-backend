var express = require('express');
var router = express.Router();


// const apiRouter = require('')



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

// import {Router} from 'express'
// import { userRouter } from './user';

// const router = Router();

// router.use('/user',userRouter)

// export const apiRouter = router;
