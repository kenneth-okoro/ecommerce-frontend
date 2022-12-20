import React, { createContext, useContext, useState } from "react";

const ShopContext = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [qty, setQty] = useState(1);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Increase product Qty function
  const increaseQty = () => {
    setQty((prevState) => prevState + 1);
  };

  // Decrease product Qty function
  const decreaseQty = () => {
    setQty((prevState) => {
      if (prevState - 1 < 1) return 1;
      return prevState - 1;
    });
  };

  // Add Product to Cart
  const onAdd = (product, quantity) => {
    // Total Price
    setTotalPrice((prevTotal) => prevTotal + product.price * quantity);

    // Increase total quantity
    setTotalQuantities((prevTotal) => prevTotal + quantity);

    // Check if there's existing product
    const exist = cartItems.find((item) => item.slug === product.slug);
    if (exist) {
      setCartItems(
        cartItems.map((item) =>
          item.slug === product.slug
            ? { ...exist, quantity: exist.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: quantity }]);
    }
  };

  // Remove product from cart
  const onRemove = (product) => {
    // Total Price
    setTotalPrice((prevTotal) => prevTotal - product.price);

    // Decrease total quantity
    setTotalQuantities((prevTotal) => prevTotal - 1);

    // Check if there's existing product
    const exist = cartItems.find((item) => item.slug === product.slug);
    if (exist.quantity === 1) {
      setCartItems(cartItems.filter((item) => item.slug !== product.slug));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.slug === product.slug
            ? { ...exist, quantity: exist.quantity - 1 }
            : item
        )
      );
    }
  };

  return (
    <ShopContext.Provider
      value={{
        qty,
        increaseQty,
        decreaseQty,
        showCart,
        setShowCart,
        cartItems,
        setCartItems,
        onAdd,
        onRemove,
        totalQuantities,
        totalPrice,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useStateContext = () => useContext(ShopContext);
