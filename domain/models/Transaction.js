var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TransactionSchema = new Schema(
    {

        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        transaction_type: {
            type: String,
            required: true,
            enum: ['Income', 'Expense', 'Asset', 'Liability'],
            default: 'Income'
        },
        source: {type: String, required: true, maxlength: 25},
        date_paid: {type: Number, maxlength: 15},
        start_date: {type: Date , default: Date.now},
        end_date: {type: Date, default: Date.now},
        amount: {type: Number, maxlength: 15},
        status: {type: Boolean, required: true, maxlength: 15},
    }
);

const model  = mongoose.model('Transaction', TransactionSchema);
module.exports = model;