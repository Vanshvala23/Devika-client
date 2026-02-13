import React, { useMemo, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryFilter = searchParams.get("category");

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://devika-backend.vercel.app/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // FILTER PRODUCTS
  const filteredProducts = useMemo(() => {
    if (!categoryFilter) return products;
    return products.filter((product) =>
      product.category
        ?.toLowerCase()
        .includes(categoryFilter.toLowerCase())
    );
  }, [products, categoryFilter]);

  const clearFilter = () => {
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Loading products...</h2>
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
              <Link
                to={`/product/${product._id}`}
                key={product._id}
              >
                <div className="bg-white p-4 hover:shadow-lg">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-60 w-full object-contain"
                  />

                  <h3 className="font-bold mt-2">
                    {product.name}
                  </h3>

                  <p className="text-[#FF5722] font-bold">
                    ₹{product.price}
                  </p>

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
