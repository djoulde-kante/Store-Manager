const { Order, Product, Supplier } = require('../models');
const baseController = require('./baseController')(Order);

const orderController = {
  ...baseController,

  create: async (req, res) => {
    try {
      const { product_id, quantite_commandee } = req.body;
      
      // Verify product exists
      const product = await Product.findByPk(product_id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const order = await Order.create(req.body);
      
      const completeOrder = await Order.findByPk(order.id, {
        include: [Product, Supplier]
      });
      
      res.status(201).json(completeOrder);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update order status
  updateStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findByPk(req.params.id);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      await order.update({ statut: status });
      
      // If order is delivered, update product quantity
      if (status === 'livrée') {
        const product = await Product.findByPk(order.product_id);
        await product.update({
          quantite: product.quantite + order.quantite_commandee
        });
      }

      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = orderController;