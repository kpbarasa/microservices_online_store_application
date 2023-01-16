const mongoose = require('mongoose');
const { DB_URL } = require('../config');
const {MongoDBError} = require('../utils/errors/app-errors')

module.exports = async() => {

    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Db Connected');
        
    } catch (error) {
        throw new MongoDBError("Unalbe to connect to db");
    }
 
};

 