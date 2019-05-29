const dotenv = require('dotenv/config');
const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;
const dbName = "list";
const url = "mongodb://localhost:27017/list";
const mongoOptions = {useNewUrlParser: true ,   useCreateIndex: true};

const state = {
    db: null
};

const connect = function () {

    return new Promise((resolve, reject) => {
        mongoose.Promise = global.Promise;
        mongoose.set('debug', true);

        mongoose.connection
            .on('error', error => reject(error))
            .on('close', () => console.log('Database connection closed.'))
            .once('open', () => resolve(mongoose.connections[0]));


        mongoose.connect(url, mongoOptions);
        console.log("Connected successfully to database server");
    })
};

const getPrimaryKey = (_id) => {
    return ObjectId(_id);
};

const getDB = () => {
    return state.db;
};

module.exports = {
    getDB,
    connect,
    getPrimaryKey
};