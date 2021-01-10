var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NotificationSchema = new Schema(
    {
        title: {type: String, required: true, maxlength: 25},
        description: {type: String, required: true},
        date_time: {type: Date},
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        user_group: {type: Schema.Types.ObjectId, ref: 'UserGroup', required: true},

    }
);

module.exports = mongoose.model('Notification', NotificationSchema)