var express = require('express');
const async = require("async/index");
const User = require('../../domain/models/User');
const UserGroup = require('../../domain/models/UserGroup');
var router = express.Router();
const {ensureAuthenticated} = require("../../config/auth.js")
const index_controller = require("../controllers/indexController");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', {layout: 'pre-main'});
});
/* GET dashboard page. */
router.get('/dashboard',ensureAuthenticated, index_controller.index);
//register page
router.get('/register', (req,res)=>{
  res.render('register' ,{layout: 'pre-main'});
})


module.exports = router;
