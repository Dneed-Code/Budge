const User = require('../../domain/models/User');
const UserGroup = require('../../domain/models/UserGroup');
require('../../domain/app/IncomeHelpers')
// const Transaction = require("../../domain/models/transaction");
const {getDatePaid} = require("../../domain/app/IncomeHelpers");
const users = User.find({last_name: 'Doe'});

/**
 * Create Sample UserGroups
 */


UserGroup.find({name: 'SampleGroup'}, function (err, docs) {
    if (docs.length > 0) {
        //console.log('Name exists already', docs);
    } else {
        createSampleUserGroup('SampleGroup')
    }
});
User.find({first_name: 'John', last_name: 'Doe',user_group: '5ffd787674c0444420d9c092' }, function (err, docs) {
    if (docs.length > 0) {
        //console.log('User exists already', docs);
    } else {
        createSampleUser('John', '5ffd787674c0444420d9c092', 'John@Doe.com')
    }
});
User.find({first_name: 'Jane', last_name: 'Doe',user_group: '5ffd787674c0444420d9c092'}, function (err, docs) {
    if (docs.length > 0) {
        //console.log('User exists already', docs);
    } else {
        createSampleUser('Jane', '5ffd787674c0444420d9c092', 'Jane@Doe.com')
    }
});

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

function createSampleTransaction(type, user) {
    var sampleIncome = new Transaction(
        {
            transaction_type: type,
            user: user,
            source: 'Test Source',
            date_paid: getDatePaid(Date.now()),
            amount: '1000',
            status: 'true'
        });
    sampleIncome.save(function (err) {
        if (err) {
            console.log(err);
            return (err);
        }
    });
    return sampleIncome;
}

function createSampleUser(name, usergroup, email) {
    const sampleUser = new User({
        first_name: name,
        last_name: 'Doe',
        email_address: email,
        password: 'password',
        user_group: usergroup,
        colour :"A6D86A"
})

    sampleUser.save(function (err) {
        if (err) {
            console.log(err);
            return (err);
        }
    });
    // return sampleUser;
}

function createSampleUserGroup(name) {
    const sampleUserGroup = new UserGroup({
        name: name,
        password: 'TestPassword'
    });
    sampleUserGroup.save(function (err) {
        if (err) {
            console.log(err);
            return (err);
        }
    });
    return sampleUserGroup;
}
