import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Star,
  Truck,
  ShieldCheck,
  ArrowLeft,
  ShoppingCart,
  Check,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH FROM BACKEND
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://devika-backend.vercel.app/api/products/${id}`
        );

        console.log("PRODUCT:", res.data);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return <div className="p-20 text-center">Loading...</div>;

  if (!product)
    return <div className="p-20 text-center">Product not found</div>;

  // ✅ IMAGE SOURCE FIX
  const images =
    product.images?.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : ["/no-image.png"];

  return (
    <div className="bg-white min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4">

        <Link
          to="/products"
          className="inline-flex items-center text-sm text-gray-500 mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-12 gap-10">

          {/* LEFT: IMAGES */}
          <div className="lg:col-span-5">
            <div className="border mb-4 overflow-hidden">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-96 object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 cursor-pointer border ${
                    activeImage === i
                      ? "border-orange-500"
                      : "border-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* CENTER INFO */}
          <div className="lg:col-span-4">
            <h1 className="text-3xl font-bold mb-4">
              {product.name}
            </h1>

            <p className="text-2xl font-bold text-orange-600 mb-4">
              ₹{product.price?.toLocaleString()}
            </p>

            <p className="text-gray-600 mb-6">
              {product.description}
            </p>
          </div>

          {/* BUY BOX */}
          <div className="lg:col-span-3">
            <div className="border p-6 sticky top-24">

              <p className="text-2xl font-bold text-orange-600 mb-4">
                ₹{product.price?.toLocaleString()}
              </p>

              <p className="text-green-600 font-bold mb-4">
                In Stock
              </p>

              <select
                value={quantity}
                onChange={(e) =>
                  setQuantity(Number(e.target.value))
                }
                className="w-full border p-2 mb-4"
              >
                {[1,2,3,4,5].map(n => (
                  <option key={n}>{n}</option>
                ))}
              </select>

              <button onClick={() => addToCart(product._id)}>
  Add to Cart
</button>

              <button className="w-full bg-orange-500 text-white py-3">
                Buy Now
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
