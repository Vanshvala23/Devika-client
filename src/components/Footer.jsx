import React, { useState } from 'react';
import { MapPin, Phone, ChevronRight, Facebook, Linkedin, Twitter } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

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

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Our Presence', path: '/presence' },
  { name: 'About Us', path: '/#about' },
  { name: 'Testimonials', path: '/' },
  { name: 'Contact Us', path: '/#contact' },
  { name: 'Privacy Policy', path: '/' },
];

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dialCode: '+91',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === formData.dialCode) || COUNTRY_CODES[0];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= selectedCountry.maxLength) {
      handleChange('phone', raw);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.phone.length !== selectedCountry.maxLength) {
      toast.error(`Phone must be ${selectedCountry.maxLength} digits for ${selectedCountry.country}`);
      return;
    }

    if (!formData.subject) {
      toast.error("Please select a subject");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/contact`, {
        name: formData.name,
        email: formData.email,
        phone: `${formData.dialCode}${formData.phone}`,
        subject: formData.subject,
        message: formData.message,
      });

      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: '', email: '', dialCode: '+91', phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-[#111] border border-gray-700 p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5722] transition";

  return (
    <footer id="contact" className="relative bg-[#1a1a1a] text-white pt-20 pb-10 border-t-4 border-[#FF5722] overflow-hidden">
      <Toaster position="top-right" />

      {/* Background Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute -left-20 bottom-0 w-72 h-72 bg-[#FF5722] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">

          {/* COLUMN 1: Contact Details */}
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-8 relative inline-block">
              Contact Details
              <span className="absolute bottom-[-10px] left-0 w-12 h-1 bg-[#FF5722]"></span>
            </h3>
            <div className="space-y-8 text-sm text-gray-400">
              <div className="flex group">
                <MapPin size={20} className="text-[#FF5722] mt-1 shrink-0 group-hover:text-white transition" />
                <div className="ml-4">
                  <h4 className="text-white font-bold mb-1">Office Address</h4>
                  <p className="leading-relaxed">Office No. 4, 1st Floor, Shreyas Anand Complex, Opp. Parul Garden, Ranchhod Wadi Main Road, Rajkot - 360003, Gujarat</p>
                </div>
              </div>
              <div className="flex group">
                <MapPin size={20} className="text-[#FF5722] mt-1 shrink-0 group-hover:text-white transition" />
                <div className="ml-4">
                  <h4 className="text-white font-bold mb-1">Factory Address</h4>
                  <p className="leading-relaxed">2 - Jay Jalaram Ind. Estate Plot No. 12A+B1, Opp. Luby Polymers, B/H. Ruda Transport Nagar, Rajkot-3.</p>
                </div>
              </div>
              <div className="flex group">
                <Phone size={20} className="text-[#FF5722] mt-1 shrink-0 group-hover:text-white transition" />
                <div className="ml-4">
                  <h4 className="text-white font-bold mb-1">Mr. Naresh Haribhai Chauhan</h4>
                  <p className="text-lg font-bold text-white tracking-wide">+91 97149 89070</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-8 relative inline-block">
              Quick Links
              <span className="absolute bottom-[-10px] left-0 w-12 h-1 bg-[#FF5722]"></span>
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              {quickLinks.map((item, index) => (
                <li key={index} className="border-b border-gray-800 pb-2 last:border-0 group">
                  <a href={item.path} className="flex items-center hover:text-[#FF5722] hover:translate-x-2 transition-all duration-300 cursor-pointer">
                    <ChevronRight size={14} className="mr-3 text-gray-600 group-hover:text-[#FF5722]" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Contact Form */}
          <div className="bg-white/5 p-6 rounded-sm border border-white/10">
            <h3 className="text-xl font-bold uppercase tracking-wider mb-6 text-white">
              Drop a Line
            </h3>

            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* Name */}
              <input
                type="text"
                required
                placeholder="NAME"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={inputClass}
              />

              {/* Email */}
              <input
                type="email"
                required
                placeholder="EMAIL"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={inputClass}
              />

              {/* ✅ Phone with country code — fixed colors */}
              <div className="flex border border-gray-700 focus-within:border-[#FF5722] transition overflow-hidden">
                <select
                  value={formData.dialCode}
                  onChange={(e) => {
                    handleChange('dialCode', e.target.value);
                    handleChange('phone', '');
                  }}
                  className="bg-[#111] text-gray-300 text-xs px-2 py-3 focus:outline-none cursor-pointer border-r border-gray-700 shrink-0"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option
                      key={c.code + c.country}
                      value={c.code}
                      className="bg-[#1a1a1a] text-white"
                    >
                      {c.country} {c.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder={`Phone (max ${selectedCountry.maxLength} digits)`}
                  className="flex-1 bg-[#111] p-3 text-sm text-white placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* ✅ Subject — fixed colors */}
              <div className="relative">
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  className="w-full bg-[#111] border border-gray-700 p-3 text-sm text-gray-300 focus:outline-none focus:border-[#FF5722] transition appearance-none cursor-pointer"
                >
                  <option value="" disabled className="bg-[#1a1a1a] text-gray-500">Select Subject</option>
                  <option value="Machine Inquiry" className="bg-[#1a1a1a] text-white">Machine Inquiry</option>
                  <option value="Support" className="bg-[#1a1a1a] text-white">Support</option>
                  <option value="Partnership" className="bg-[#1a1a1a] text-white">Partnership</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                  <ChevronRight size={14} className="rotate-90" />
                </div>
              </div>

              {/* Message */}
              <textarea
                required
                placeholder="MESSAGE"
                rows="3"
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                className={inputClass}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF5722] hover:bg-orange-700 text-white font-bold py-3 uppercase text-xs tracking-widest transition shadow-lg disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>

        {/* BOTTOM STRIP */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <div className="flex space-x-3 mb-4 md:mb-0">
            <a href="https://www.facebook.com/DevikaIndustriesInc.India" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center border border-gray-700 hover:bg-[#FF5722] hover:text-white hover:border-[#FF5722] transition rounded-sm">
              <Facebook size={14} />
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center border border-gray-700 hover:bg-[#FF5722] hover:text-white hover:border-[#FF5722] transition rounded-sm">
              <Linkedin size={14} />
            </a>
            <a href="#" className="w-8 h-8 flex items-center justify-center border border-gray-700 hover:bg-[#FF5722] hover:text-white hover:border-[#FF5722] transition rounded-sm">
              <Twitter size={14} />
            </a>
          </div>
          <div className="text-center md:text-right">
            <p className="mb-1 text-[#FF5722] font-medium italic">"A Beautiful Way To Grow Business"</p>
            <p>Copyrights 2026. <span className="text-white hover:text-[#FF5722] cursor-pointer transition">Devika Industries Inc.</span> All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;