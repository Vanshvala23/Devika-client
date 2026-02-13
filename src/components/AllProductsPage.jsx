import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { Filter, X } from "lucide-react";

const AllProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory || "All");
  const [sortBy, setSortBy] = useState("default");

  const categories = [
    "All",
    "Food Processing",
    "Commercial Kitchen",
    "Grain Processing",
    "Industrial Machinery",
    "Spares",
  ];

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://devika-backend.vercel.app/api/products"
        );

        console.log("API DATA:", res.data);
        setProducts(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Update category if URL changes
  useEffect(() => {
    setSelectedCategory(initialCategory || "All");
  }, [initialCategory]);

  // FILTER + SORT PRODUCTS
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) =>
          p.category &&
          p.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Sort
    if (sortBy === "lowToHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "highToLow") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">Home / Products</p>
          <h1 className="text-3xl font-bold">Product Catalog</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR */}
          <div className="lg:w-1/4">
            <div className="bg-white p-6 border sticky top-24">
              <h3 className="font-bold mb-4 flex gap-2">
                <Filter size={18} /> Filters
              </h3>

              {categories.map((cat) => (
                <div key={cat} className="mb-2 flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => {
                      setSelectedCategory(cat);
                      cat === "All"
                        ? setSearchParams({})
                        : setSearchParams({ category: cat });
                    }}
                  />
                  <label className="ml-2">{cat}</label>
                </div>
              ))}
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="lg:w-3/4">

            {/* SORT BAR */}
            <div className="flex justify-between mb-6 bg-white p-4 border">
              <span>
                Showing <b>{filteredProducts.length}</b> products
              </span>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border p-1"
              >
                <option value="default">Relevance</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>

            {/* PRODUCTS GRID */}
            {filteredProducts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const imageSrc =
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "/no-image.png";

                  return (
                    <Link
                      to={`/product/${product._id}`}
                      key={product._id}
                    >
                      <div className="bg-white border p-4 hover:shadow-lg">
                        <div className="h-48 bg-gray-100 mb-4 flex items-center justify-center">
                          <img
                            src={imageSrc}
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                            onError={(e) => {
                              e.target.src = "/no-image.png";
                            }}
                          />
                        </div>

                        <p className="text-sm text-gray-500">{product.category}</p>
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-orange-600 font-bold">
                          ₹{product.price?.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center p-10 bg-white border">
                <X size={48} className="mx-auto mb-4" />
                <h3>No products found</h3>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
