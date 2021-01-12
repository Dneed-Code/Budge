const income_logic = require("../domain/app/incomeLogic");
const expense_logic = require("../domain/app/expenseLogic");

// Configure Mongoose
require('dotenv/config');
require('../config/app/mongooseConfig');
const {testUserGroupThree} = require("./DataTest");
const {testUserGroupTwo} = require("./DataTest");
const {testUserGroup} = require("./DataTest");


/**
 * Test ID: TDAS-01
 * Requirement ID: DAS-01
 * Scenario: I should be able to return my income given I am the only person in my group
 */
test('TDAS-01: User with £1000 income gets current income correctly returned as £1000', () => {
    return income_logic.getIncomeCurrentMonth(testUserGroup).then(data => {
        expect(data).toBe(1000);
    });
});

/**
 * Test ID: TDAS-02
 * Requirement ID: DAS-01
 * Scenario: I should be able to return my groups total income given I am not the only person in my group
 */
test('TDAS-02: Two Users with £1000 income gets current income correctly returned as £2000', () => {
    return income_logic.getIncomeCurrentMonth(testUserGroupTwo).then(data => {
        expect(data).toBe(2000);
    });
});


/**
 * Test ID: TDAS-03
 * Requirement ID: DAS-02
 * Scenario: I should have a dictionary of incomes for my minimal expenses graph given my group has expenses
 */
test('TDAS-03: Income Dictionary returns correct values (£2000s)', () => {
    var expectedDictionary = [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000];
    return income_logic.getIncomePerMonth(testUserGroupTwo).then(data => {
        expect(data).toStrictEqual(expectedDictionary);
    });
});

/**
 * Test ID: TDAS-04
 * Requirement ID: DAS-02
 * Scenario: I should have a dictionary of key: month and value: 0 if my group has no income
 */
test('TDAS-04: Income Dictionary returns correct values (£0s)', () => {
    var expectedDictionary = [0,0,0,0,0,0,0,0,0,0,0,0];
    return income_logic.getIncomePerMonth(testUserGroupThree).then(data => {

        expect(data).toStrictEqual(expectedDictionary);
    });
});

/**
 * Test ID: TDAS-09
 * Requirement ID: DAS-05
 * Scenario: I should have a dictionary of incomes and expenses for my cash flow graph given my group has Income and expenses
 */
test('TDAS-09: Both expense and Income Dictionary returns correct values (£2000s)', () => {
    var expectedDictionary = [2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000,2000];
    return expense_logic.getExpensePerMonth(testUserGroupTwo).then(data => {
        expect(data).toStrictEqual(expectedDictionary);
    });
    return income_logic.getIncomePerMonth(testUserGroupTwo).then(data => {
        expect(data).toStrictEqual(expectedDictionary);
    });
});
/**
 * Test ID: TDAS-10
 * Requirement ID: DAS-05
 * Scenario: I should have a dictionary of key: month and value: 0 if my group has no income
 */
test('TDAS-10: Income Dictionary for cashflow returns correct values (£0s)', () => {
    var expectedDictionary = [0,0,0,0,0,0,0,0,0,0,0,0];
    return income_logic.getIncomePerMonth(testUserGroupThree).then(data => {

        expect(data).toStrictEqual(expectedDictionary);
    });
});

/**
 * Test ID: TDAS-11
 * Requirement ID: DAS-05
 * Scenario: I should have a dictionary of key: month and value: 0 if my group has no expenses
 */
test('TDAS-11: Expense Dictionary for cashflow returns correct values', () => {
    var expectedDictionary = [0,0,0,0,0,0,0,0,0,0,0,0];
    return income_logic.getIncomePerMonth(testUserGroupThree).then(data => {

        expect(data).toStrictEqual(expectedDictionary);
    });
});

