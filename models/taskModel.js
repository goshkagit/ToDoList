const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({

        tittle: {
            type: String,
        },
        task: {
            type: String,
            required: true,
            unique: true
        },
        // whoPosted: {
        //     type: String,
        //     required: true,
        // },

    },
    {
        timestamps: true
    });

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Task', schema);