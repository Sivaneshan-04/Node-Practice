const Sequelizer = require('sequelize');

const sequelize = require('../utils/database');


const cartItem = sequelize.define(
  'cartItem',
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

module.exports= cartItem;