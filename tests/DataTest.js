/**
 * Test Data
 */


/**
 * Test Data Set Up
 * GROUP 1
 */
module.exports.testUserGroup = {
    _id: '5ffd787674c0444420d9c092',
    name: 'ExampleGroup',
    password: 'TestPassword'
};

module.exports.testUser =  ({
    _id: '5ffd95006f4f8e0f60ea597b',
    first_name: 'John',
    last_name: 'Doe',
    email_address: 'John@doe@com',
    password: 'password',
    user_group: '5ffd787674c0444420d9c092',
    colour: 'blue'
});

module.exports.testIncome =  (
    {
        _id: '5ffdb222f1a327f14925d042',
        transaction_type: "Income",
        user: '5ffd95006f4f8e0f60ea597b',
        source: 'Test Source',
        date_paid: Date.now(),
        amount: '1000',
        status: 'true'
    });
module.exports.testExpense =  (
    {
        _id: '5ffdbd3df1a327f14925d046',
        transaction_type: "Expense",
        user: '5ffd95006f4f8e0f60ea597b',
        source: 'Test Source',
        date_paid: Date.now(),
        amount: '1000',
        status: 'true'
    });
/**
 * Test Data Set Up
 * GROUP 2
 */
module.exports.testUserGroupTwo = {
    _id: '5ffdb5b132d87724a943c6b3',
    name: 'ExampleGroup',
    password: 'TestPassword'
};
module.exports.testUserTwo =  ({
    _id: '5ffd959bf351cd5ae0c29543',
    first_name: 'John',
    last_name: 'Doe',
    email_address: 'John@doe@com',
    password: 'password',
    user_group: '5ffd787674c0444420d9c092',
    colour: 'blue'
});
module.exports.testUserThree =  ({
    _id: '5ffdb5e9ca9c1e124f11f317',
    first_name: 'John',
    last_name: 'Doe',
    email_address: 'John@doe@com',
    password: 'password',
    user_group: '5ffd787674c0444420d9c092',
    colour: 'blue'
});

module.exports.testIncomeTwo =  (
    {
        _id: '5ffdb663f1a327f14925d043',
        transaction_type: "Income",
        user: '5ffd95006f4f8e0f60ea597b',
        source: 'Test Source',
        date_paid: Date.now(),
        amount: '1000',
        status: 'true'
    });
module.exports.testIncomeThree =  (
    {
        _id: '5ffdb66ff1a327f14925d044',
        transaction_type: "Income",
        user: '5ffd95006f4f8e0f60ea597b',
        source: 'Test Source',
        date_paid: Date.now(),
        amount: '1000',
        status: 'true'
    });
/**
 * Test Data Set Up
 * GROUP 3
 */
module.exports.testUserGroupThree = {
    _id: '5ffdbb3b32d87724a943c6b4',
    name: 'ExampleGroup',
    password: 'TestPassword'
};
module.exports.testUserFour =  ({
    _id: '5ffdbb73ca9c1e124f11f318',
    first_name: 'John',
    last_name: 'Doe',
    email_address: 'John@doe@com',
    password: 'password',
    user_group: '5ffd787674c0444420d9c092',
    colour: 'blue'
});
module.exports.testIncomeFour =  (
    {
        _id: '5ffdbbb5f1a327f14925d045',
        transaction_type: "Income",
        user: '5ffdbb73ca9c1e124f11f318',
        source: 'Test Source',
        date_paid: Date.now(),
        amount: '1000',
        status: 'true'
    });

