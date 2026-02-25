import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

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

// ✅ Reusable Phone Input
const PhoneInput = ({ dialCode, number, onDialCodeChange, onNumberChange }) => {
  const selected = COUNTRY_CODES.find((c) => c.code === dialCode) || COUNTRY_CODES[0];

  const handleNumber = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= selected.maxLength) {
      onNumberChange(raw);
    }
  };

  return (
    <div className="flex border-b border-gray-300 focus-within:border-[#FF5722] transition">
      <select
        value={dialCode}
        onChange={(e) => {
          onDialCodeChange(e.target.value);
          onNumberChange('');
        }}
        className="bg-transparent text-gray-600 text-sm py-2 pr-2 focus:outline-none cursor-pointer"
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code + c.country} value={c.code}>
            {c.country} {c.code}
          </option>
        ))}
      </select>

      <input
        type="tel"
        value={number}
        onChange={handleNumber}
        placeholder={`Max ${selected.maxLength} digits`}
        className="flex-1 py-2 px-2 focus:outline-none text-sm placeholder-gray-400"
      />
    </div>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    dialCode: '+91',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number is filled
    const selected = COUNTRY_CODES.find((c) => c.code === formData.dialCode) || COUNTRY_CODES[0];
    if (formData.phone.length !== selected.maxLength) {
      toast.error(`Phone number must be ${selected.maxLength} digits for ${selected.country}`);
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        phone: `${formData.dialCode}${formData.phone}`,
      };

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        payload
      );

      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form
      setFormData({
        name: '',
        email: '',
        message: '',
        dialCode: '+91',
        phone: '',
      });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <Toaster position="top-right" />

      {/* Header Banner */}
      <div className="bg-[#1a1a1a] text-white py-16 text-center border-b-4 border-[#FF5722]">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide mb-2">Contact Us</h1>
        <p className="text-gray-400 text-sm">We are here to help you with your machinery needs</p>
      </div>

      <div className="container mx-auto px-4 py-16">

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

          {/* Card 1: Sales */}
          <div className="bg-gray-50 p-8 border border-gray-200 text-center hover:shadow-xl transition group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:bg-[#FF5722] transition">
              <Phone size={24} className="text-[#FF5722] group-hover:text-white transition" />
            </div>
            <h3 className="font-bold text-xl mb-2">Sales Inquiry</h3>
            <p className="text-gray-500 mb-1">+91 97149 89070</p>
            <p className="text-gray-400 text-sm">sales@devikaindustries.com</p>
          </div>

          {/* Card 2: Factory Address */}
          <div className="bg-gray-50 p-8 border border-gray-200 text-center hover:shadow-xl transition group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:bg-[#FF5722] transition">
              <MapPin size={24} className="text-[#FF5722] group-hover:text-white transition" />
            </div>
            <h3 className="font-bold text-xl mb-2">Factory Location</h3>
            <p className="text-gray-500 text-sm px-4">
              2 - Jay Jalaram Ind. Estate, Opp. Luby Polymers, Rajkot-3, Gujarat, India.
            </p>
          </div>

          {/* Card 3: Working Hours */}
          <div className="bg-gray-50 p-8 border border-gray-200 text-center hover:shadow-xl transition group">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:bg-[#FF5722] transition">
              <Clock size={24} className="text-[#FF5722] group-hover:text-white transition" />
            </div>
            <h3 className="font-bold text-xl mb-2">Working Hours</h3>
            <p className="text-gray-500 mb-1">Mon - Sat: 9:00 AM - 8:00 PM</p>
            <p className="text-red-500 text-sm font-bold">Sunday Closed</p>
          </div>
        </div>

        {/* Map & Form Section */}
        <div className="flex flex-col lg:flex-row gap-0 shadow-2xl rounded-lg overflow-hidden border border-gray-200">

          {/* Left: Google Map */}
          <div className="lg:w-1/2 h-[400px] lg:h-auto bg-gray-300 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.273228240571!2d70.8163535746367!3d22.305504142708045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3959b6075966c0a9%3A0x715c5a8b28c93342!2sUnisoft%20Pheripherials!5e0!3m2!1sen!2sin!4v1771996034351!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Devika Industries Location"
              className="absolute inset-0  transition duration-700"
            />
          </div>

          {/* Right: Contact Form */}
          <div className="lg:w-1/2 bg-white p-10 lg:p-14">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase">Send us a Message</h2>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full border-b border-gray-300 py-2 focus:border-[#FF5722] outline-none transition"
                    placeholder="John Doe"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Phone Number</label>
                  <PhoneInput
                    dialCode={formData.dialCode}
                    number={formData.phone}
                    onDialCodeChange={(val) => handleChange('dialCode', val)}
                    onNumberChange={(val) => handleChange('phone', val)}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full border-b border-gray-300 py-2 focus:border-[#FF5722] outline-none transition"
                  placeholder="john@company.com"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Message</label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="w-full border-b border-gray-300 py-2 focus:border-[#FF5722] outline-none transition resize-none"
                  placeholder="I am interested in the Jumbo Slicer Machine..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#FF5722] text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-orange-700 transition shadow-lg w-full md:w-auto disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;