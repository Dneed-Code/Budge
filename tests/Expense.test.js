const expense_logic = require("../domain/app/expenseLogic");

const Expense = require('../domain/models/Transaction');
// Configure Mongoose
var path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});

const mongoose = require('../config/app/mongooseConfig');
const {testExpense} = require("./DataTest");
const {testUserGroupThree} = require("./DataTest");
const {testUserGroupTwo} = require("./DataTest");
const {testUserGroup} = require("./DataTest");


/**
 * Test ID: TEXP-01
 * Requirement ID: EXP-01
 * Scenario: I should have the change in expense from last month to the current month returned when its the same
 */
test('TEXP-01: I should have the change in expense from last month to the current month returned', () => {
    return expense_logic.getChange(testUserGroup).then(data => {
        expect(data).toBe("the same expense as last month, great work your expense is stable!");
    });
});

/**
 * Test ID: TEXP-02
 * Requirement ID: EXP-01
 * Scenario: I should have the change in expense from last month to the current month returned when its 0 as it should be reflected the same
 */
test('TEXP-02: I should have the change in expense from last month to the current month returned when the values are 0', () => {
    return expense_logic.getChange(testUserGroupThree).then(data => {
        expect(data).toBe("the same expense as last month, great work your expense is stable!");
    });
});
/**
 * Test ID: TEXP-03
 * Requirement ID: EXP-02
 * Scenario: I should have a list of expenses return that I can use to feed a doughnut chart and a line graph
 */
test('TEXP-03: I should have a list of expenses return that I can use to feed a doughnut chart and a line graph', () => {
    var expectedDictionary = [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000];
    return expense_logic.getExpensePerMonth(testUserGroupTwo).then(data => {
        expect(data).toStrictEqual(expectedDictionary);
    });
});

/**
 * Test ID: TEXP-04
 * Requirement ID: EXP-03
 * Scenario: I should have the data returned relating to expense for the current user group, with all the data needed for the supplied data table headings
 */
test('TEXP-04: I should have the data returned relating to expense for the current user group, with all the data needed for the supplied data table headings', () => {
//TestExpense Belongs to Test group
    return Expense.findById(testExpense._id).then(data => {
        expect(data.amount).toEqual(1000);
        expect(data.date_paid).toEqual(28);
        expect(data.source).toEqual('CGI');
        expect(data.transaction_type).toEqual('Expense');
    });
});


afterAll(async(done) => {
    // Closing the DB connection allows Jest to exit successfully.
    try {
        await mongoose.connection.close();
        done()
    } catch (error) {
        console.log(error);
        done()
    }
})
