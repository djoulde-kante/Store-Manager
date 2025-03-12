const roles = {
  admin: ['all'],
  manager: ['all'],
  employee: ['readProducts', 'createSales', 'readSales', 'updateProducts']
};

const permissions = {
  // Products permissions
  readProducts: ['/api/products', 'GET'],
  createProducts: ['/api/products', 'POST'],
  updateProducts: ['/api/products/:id', 'PUT'],
  deleteProducts: ['/api/products/:id', 'DELETE'],
  
  // Sales permissions
  readSales: ['/api/sales', 'GET'],
  createSales: ['/api/sales', 'POST'],
  updateSales: ['/api/sales/:id', 'PUT'],
  deleteSales: ['/api/sales/:id', 'DELETE'],
  
  // Users/Employees permissions
  readUsers: ['/api/users', 'GET'],
  createUsers: ['/api/users', 'POST'],
  updateUsers: ['/api/users/:id', 'PUT'],
  deleteUsers: ['/api/users/:id', 'DELETE'],
  
  // Suppliers permissions
  readSuppliers: ['/api/suppliers', 'GET'],
  createSuppliers: ['/api/suppliers', 'POST'],
  updateSuppliers: ['/api/suppliers/:id', 'PUT'],
  deleteSuppliers: ['/api/suppliers/:id', 'DELETE']
};

const checkRole = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const userRole = req.user.role;
    const userPermissions = roles[userRole];

    if (!userPermissions) {
      return res.status(403).json({ message: 'Invalid role' });
    }

    if (userPermissions.includes('all') || userPermissions.includes(requiredPermission)) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }
  };
};

module.exports = { checkRole, roles, permissions };