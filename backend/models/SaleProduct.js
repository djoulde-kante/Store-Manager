const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SaleProduct = sequelize.define('SaleProduct', {
  quantite_vendue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  prix_unitaire: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

module.exports = SaleProduct;