var express = require('express');
var router = express.Router();
const User = require('../../domain/models/User');

/* GET user dashboard. */
router.get('/', function (req, res, next) {
    res.render('user', {title: 'Users'});
});

/* Post new user. */
router.post('/', function (req, res) {
    const user = new User({
        user_group: req.body.user,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        permission_level: req.body.permission_level,
        email_address: req.body.email_address,

    });

    user.save()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(404).json({message: err});
        })
});


module.exports = router;

