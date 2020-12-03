var express = require('express');
var router = express.Router();
const UserGroup = require('../../domain/models/UserGroup');

/* GET user group dashboard. */
router.get('/', function (req, res, next) {
    res.render('userGroups', {title: 'User Groups'});
});

/* Post new user group. */
router.post('/', function (req, res) {
    const userGroup = new UserGroup({
        name: req.body.name,
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

