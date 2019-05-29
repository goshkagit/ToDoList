const dotenv = require('dotenv/config');

const MongoClient = require('mongodb').MongoClient;

const ObjectId = require('mongodb').ObjectID;

const dbName = "list";

const url = "mongodb://localhost:27017/list";

const mongoOptions = {useNewUrlParser: true};


const state = {
    db: null
};

const connect = (cb) => {
    if (state.db)
        cb();
    else {
        MongoClient.connect(url, mongoOptions, (err, client) => {
            if (err)
                cb(err);
            else {
                state.db = client.db(dbName);
                cb();
            }
        });
    }
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