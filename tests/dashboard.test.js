const income_logic = require("../domain/app/incomeLogic");
const User = require("../domain/models/User");
const UserGroup = require("../domain/models/UserGroup");
const Income = require("../domain/models/transaction");
const async = require("async/index");
const mongoose = require('mongoose')
const {promiseCallback} = require("async");
const databaseName = 'test'
// Configure Mongoose
require('dotenv/config');
require('../config/app/mongooseConfig');


/**
 * Test Data
 */

let testUser = null;
let testUserGroup = null;
let testIncome = null;
/**
 * Test Data Set Up
 */
beforeAll(async(done) => {
    // const mongoDB = 'mongodb+srv://Budge:WgELYn7HV6oO@cluster0.pykcg.mongodb.net/Budge?retryWrites=true&w=majority';
    // mongoose.connect(mongoDB, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: false,
    //     useFindAndModify: false
    // }, () => console.log('Connected to Mongo database'));
    // var db = mongoose.connection;
    // db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    const testUserGroup = new UserGroup({
        name: 'Test User Group',
        password: 'TestPassword'
    });

    testUserGroup.save(function (err) {
        if (err) {
            console.log(err);
            return (err);
        }
        console.log(testUserGroup);
        const testUser = new User({
            first_name: 'John',
            last_name: 'Doe',
            email_address: 'John@doe@com',
            password: 'password',
            user_group: testUserGroup,
            colour: getRandomColor()
        });
        testUser.save(function (err) {
            if (err) {
                console.log(err);
                return (err);

            }
            console.log(testUser);
            var testIncome = new Income(
                {
                    transaction_type: "Income",
                    user: testUser,
                    source: 'Test Source',
                    date_paid: income_logic.getDatePaid(Date.now()),
                    amount: '1000',
                    status: 'true'
                });
            testIncome.save(function (err) {
                if (err) {
                    return (err);
                }
                done();
            });
        });


    });
});

// function SetUp() {
//
//     });




/**
 * Test Data Tear Down
 */
afterAll(async () => {
    TearDown();
    //await mongoose.disconnect();
});

function TearDown() {
    // User.findByIdAndRemove(testUser);
    // UserGroup.findByIdAndRemove(testUserGroup);
    // Income.findByIdAndRemove(testIncome);
}


/**
 * Test ID: TDAS-01
 * Requirement ID: DAS-01
 * Scenario: I should be able to return my income given I am the only person in my group
 */
test('TDAS-01: User with £1000 income gets current income correctly returned as £1000', async () => {
    const actual = income_logic.getIncomeCurrentMonth(testUserGroup);
    //console.log(testUserGroup);
     await expect(Promise.resolve(actual)).resolves.toBe('1000');
    //console.log(actual);
    // return actual.then(data => {
    //     console.log(data);
    //     expect(data).toBe('1000');
    // });
    //return expect(actual).resolves.toEqual('1500');
    // async.parallel({
    //      function (callback) {
    //         income_logic.getIncomeCurrentMonth(testUserGroup).then(function (incomeCurrentMonth) {
    //             callback("", incomeCurrentMonth);
    //         })
    //             .catch((err) => {
    //                 console.log(err);
    //             })
    //     }
    // }, function (err, results) {
    //     expect(results).toEqual('1000');
    // });

});

test('resolves a lemon', async () => {
    await expect(Promise.resolve('lemon')).resolves.toBe('lemo21n');
    await expect(Promise.resolve('lemon')).resolves.not.toBe('octopus');
});
/**
 * Test ID: TDAS-02
 * Requirement ID: DAS-01
 * Scenario: I should be able to return my groups total income given I am not the only person in my group
 */
// test('TDAS-02: Two Users with £1000 income gets current income correctly returned as £2000', () => {
//     //SETUP
//     const testUserTwo = new User({
//         first_name: 'John',
//         last_name: 'Doe',
//         email_address: 'John@doe.com',
//         password: 'password',
//         user_group: testUserGroup,
//         colour: getRandomColor()
//     });
//     var testIncomeTwo = new Income(
//         {
//             transaction_type: "Income",
//             user: testUserTwo,
//             source: 'Test Source',
//             date_paid: income_logic.getDatePaid(Date.now()),
//             amount: '1000',
//             status: 'true'
//         });
//     testUserTwo.save(function (err) {
//         if (err) {
//             return (err);
//         }
//     });
//     testIncomeTwo.save(function (err) {
//         if (err) {
//             return (err);
//         }
//     });
//
//     //ASSERTION
//     var actual = income_logic.getIncomeCurrentMonth(testUserGroup);
//     expect(actual).resolves.toEqual('2000');
// });

/**
 * Test ID: TDAS-03
 * Requirement ID: DAS-02
 * Scenario: I should have a dictionary of incomes for my minimal expenses graph given my group has expenses
 */
// test('TDAS-03: Income Dictionary returns correct values', () => {
//     var actual = income_logic.getIncomePerMonth(testUserGroup);
//      actual.then(v => console.log(v));
//     return expect(actual).resolves.toEqual('1000');
//
// });

/**
 * Test Helper Method
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
