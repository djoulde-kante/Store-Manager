const { Sale, Product, SaleProduct } = require('../models');
const baseController = require('./baseController')(Sale);

const saleController = {
  ...baseController,

  create: async (req, res) => {
    try {
      const { products, ...saleData } = req.body;
      
      const sale = await Sale.create(saleData);
      
      // Add products to sale
      if (products && products.length > 0) {
        await Promise.all(products.map(async (product) => {
          // Update product quantity
          const dbProduct = await Product.findByPk(product.id);
          if (!dbProduct || dbProduct.quantite < product.quantite_vendue) {
            throw new Error(`Insufficient stock for product ${product.id}`);
          }
          
          await dbProduct.update({
            quantite: dbProduct.quantite - product.quantite_vendue
          });
          
          // Create sale-product relationship
          await SaleProduct.create({
            SaleId: sale.id,
            ProductId: product.id,
            quantite_vendue: product.quantite_vendue,
            prix_unitaire: product.prix_unitaire
          });
        }));
      }

      const completeData = await Sale.findByPk(sale.id, {
        include: ['products']
      });
      
      res.status(201).json(completeData);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get sales with products
  getById: async (req, res) => {
    try {
      const sale = await Sale.findByPk(req.params.id, {
        include: ['products']
      });
      if (!sale) return res.status(404).json({ message: 'Sale not found' });
      res.json(sale);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = saleController;