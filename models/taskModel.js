const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({

    tittle: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    whoPosted: {
        type: String,
        required: true
    }
});

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Task', schema);