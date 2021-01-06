var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserGroupSchema = new Schema(
    {
        name: {type: String, required: true, maxlength: 25},
        password:{type: String, required: true}
    }
);

module.exports = mongoose.model('UserGroup', UserGroupSchema)