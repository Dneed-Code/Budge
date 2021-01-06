var express = require('express');
var router = express.Router();
const expense_controller = require("../controllers/expenseController");
const passport = require('passport');
const {ensureAuthenticated} = require("../../config/auth.js")

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
router.get('/:id', expense_controller.index);

// GET expense page.
router.get('/',ensureAuthenticated, expense_controller.index);


module.exports = router;

