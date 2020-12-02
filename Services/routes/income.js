var express = require('express');
var router = express.Router();

/* GET income dashboard. */
router.get('/', function(req, res, next) {
  res.render('income', { title: 'Income' });
});


module.exports = router;

