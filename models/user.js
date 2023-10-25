const mongoDb = require('mongodb');
const getDb = require('../utils/database').getDb;

class Users{
    constructor(username, email){
        this.name= username;
        this.email = email
    }

    save(){
        return getDb().collection('users').insertOne(this);
    }

    static findById(id){
        return getDb().collection('users').find({_id:new mongoDb.ObjectId(id)}).next();
    }
}
module.exports = Users;