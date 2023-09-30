const Sequelizer = require('sequelize');

const sequelize = require('../utils/database');


const Order = sequelize.define(
  'order',
  {
    id:{
      type:Sequelizer.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true
    }
  }
);

module.exports= Order;