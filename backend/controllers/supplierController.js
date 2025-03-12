const { Supplier, Order } = require('../models');
const baseController = require('./baseController')(Supplier);

const supplierController = {
  ...baseController,

  // Get supplier with their orders
  getWithOrders: async (req, res) => {
    try {
      const supplier = await Supplier.findByPk(req.params.id, {
        include: [{
          model: Order,
          include: ['Product']
        }]
      });
      if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
      res.json(supplier);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = supplierController;