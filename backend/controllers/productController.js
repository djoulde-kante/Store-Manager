const { Product } = require('../models');
const baseController = require('./baseController')(Product);

const productController = {
  ...baseController,
  
  // Custom method for low stock products
  getLowStock: async (req, res) => {
    try {
      const threshold = req.query.threshold || 10;
      const products = await Product.findAll({
        where: {
          quantite: {
            [Op.lt]: threshold
          }
        }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Custom method for expiring products
  getExpiringProducts: async (req, res) => {
    try {
      const daysThreshold = req.query.days || 30;
      const date = new Date();
      date.setDate(date.getDate() + parseInt(daysThreshold));

      const products = await Product.findAll({
        where: {
          date_peremption: {
            [Op.lt]: date
          }
        }
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = productController;