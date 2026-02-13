import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const sessionId =
    localStorage.getItem("sessionId") ||
    crypto.randomUUID();

  localStorage.setItem("sessionId", sessionId);

  /* LOAD CART */
  const fetchCart = async () => {
    try {
      const res = await api.get(`/cart/${sessionId}`);
      setCartItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ADD */
  const addToCart = async (productId, qty = 1) => {
    await api.post("/cart/add", {
      sessionId,
      productId,
      quantity: qty,
    });
    fetchCart();
  };

  /* REMOVE */
  const removeFromCart = async (cartItemId) => {
    await api.delete(`/cart/item/${cartItemId}`);
    fetchCart();
  };

  /* UPDATE QTY */
  const updateQuantity = async (cartItemId, qty) => {
    if (qty < 1) return;

    const item = cartItems.find(i => i._id === cartItemId);

    await api.post("/cart/add", {
      sessionId,
      productId: item.product._id,
      quantity: qty - item.quantity,
    });

    fetchCart();
  };

  /* TOTALS */
  const cartTotal = cartItems.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (sum, i) => sum + i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
