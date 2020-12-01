var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('income', { title: 'Income' });
});

module.exports = router;
