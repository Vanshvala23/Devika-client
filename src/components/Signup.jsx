import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight, Building2, Hash, Briefcase, Phone, MapPin } from 'lucide-react';
import image from "../assets/logo.jpeg";
import axios from "axios";

// ✅ Country codes with max digit lengths
const COUNTRY_CODES = [
  { code: "+91", country: "IN", maxLength: 10 },
  { code: "+1",  country: "US", maxLength: 10 },
  { code: "+44", country: "UK", maxLength: 10 },
  { code: "+61", country: "AU", maxLength: 9  },
  { code: "+971",country: "UAE",maxLength: 9  },
  { code: "+966",country: "SA", maxLength: 9  },
  { code: "+65", country: "SG", maxLength: 8  },
  { code: "+60", country: "MY", maxLength: 9  },
  { code: "+92", country: "PK", maxLength: 10 },
  { code: "+880",country: "BD", maxLength: 10 },
  { code: "+86", country: "CN", maxLength: 11 },
  { code: "+81", country: "JP", maxLength: 10 },
  { code: "+49", country: "DE", maxLength: 11 },
  { code: "+33", country: "FR", maxLength: 9  },
  { code: "+39", country: "IT", maxLength: 10 },
  { code: "+7",  country: "RU", maxLength: 10 },
  { code: "+55", country: "BR", maxLength: 11 },
  { code: "+27", country: "ZA", maxLength: 9  },
  { code: "+234",country: "NG", maxLength: 10 },
  { code: "+20", country: "EG", maxLength: 10 },
];

