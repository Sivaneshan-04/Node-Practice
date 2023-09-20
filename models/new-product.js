const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Product = sequelize.define('products',{
    id:{
        autoIncrement:true,
        allowNull:false,
        type: Sequelize.INTEGER,
        primaryKey:true
    },
    title:{
        type: Sequelize.STRING,
        allowNull:false
    },
    //can also be written as
    //title:Sequelize.STRING,
    price:{
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    imageUrl:{
        type:Sequelize.STRING,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false
    },
});

module.exports=Product;