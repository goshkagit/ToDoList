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
});


schema.set('toJSON', {
    virtuals: true
});


schema.methods.generateJWT = function () {

};

schema.methods.toAuth = () => {
    return {

        token: this.generateJWT()
    };
};


module.exports = mongoose.model('User', schema);