import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, History } from 'lucide-react';

function POSHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <button
          onClick={() => navigate('/pos/checkout')}
          className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <ShoppingCart className="w-24 h-24 text-blue-600 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">New Sale</h2>
          <p className="text-gray-600 text-center">
            Start a new transaction with the point of sale system
          </p>
        </button>

        <button
          onClick={() => navigate('/pos/sales')}
          className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200"
        >
          <History className="w-24 h-24 text-green-600 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sales History</h2>
          <p className="text-gray-600 text-center">
            View and manage transaction history and reports
          </p>
        </button>
      </div>
    </div>
  );
}

export default POSHome;