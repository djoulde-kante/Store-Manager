import React, { useState } from 'react';
import { useStore } from '../../store';
import { ShoppingCart, CreditCard, Smartphone, Banknote, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const [barcode, setBarcode] = useState('');
  const [cart, setCart] = useState<Array<{ product: any; quantity: number }>>([]);
  const navigate = useNavigate();

  return (
    <div className="h-full">
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate('/pos')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to POS Menu
        </button>
      </div>

      <div className="flex h-[calc(100vh-12rem)] gap-6">
        {/* Left side - Product scanning and cart */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Scan barcode or search product..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Add
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <ShoppingCart className="w-16 h-16 mb-4" />
                <p>Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        €{item.product.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="font-medium">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </div>
                      <button className="text-red-600 hover:text-red-800">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Payment */}
        <div className="w-96 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Payment</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>€0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (20%)</span>
              <span>€0.00</span>
            </div>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>€0.00</span>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <Banknote className="w-5 h-5" />
              Pay with Cash
            </button>
            <button className="w-full flex items-center justify-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <CreditCard className="w-5 h-5" />
              Pay with Card
            </button>
            <button className="w-full flex items-center justify-center gap-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              <Smartphone className="w-5 h-5" />
              Mobile Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;