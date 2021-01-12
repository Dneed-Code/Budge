const income_logic = require("../domain/app/incomeLogic");
const expense_logic = require("../domain/app/expenseLogic");
const Income = require('../domain/models/Transaction');
// Configure Mongoose
var path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});
require('../config/app/mongooseConfig');
const {testIncome} = require("./DataTest");
const {testUserGroupThree} = require("./DataTest");
const {testUserGroupTwo} = require("./DataTest");
const {testUserGroup} = require("./DataTest");


/**
 * Test ID: TINC-01
 * Requirement ID: INC-01
 * Scenario: I should have the change in income from last month to the current month returned when its the same
 */
test('TINC-01: I should have the change in income from last month to the current month returned', () => {
    return income_logic.getChange(testUserGroup).then(data => {
        expect(data).toBe("the same income as last month, great work your income is stable!");
    });
});

/**
 * Test ID: TINC-02
 * Requirement ID: INC-01
 * Scenario: I should have the change in income from last month to the current month returned when its 0 as it should be reflected the same
 */
test('TINC-02: I should have the change in income from last month to the current month returned when the values are 0', () => {
    return income_logic.getChange(testUserGroupThree).then(data => {
        expect(data).toBe("the same income as last month, great work your income is stable!");
    });
});
/**
 * Test ID: TINC-03
 * Requirement ID: INC-02
 * Scenario: I should have a list of incomes return that I can use to feed a doughnut chart and a line graph
 */
test('TINC-03: I should have a list of incomes return that I can use to feed a doughnut chart and a line graph', () => {
    var expectedDictionary = [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000];
    return income_logic.getIncomePerMonth(testUserGroupTwo).then(data => {
        expect(data).toStrictEqual(expectedDictionary);
    });
});

/**
 * Test ID: TINC-04
 * Requirement ID: INC-03
 * Scenario: I should have the data returned relating to income for the current user group, with all the data needed for the supplied data table headings
 */
test('TINC-04: I should have the data returned relating to income for the current user group, with all the data needed for the supplied data table headings', () => {
//TestIncome Belongs to Test group
    return Income.findById(testIncome._id).then(data => {
        expect(data.amount).toEqual(1000);
        expect(data.date_paid).toEqual(28);
        expect(data.source).toEqual('CGI');
        expect(data.transaction_type).toEqual('Income');
    });
});


