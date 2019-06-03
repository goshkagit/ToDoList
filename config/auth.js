const token = require('jsonwebtoken');
const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
    const authorization = req.header('Authorization');

    if (authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return null;
};

const auth = {
    required: jwt({
        secret: 'GxjTWP4Mth25rQyB',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: 'GxjTWP4Mth25rQyB',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
};
const generate = (user) => {

    let today = new Date();
    let expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return token.sign({
        login: user.login,
        id: user._id,
        exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'GxjTWP4Mth25rQyB');
};
module.exports = {
    auth,
    generate
};