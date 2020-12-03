var express = require('express');
var router = express.Router();
const UserGroup = require('../../domain/models/UserGroup');

/* GET user dashboard. */
router.get('/', function (req, res, next) {
    res.render('userGroups', {title: 'User Groups'});
});

/* Post new user. */
router.post('/', function (req, res) {
    const userGroup = new UserGroup({
        first_name: req.body.first_name,
    });

    userGroup.save()
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(404).json({message: err});
        })
});


module.exports = router;