// ✅ Reusable Phone Input Component
const PhoneInput = ({ value, dialCode, onDialCodeChange, onNumberChange, required }) => {
  const selected = COUNTRY_CODES.find((c) => c.code === dialCode) || COUNTRY_CODES[0];

  const handleNumber = (e) => {
    const raw = e.target.value.replace(/\D/g, ''); // digits only
    if (raw.length <= selected.maxLength) {
      onNumberChange(raw);
    }
  };

  return (
    <div className="flex rounded-md border border-gray-300 overflow-hidden focus-within:ring-1 focus-within:ring-[#FF5722] focus-within:border-[#FF5722]">
      {/* Country Code Dropdown */}
      <select
        value={dialCode}
        onChange={(e) => {
          onDialCodeChange(e.target.value);
          onNumberChange(''); // reset number when code changes
        }}
        className="bg-gray-50 border-r border-gray-300 text-gray-700 text-sm px-2 py-3 focus:outline-none cursor-pointer"
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code + c.country} value={c.code}>
            {c.country} {c.code}
          </option>
        ))}
      </select>

      {/* Number Input */}
      <input
        type="tel"
        required={required}
        value={value}
        onChange={handleNumber}
        placeholder={`Max ${selected.maxLength} digits`}
        className="flex-1 px-4 py-3 text-sm placeholder-gray-400 focus:outline-none"
      />
    </div>
  );
};

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    dealerInfo: {
      companyName: '',
      gstNumber: '',
      businessType: '',
      phone: '',
      dialCode: '+91',
      businessAddress: {
        street: '',
        city: '',
        state: '',
        pincode: '',
      },
    },
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDealerChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      dealerInfo: { ...prev.dealerInfo, [field]: value },
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      dealerInfo: {
        ...prev.dealerInfo,
        businessAddress: { ...prev.dealerInfo.businessAddress, [field]: value },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine dial code + number before sending
      const fullPhone = `${formData.dealerInfo.dialCode}${formData.dealerInfo.phone}`;

      const payload =
        formData.role === 'dealer'
          ? {
              ...formData,
              dealerInfo: {
                ...formData.dealerInfo,
                phone: fullPhone,
              },
            }
          : {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              role: formData.role,
            };

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        payload,
        { withCredentials: true }
      );

      if (formData.role === 'dealer') {
        alert("Dealer account created! Please wait for admin verification before logging in.");
        navigate("/login");
      } else {
        login(data);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const isDealer = formData.role === 'dealer';

  const inputClass = "appearance-none rounded-md block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-[#FF5722] focus:border-[#FF5722] sm:text-sm";
  const inputClassNoIcon = "appearance-none rounded-md block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-[#FF5722] focus:border-[#FF5722] sm:text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">

        {/* Header */}
        <div className="text-center">
          <img className="mx-auto h-12 w-auto" src={image} alt="Devika Industries" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create Account</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleChange('role', 'customer')}
                  className={`py-2 rounded-md border text-sm font-medium transition ${
                    formData.role === 'customer'
                      ? 'bg-[#FF5722] text-white border-[#FF5722]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#FF5722]'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('role', 'dealer')}
                  className={`py-2 rounded-md border text-sm font-medium transition ${
                    formData.role === 'dealer'
                      ? 'bg-[#FF5722] text-white border-[#FF5722]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#FF5722]'
                  }`}
                >
                  Dealer
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                required
                className={inputClass}
                placeholder="Full Name"
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                required
                className={inputClass}
                placeholder="Email address"
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                required
                className={inputClass}
                placeholder="Password"
                onChange={(e) => handleChange('password', e.target.value)}
              />
            </div>

            {/* ✅ DEALER FIELDS */}
            {isDealer && (
              <div className="space-y-4 border-t pt-4 mt-2">
                <p className="text-sm font-semibold text-gray-700">Dealer Information</p>

                {/* Company Name */}
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    required={isDealer}
                    className={inputClass}
                    placeholder="Company Name"
                    onChange={(e) => handleDealerChange('companyName', e.target.value)}
                  />
                </div>

                {/* GST Number */}
                <div className="relative">
                  <Hash className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    required={isDealer}
                    className={inputClass}
                    placeholder="GST Number (e.g. 22AAAAA0000A1Z5)"
                    onChange={(e) => handleDealerChange('gstNumber', e.target.value.toUpperCase())}
                  />
                </div>

                {/* Business Type */}
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-gray-400" size={20} />
                  <select
                    required={isDealer}
                    className="appearance-none rounded-md block w-full px-10 py-3 border border-gray-300 text-gray-500 focus:outline-none focus:ring-[#FF5722] focus:border-[#FF5722] sm:text-sm"
                    onChange={(e) => handleDealerChange('businessType', e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Select Business Type</option>
                    <option value="wholesaler">Wholesaler</option>
                    <option value="retailer">Retailer</option>
                    <option value="distributor">Distributor</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* ✅ Business Phone with Country Code */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Business Phone
                  </label>
                  <PhoneInput
                    required={isDealer}
                    dialCode={formData.dealerInfo.dialCode}
                    value={formData.dealerInfo.phone}
                    onDialCodeChange={(val) => handleDealerChange('dialCode', val)}
                    onNumberChange={(val) => handleDealerChange('phone', val)}
                  />
                </div>

                {/* Business Address */}
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Business Address
                </p>

                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Street Address"
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    className={inputClassNoIcon}
                    placeholder="City"
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                  />
                  <input
                    type="text"
                    className={inputClassNoIcon}
                    placeholder="State"
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                  />
                </div>

                <input
                  type="text"
                  className={inputClassNoIcon}
                  placeholder="Pincode"
                  onChange={(e) => handleAddressChange('pincode', e.target.value)}
                />

                {/* Info Banner */}
                <div className="bg-orange-50 border border-orange-200 rounded-md p-3 text-xs text-orange-700">
                  ⚠️ Dealer accounts require admin verification before you can log in.
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF5722] hover:bg-orange-700 transition duration-150 ease-in-out disabled:opacity-60"
          >
            {loading ? 'Creating...' : isDealer ? 'Submit Dealer Application' : 'Create Account'}
            <ArrowRight className="ml-2 absolute right-4" size={18} />
          </button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#FF5722] hover:text-orange-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;