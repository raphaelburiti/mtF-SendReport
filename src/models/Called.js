const { Schema, model } = require('mongoose')

const CalledSchema = new Schema({

    id_customer: {
        type: String,
        required: true,
        ref: 'Customer'
        // deve ser unique
    },
    id_user: {
        type: String,
        required: true,
    },
    id_called: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    qtd_called: {
        type: Number,
        required: true,
        // default: 1
    },
    distance: {
        type: Number,
    },
    parking: {
        type: Number,
    },
    toll: {
        type: Number,
    },
}, {
    timestamps: true,
});

module.exports = model('Called', CalledSchema);