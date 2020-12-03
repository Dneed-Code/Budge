var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TransactionSchema = new Schema(
    {
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        transaction_type: {type: String, required: true, enum: ['Income', 'Expense', 'Asset', 'Liability'], default: 'Income'},
        source: {type: String, required: true, maxlength: 25},
        interval: {type: Number, maxlength: 15},
        start_date: {type: Date},
        end_date: {type: Date},
    }
);

module.exports = mongoose.model('Transactions', TransactionSchema)