import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { SlidersHorizontal, X, ChevronRight, Package } from "lucide-react";

const CATEGORIES = [
  "All",
  "Food Processing",
  "Commercial Kitchen",
  "Grain Processing",
  "Industrial Machinery",
  "Spares",
];

const AllProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");
  const [sortBy, setSortBy] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`);
        setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedCategory(initialCategory || "All");
  }, [initialCategory]);

  const handleCategory = (cat) => {
    setSelectedCategory(cat);
    cat === "All" ? setSearchParams({}) : setSearchParams({ category: cat });
    setSidebarOpen(false);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    if (sortBy === "lowToHigh") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "highToLow") result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex gap-1 mb-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-[#FF5722]"
                style={{ animation: `bounce 0.8s ease-in-out ${i * 0.15}s infinite alternate` }}
              />
            ))}
          </div>
          <p className="text-gray-500 font-medium tracking-widest uppercase text-sm">Loading Products</p>
        </div>
        <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-10px); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans">

      {/* ── PAGE HEADER ── */}
      <div className="bg-[#1a1a1a] text-white py-14 border-b-4 border-[#FF5722]">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <Link to="/" className="hover:text-[#FF5722] transition">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">Products</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide">
            Product Catalog
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            {filteredProducts.length} products
            {selectedCategory !== "All" && (
              <span className="ml-2 text-[#FF5722] font-semibold">in {selectedCategory}</span>
            )}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── MOBILE FILTER TOGGLE ── */}
          <div className="lg:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 text-sm font-semibold shadow-sm hover:border-[#FF5722] transition"
            >
              <SlidersHorizontal size={16} className="text-[#FF5722]" />
              {sidebarOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* ── SIDEBAR ── */}
          <div className={`lg:w-1/4 ${sidebarOpen ? "block" : "hidden"} lg:block`}>
            <div className="bg-white border border-gray-200 sticky top-24 overflow-hidden">

              {/* Sidebar Header */}
              <div className="bg-[#1a1a1a] px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-[#FF5722]" />
                  <span className="text-white font-bold text-sm uppercase tracking-widest">Filters</span>
                </div>
                {selectedCategory !== "All" && (
                  <button
                    onClick={() => handleCategory("All")}
                    className="text-xs text-gray-400 hover:text-[#FF5722] flex items-center gap-1 transition"
                  >
                    <X size={12} /> Clear
                  </button>
                )}
              </div>

              {/* Category Label */}
              <div className="px-6 pt-5 pb-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Category</p>
              </div>

              {/* Category List */}
              <ul className="pb-4">
                {CATEGORIES.map((cat) => {
                  const count = cat === "All"
                    ? products.length
                    : products.filter((p) =>
                        p.category?.toLowerCase().includes(cat.toLowerCase())
                      ).length;

                  const isActive = selectedCategory === cat;

                  return (
                    <li key={cat}>
                      <button
                        onClick={() => handleCategory(cat)}
                        className={`w-full flex items-center justify-between px-6 py-3 text-sm transition group ${
                          isActive
                            ? "bg-[#FF5722] text-white font-semibold"
                            : "text-gray-600 hover:bg-orange-50 hover:text-[#FF5722]"
                        }`}
                      >
                        <span>{cat}</span>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            isActive
                              ? "bg-white text-[#FF5722]"
                              : "bg-gray-100 text-gray-400 group-hover:bg-orange-100 group-hover:text-[#FF5722]"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="lg:w-3/4">

            {/* Sort Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border border-gray-200 px-6 py-4 mb-6">
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-bold text-gray-900">{filteredProducts.length}</span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
                {selectedCategory !== "All" && (
                  <span className="ml-1">
                    in <span className="text-[#FF5722] font-semibold">{selectedCategory}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-200 text-sm px-3 py-1.5 focus:outline-none focus:border-[#FF5722] transition bg-white"
                >
                  <option value="default">Relevance</option>
                  <option value="lowToHigh">Price: Low → High</option>
                  <option value="highToLow">Price: High → Low</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product, i) => {
                  const imageSrc =
                    product.images?.length > 0 ? product.images[0] : "/no-image.png";

                  return (
                    <Link
                      to={`/product/${product._id}`}
                      key={product._id}
                      style={{ animationDelay: `${i * 40}ms` }}
                      className="group bg-white border border-gray-200 hover:border-[#FF5722] hover:shadow-xl transition-all duration-300 overflow-hidden block"
                    >
                      {/* Image */}
                      <div className="relative h-52 bg-gray-50 overflow-hidden flex items-center justify-center">
                        <img
                          src={imageSrc}
                          alt={product.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = "/no-image.png"; }}
                        />
                        {/* Category Badge */}
                        <span className="absolute top-3 left-3 bg-[#1a1a1a] text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                          {product.category}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="p-4 border-t border-gray-100">
                        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-[#FF5722] transition line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-[#FF5722] font-extrabold text-lg">
                            ₹{product.price?.toLocaleString()}
                          </p>
                          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest group-hover:text-[#FF5722] transition flex items-center gap-1">
                            View <ChevronRight size={10} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 py-20 text-center">
                <Package size={48} className="mx-auto mb-4 text-gray-200" />
                <h3 className="font-bold text-gray-700 mb-1">No products found</h3>
                <p className="text-gray-400 text-sm mb-6">
                  No results for <span className="text-[#FF5722] font-semibold">"{selectedCategory}"</span>
                </p>
                <button
                  onClick={() => handleCategory("All")}
                  className="bg-[#FF5722] text-white px-6 py-2 text-sm font-bold uppercase tracking-widest hover:bg-orange-700 transition"
                >
                  View All Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;