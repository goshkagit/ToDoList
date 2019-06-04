const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({

    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token:{
        type: String,
        required: false
    }
});


schema.set('toJSON', {
    virtuals: true
});



module.exports = mongoose.model('User', schema);