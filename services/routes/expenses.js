var express = require('express');
var router = express.Router();
const Expense = require('../../domain/models/Transaction');
const expense_controller = require("../controllers/expenseController");

/*
/!* GET expense dashboard. *!/
router.get('/', async function (req, res, next) {
    const expense = await Expense.find();
    res.render('expense', {title: 'Expenses', expense: expense});
});

/!* Post new expense. *!/
router.post('/', function (req, res) {
    const expense = new Expense({
        user: req.body.user,
        transaction_type: "Expense",
        source: req.body.source,
        interval: req.body.interval,
        start_date: req.body.start_date,
        end_date: req.body.end_date
    });

    expense.save()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(404).json({message: err});
        })
});
*/


/// INCOME ROUTES ///
// GET request for list of all expenses.
router.get('/list', expense_controller.expense_list);

// GET request for creating expense. NOTE This must come before route for id (i.e. display expense).
router.get('/create', expense_controller.expense_create_get);

// POST request for creating expense.
router.post('/create', expense_controller.expense_create_post);

// GET request to delete expense.
router.get('/:id/delete', expense_controller.expense_delete_get);

// POST request to delete expense.
router.post('/:id/delete', expense_controller.expense_delete_post);

// GET request to update expense.
router.get('/:id/update', expense_controller.expense_update_get);

// POST request to update expense.
router.post('/:id/update', expense_controller.expense_update_post);

// GET request for one expense.
router.get('/:id', expense_controller.expense_detail);

// GET expense page.
router.get('/', expense_controller.index);





module.exports = router;

