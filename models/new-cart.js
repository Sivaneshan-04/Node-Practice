const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Cart = sequelize.define();

module.exports = Cart;