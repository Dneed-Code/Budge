const expense_logic = require("../domain/app/expenseLogic");


// Configure Mongoose
var path = require('path');
require('dotenv').config({path: path.join(__dirname, '../.env')});

const mongoose = require('../config/app/mongooseConfig');
const {testUserGroupThree} = require("./DataTest");
const {testUserGroupTwo} = require("./DataTest");
const {testUserGroup} = require("./DataTest");


/**
 * Test ID: TDAS-05
 * Requirement ID: DAS-03
 * Scenario: I should be able to return my expense given I am the only person in my group
 */
test('TDAS-05: User with £1000 expense gets current expense correctly returned as £1000', () => {
    return expense_logic.getExpenseCurrentMonth(testUserGroup).then(data => {
        expect(data).toBe(1000);
    });
});

/**
 * Test ID: TDAS-06
 * Requirement ID: DAS-03
 * Scenario: I should be able to return my groups total expense given I am not the only person in my group
 */
test('TDAS-06: Two Users with £1000 expense gets current expense correctly returned as £2000', () => {
    return expense_logic.getExpenseCurrentMonth(testUserGroupTwo).then(data => {
        expect(data).toBe(2000);
    });
});


/**
 * Test ID: TDAS-07
 * Requirement ID: DAS-04
 * Scenario: I should have a dictionary of expenses for my minimal expenses graph given my group has expenses
 */
test('TDAS-07: Expense Dictionary returns correct values (£2000s)', () => {
    var expectedDictionary = [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000];
    return expense_logic.getExpensePerMonth(testUserGroupTwo).then(data => {
        expect(data).toStrictEqual(expectedDictionary);
    });
});

/**
 * Test ID: TDAS-08
 * Requirement ID: DAS-04
 * Scenario: I should have a dictionary of key: month and value: 0 if my group has no expense
 */
test('TDAS-08: Expense Dictionary returns correct values (£0s)', () => {
    var expectedDictionary = [0,0,0,0,0,0,0,0,0,0,0,0];
    return expense_logic.getExpensePerMonth(testUserGroupThree).then(data => {

        expect(data).toStrictEqual(expectedDictionary);
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
