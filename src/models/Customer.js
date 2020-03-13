const { Schema, model } = require('mongoose')

const CustomerSchema = new Schema({

    id_customer: {
        type: String,
        required: true
    },
    name_customer: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

module.exports = model('Customer', CustomerSchema);