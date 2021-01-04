var express = require('express');
var router = express.Router();
const {ensureAuthenticated} = require("../../config/auth.js")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', {layout: 'pre-main'});
});
/* GET dashboard page. */
router.get('/dashboard',ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Dashboard', dashboard: true, user: req.user });
});
//register page
router.get('/register', (req,res)=>{
  res.render('register');
})

module.exports = router;
