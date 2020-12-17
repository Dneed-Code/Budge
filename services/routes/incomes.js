var express = require('express');
var router = express.Router();
const income_controller = require("../controllers/incomeController");

/*
/!* GET income dashboard. *!/
router.get('/', async function (req, res, next) {
    const income = await Income.find();
    res.render('income', {title: 'Incomes', income: income});
});

/!* Post new income. *!/
router.post('/', function (req, res) {
    const income = new Income({
        user: req.body.user,
        transaction_type: "Income",
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
            res.status(404).json({message: err});
        })
});
*/


/// INCOME ROUTES ///
// GET request for list of all incomes.
router.get('/list', income_controller.income_list);

// GET request for creating income. NOTE This must come before route for id (i.e. display income).
router.get('/create', income_controller.income_create_get);

// POST request for creating income.
router.post('/create', income_controller.income_create_post);

// GET request to delete income.
router.get('/:id/delete', income_controller.income_delete_get);

// POST request to delete income.
router.post('/:id/delete', income_controller.income_delete_post);

// GET request to update income.
router.get('/:id/update', income_controller.income_update_get);

// POST request to update income.
router.post('/:id/update', income_controller.income_update_post);

// GET request for one income.
router.get('/:id', income_controller.index);

// GET income page.
router.get('/', income_controller.index);





module.exports = router;

