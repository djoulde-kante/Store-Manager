const sequelize = require('../config/database');
const Product = require('./Product');
const Employee = require('./Employee');
const Sale = require('./Sale');
const Supplier = require('./Supplier');
const Order = require('./Order');
const SaleProduct = require('./SaleProduct');
const User = require('./User');

// Many-to-Many relationship between Sale and Product
Sale.belongsToMany(Product, { 
  through: SaleProduct,
  as: 'products'
});
Product.belongsToMany(Sale, { 
  through: SaleProduct,
  as: 'sales'
});

// Order relationships
Order.belongsTo(Supplier);
Order.belongsTo(Product);
Supplier.hasMany(Order);
Product.hasMany(Order);

module.exports = {
  sequelize,
  Product,
  Employee,
  Sale,
  Supplier,
  Order,
  SaleProduct,
  User
};