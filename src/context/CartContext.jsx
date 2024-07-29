import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
const LOCAL_STORAGE_KEY = 'cartItems';
const TAX_RATE = 0.18; // 18% tax rate

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedItems ? JSON.parse(storedItems) : [];
  });

  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [isShippingSubmitted, setIsShippingSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartItems));

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setCartSubtotal(subtotal);

    // Calculate total including tax
    const total = subtotal + (subtotal * TAX_RATE);
    setCartTotal(total);
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.id === product.id &&
          item.color === product.color &&
          item.size === product.size
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + product.quantity,
        };
        return updatedItems;
      } else {
        return [...prevItems, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (id, color, size) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.id === id && item.color === color && item.size === size)
      )
    );
  };

  const updateQuantity = (id, color, size, quantity) => {
    return new Promise((resolve) => {
      setCartItems((prevItems) => {
        const newItems = prevItems.map((item) =>
          item.id === id && item.color === color && item.size === size
            ? { ...item, quantity: quantity }
            : item
        );
        resolve(newItems);
        return newItems;
      });
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartSubtotal,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        isShippingSubmitted,
        setIsShippingSubmitted
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);