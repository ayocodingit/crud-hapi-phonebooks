const { Schema, model } = require('mongoose')

const PhonebookSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    no_phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
    }
}, {
    timestamps: true
})

module.exports = model('Phonebook', PhonebookSchema)