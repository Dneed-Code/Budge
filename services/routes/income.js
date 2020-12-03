var express = require('express');
var router = express.Router();
const Income = require('../../domain/models/Transaction');

/* GET income dashboard. */
router.get('/', function (req, res, next) {
    res.render('income', {title: 'Income'});
});

/* Post new income. */
router.post('/', function (req, res) {
    const income = new Income({
        user: req.body.user,
        transaction_type: req.body.transaction_type,
        source: req.body.source,
        interval: req.body.interval,
        start_date: req.body.start_date,
        end_date: req.body.end_date
    });

    income.save()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.json({message: err});
        })
});


module.exports = router;

