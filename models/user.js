const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Users = sequelize.define('users',{
    id:{
        type: Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey: true,
    },
    name: Sequelize.STRING,
    email:Sequelize.STRING,
});

module.exports = Users;