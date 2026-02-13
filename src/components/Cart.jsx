import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="Empty Cart"
          className="w-40 h-40 opacity-20 mb-6"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any machinery yet.</p>

        <Link
          to="/"
          className="bg-[#FF5722] text-white px-8 py-3 rounded-sm font-bold uppercase hover:bg-orange-700 transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white p-6 rounded-sm shadow-sm flex flex-col md:flex-row gap-6 items-start"
              >
                {/* Image */}
                <div className="w-full md:w-32 h-32 bg-gray-50 flex items-center justify-center border">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-bold hover:text-[#FF5722]">
                      <Link to={`/product/${item.product?._id}`}>
                        {item.product?.name}
                      </Link>
                    </h3>

                    <p className="text-xl font-bold">
                      ₹{(item.product?.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <p className="text-green-600 text-sm mt-1">In Stock</p>
                  <p className="text-gray-500 text-xs mt-1">Sold by Devika Industries</p>

                  {/* Controls */}
                  <div className="flex items-center gap-6 mt-6">
                    {/* Qty */}
                    <div className="flex border rounded overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="px-4 font-bold">{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-[#FF5722] text-sm hover:underline flex gap-1"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div>
            <div className="bg-white p-6 shadow-sm sticky top-24">
              <div className="flex gap-2 text-green-600 mb-4">
                <ShieldCheck size={20} />
                <span className="text-sm">
                  Part of your order qualifies for FREE Delivery.
                </span>
              </div>

              <div className="text-lg mb-6">
                Subtotal ({cartCount} items):{" "}
                <span className="font-bold">
                  ₹{cartTotal.toLocaleString()}
                </span>
              </div>

              <Link to="/checkout">
                <button className="w-full bg-[#FFD814] hover:bg-[#F7CA00] border py-3 rounded-md mb-4">
                  Proceed to Checkout
                </button>
              </Link>

              <div className="border bg-gray-50 p-3 text-xs text-center">
                Transactions are 100% Secured by Devika Payment Gateway
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
