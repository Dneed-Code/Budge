var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserGroupSchema = new Schema(
    {
        name: {type: String, required: true, maxlength: 25},
    }
);

module.exports = mongoose.model('UserGroups', UserGroupSchema)