var express = require('express');
const async = require("async/index");
const User = require('../../domain/models/User');
const UserGroup = require('../../domain/models/UserGroup');
var router = express.Router();
const {ensureAuthenticated} = require("../../config/auth.js")
const index_controller = require("../controllers/indexController");

/* GET dashboard page(home). */
router.get('/',ensureAuthenticated, index_controller.index);
/* GET dashboard page. */
router.get('/dashboard',ensureAuthenticated, index_controller.index);
//register page
router.get('/register', (req,res)=>{
  res.render('register' ,{layout: 'pre-main'});
})


module.exports = router;
