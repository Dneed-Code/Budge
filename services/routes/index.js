var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home');
});
/* GET dashboard page. */
router.get('/dashboard', function(req, res, next) {
  res.render('index', { title: 'Dashboard', dashboard: true });
});
//register page
router.get('/register', (req,res)=>{
  res.render('register');
})

module.exports = router;
