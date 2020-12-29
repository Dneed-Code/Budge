var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TransactionSchema = new Schema(
    {
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        transaction_type: {type: String, required: true, enum: ['Income', 'Expense', 'Asset', 'Liability'], default: 'Income'},
        source: {type: String, required: true, maxlength: 25},
        date_paid: {type: Number, maxlength: 15},
        start_date: {type: Date},
        end_date: {type: Date},
        amount: {type: Number, maxlength: 15},
    }
);

module.exports = mongoose.model('Transaction', TransactionSchema)