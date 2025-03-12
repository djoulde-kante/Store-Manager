const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantite_commandee: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date_livraison: {
    type: DataTypes.DATE,
    allowNull: false
  },
  statut: {
    type: DataTypes.ENUM('en attente', 'confirmée', 'livrée', 'annulée'),
    defaultValue: 'en attente'
  }
});

module.exports = Order;