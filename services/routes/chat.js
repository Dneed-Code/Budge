var express = require('express');
const async = require("async/index");
const User = require('../../domain/models/User');
const UserGroup = require('../../domain/models/UserGroup');
var router = express.Router();
const {ensureAuthenticated} = require("../../config/auth.js")
const chat_controller = require("../controllers/chatController");

/* GET chat page */
router.get('/',ensureAuthenticated, chat_controller.index);

router.post('/messages', ensureAuthenticated, chat_controller.message_create_post);

module.exports = router;
