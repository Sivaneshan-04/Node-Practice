const Sequelizer = require('sequelize');

const sequelize = require('../utils/database');


const OrderItem = sequelize.define(
  'orderItem',
  {
    id:{
      type:Sequelizer.INTEGER,
      autoIncrement:true,
      allowNull:false,
      primaryKey:true
    },
    quantity:Sequelizer.INTEGER,
  },
);

module.exports= OrderItem;