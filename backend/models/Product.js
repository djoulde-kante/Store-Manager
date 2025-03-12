const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code_barres: {
    type: DataTypes.STRING,
    unique: true
  },
  categorie: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prix_achat: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  prix_vente: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  quantite: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  date_peremption: {
    type: DataTypes.DATE
  }
});

module.exports = Product;