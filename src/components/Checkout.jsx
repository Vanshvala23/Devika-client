import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ✅ Country codes with max digit lengths
const COUNTRY_CODES = [
  { code: "+91",  country: "IN",  maxLength: 10 },
  { code: "+1",   country: "US",  maxLength: 10 },
  { code: "+44",  country: "UK",  maxLength: 10 },
  { code: "+61",  country: "AU",  maxLength: 9  },
  { code: "+971", country: "UAE", maxLength: 9  },
  { code: "+966", country: "SA",  maxLength: 9  },
  { code: "+65",  country: "SG",  maxLength: 8  },
  { code: "+60",  country: "MY",  maxLength: 9  },
  { code: "+92",  country: "PK",  maxLength: 10 },
  { code: "+880", country: "BD",  maxLength: 10 },
  { code: "+86",  country: "CN",  maxLength: 11 },
  { code: "+81",  country: "JP",  maxLength: 10 },
  { code: "+49",  country: "DE",  maxLength: 11 },
  { code: "+33",  country: "FR",  maxLength: 9  },
  { code: "+39",  country: "IT",  maxLength: 10 },
  { code: "+7",   country: "RU",  maxLength: 10 },
  { code: "+55",  country: "BR",  maxLength: 11 },
  { code: "+27",  country: "ZA",  maxLength: 9  },
  { code: "+234", country: "NG",  maxLength: 10 },
  { code: "+20",  country: "EG",  maxLength: 10 },
];

const PhoneInput = ({ dialCode, number, onDialCodeChange, onNumberChange }) => {
  const selected = COUNTRY_CODES.find((c) => c.code === dialCode) || COUNTRY_CODES[0];

  const handleNumber = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= selected.maxLength) onNumberChange(raw);
  };

  return (
    <div className="flex border border-gray-300 rounded focus-within:border-[#FF5722] transition overflow-hidden">
      <select
        value={dialCode}
        onChange={(e) => { onDialCodeChange(e.target.value); onNumberChange(''); }}
        className="bg-gray-50 border-r border-gray-300 text-gray-700 text-sm px-2 py-2 focus:outline-none cursor-pointer"
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code + c.country} value={c.code}>
            {c.country} {c.code}
          </option>
        ))}
      </select>
      <input
        type="tel"
        required
        value={number}
        onChange={handleNumber}
        placeholder={`Max ${selected.maxLength} digits`}
        className="flex-1 px-3 py-2 text-sm focus:outline-none"
      />
    </div>
  );
};

const Checkout = () => {
  const { cartItems, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    address: '',
    city: '',
    dialCode: '+91',
    phone: '',
    email: '',
    zip: '',
  });

  // ✅ Auto-fill from user profile
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || [];
      let savedDialCode = '+91';
      let savedPhone = '';
      const rawPhone = user.dealerInfo?.phone || '';
      if (rawPhone) {
        const match = COUNTRY_CODES.find((c) => rawPhone.startsWith(c.code));
        if (match) {
          savedDialCode = match.code;
          savedPhone = rawPhone.slice(match.code.length);
        } else {
          savedPhone = rawPhone;
        }
      }
      setFormData((prev) => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        dialCode: savedDialCode,
        phone: savedPhone,
        company: user.dealerInfo?.companyName || '',
        address: user.dealerInfo?.businessAddress?.street || '',
        city: user.dealerInfo?.businessAddress?.city || '',
        zip: user.dealerInfo?.businessAddress?.pincode || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fullPhone = `${formData.dialCode}${formData.phone}`;

    // ✅ Correctly access item.product.name, item.product.price
    const itemsList = cartItems
      .map((item) => {
        const price = Number(item.product?.price) || 0;
        const qty = Number(item.quantity) || 1;
        return `- ${item.product?.name} (Qty: ${qty}) - ₹${(price * qty).toLocaleString()}`;
      })
      .join('%0a');

    const message = `*New Order Inquiry from Website*%0a%0a*Customer Details:*%0aName: ${formData.firstName} ${formData.lastName}%0aPhone: ${fullPhone}%0aEmail: ${formData.email}%0aCompany: ${formData.company || 'N/A'}%0aAddress: ${formData.address}, ${formData.city} - ${formData.zip}%0a%0a*Order Summary:*%0a${itemsList}%0a%0a*Total Estimated Value: ₹${cartTotal.toLocaleString()}*`;

    window.open(`https://wa.me/919714989070?text=${message}`, '_blank');
    alert("Thank you! You will be redirected to WhatsApp to send your order.");
  };

  if (!cartItems || cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: BILLING DETAILS */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-[#FF5722] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Shipping Address
              </h2>

              {user && (
                <div className="mb-4 bg-orange-50 border border-orange-200 rounded p-3 text-xs text-orange-700">
                  ✅ Details auto-filled from your profile. You can edit if needed.
                </div>
              )}

              <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full border border-gray-300 p-2 rounded focus:border-[#FF5722] outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full border border-gray-300 p-2 rounded focus:border-[#FF5722] outline-none" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (Optional)</label>
                  <input name="company" value={formData.company} onChange={handleInputChange} type="text" className="w-full border border-gray-300 p-2 rounded focus:border-[#FF5722] outline-none" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input required name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="Street address, P.O. box" className="w-full border border-gray-300 p-2 rounded focus:border-[#FF5722] outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full border border-gray-300 p-2 rounded focus:border-[#FF5722] outline-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input required name="zip" value={formData.zip} onChange={handleInputChange} type="text" className="w-full border border-gray-300 p-2 rounded focus:border-[#FF5722] outline-none" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <PhoneInput
                    dialCode={formData.dialCode}
                    number={formData.phone}
                    onDialCodeChange={(val) => setFormData((prev) => ({ ...prev, dialCode: val }))}
                    onNumberChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full border border-gray-300 p-2 rounded focus:border-[#FF5722] outline-none" />
                </div>

              </form>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => {
                  // ✅ item.product has all the product data
                  const product = item.product;
                  const imageSrc =
                    Array.isArray(product?.images) && product.images.length > 0
                      ? product.images[0]
                      : "/no-image.png";
                  const price = Number(product?.price) || 0;
                  const quantity = Number(item.quantity) || 1;

                  return (
                    <div key={item._id} className="flex items-center gap-3 text-sm">
                      <img
                        src={imageSrc}
                        alt={product?.name || "Product"}
                        className="w-14 h-14 object-contain border rounded bg-gray-50 shrink-0"
                        onError={(e) => { e.target.src = "/no-image.png"; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 line-clamp-1">{product?.name}</p>
                        <p className="text-gray-400 text-xs">Qty: {quantity}</p>
                      </div>
                      <span className="font-bold text-gray-900 shrink-0">
                        ₹{(price * quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{(cartTotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold">Free</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-[#FF5722] pt-2 border-t border-gray-100 mt-2">
                  <span>Order Total</span>
                  <span>₹{(cartTotal || 0).toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 rounded shadow-lg transition flex items-center justify-center gap-2 mb-3"
              >
                <MessageCircle size={20} />
                Send Inquiry via WhatsApp
              </button>

              <p className="text-xs text-gray-400 text-center">
                By clicking the button, you will be redirected to WhatsApp to confirm your order details with our sales team.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;