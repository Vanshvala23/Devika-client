import React, { useMemo, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categoryFilter = searchParams.get("category");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get("/api/products");
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch products:", err.message);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!categoryFilter) return products;
    return products.filter((product) =>
      product.category?.toLowerCase().includes(categoryFilter.toLowerCase())
    );
  }, [products, categoryFilter]);

  const clearFilter = () => setSearchParams({});

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#FF5722] mx-auto mb-4" />
        <h2 className="text-xl font-bold">Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-red-500">{error}</h2>
        <button
          onClick={() => window.location.reload()}
          className="bg-[#FF5722] text-white px-6 py-2 mt-4"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-20 min-h-[600px]">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b pb-4 gap-4">
          <div>
            <span className="text-[#FF5722] font-bold uppercase text-sm">
              What We Do
            </span>
            <h2 className="text-3xl font-extrabold">
              {categoryFilter ? categoryFilter : "All Products"}
            </h2>
          </div>

          {categoryFilter && (
            <button
              onClick={clearFilter}
              className="flex items-center gap-1 text-red-500"
            >
              <X size={14} /> Clear Filter
            </button>
          )}
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id}>
                <div className="bg-white p-4 hover:shadow-lg transition-shadow duration-200">
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="h-60 w-full object-contain"
                    onError={(e) => { e.target.src = "/placeholder.png"; }}
                  />
                  <h3 className="font-bold mt-2">{product.name}</h3>
                  <p className="text-[#FF5722] font-bold">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Filter size={40} className="mx-auto mb-4" />
            <h3>No Products Found</h3>
            <button
              onClick={clearFilter}
              className="bg-[#FF5722] text-white px-6 py-2 mt-4"
            >
              View All
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;