var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        user_group: {type: Schema.Types.ObjectId, ref: 'UserGroup', required: true},
        first_name: {type: String, required: true, maxlength: 25},
        last_name: {type: String, required: true, maxlength: 25},
        permission_level: {type: String, required: true, enum: ['Admin', 'User'], default: 'User'},
        email_address: {type: String, required: true, maxlength: 25},

    }
);

module.exports = mongoose.model('Users', UserSchema)