import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BreadcrumbWithCustomSeparator } from "./partials/CartBreadCrumb";
import { Loader2, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import EmptyCartAnimation from "./partials/EmptyCartAnimation";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const cartItem = location.state?.cartItems || [];
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);

  const mergedCartItems = useMemo(() => {
    return cartItems.map((item) => {
      const locationItem = cartItem.find(
        (locItem) =>
          locItem.id === item.id &&
          locItem.color === item.color &&
          locItem.size === item.size
      );
      return locationItem ? { ...item, ...locationItem } : item;
    });
  }, [cartItems, cartItem]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const newSubtotal = mergedCartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    setSubtotal(newSubtotal);
  }, [mergedCartItems]);

  const QuantityControl = ({ quantity, onIncrease, onDecrease }) => (
    <div className="flex items-center space-x-3">
      <button
        onClick={onDecrease}
        className={`p-2 rounded-lg ${
          quantity === 1 ? "bg-gray-300" : "bg-[#926a54]"
        } ${
          quantity === 1 ? "cursor-not-allowed" : "cursor-pointer"
        } outline-none border-none`}
        disabled={quantity === 1}
      >
        <Minus size={16} color="white" />
      </button>
      <span className="text-lg font-semibold">{quantity}</span>
      <button
        onClick={onIncrease}
        className="p-2 rounded-lg bg-[#926a54] outline-none border-none"
      >
        <Plus size={16} color="white" />
      </button>
    </div>
  );

  const handleIncrease = (id, color, size) => {
    const item = mergedCartItems.find(
      (item) => item.id === id && item.color === color && item.size === size
    );
    if (item) {
      updateQuantity(id, color, size, item.quantity + 1);
      updateLocationState(id, color, size, item.quantity + 1);
    }
  };

  const handleDecrease = (id, color, size) => {
    const item = mergedCartItems.find(
      (item) => item.id === id && item.color === color && item.size === size
    );
    if (item && item.quantity > 1) {
      updateQuantity(id, color, size, item.quantity - 1);
      updateLocationState(id, color, size, item.quantity - 1);
    }
  };

  const updateLocationState = (id, color, size, newQuantity) => {
    const updatedCartItems = mergedCartItems.map((item) =>
      item.id === id && item.color === color && item.size === size
        ? { ...item, quantity: newQuantity }
        : item
    );
    navigate(location.pathname, {
      state: { ...location.state, cartItems: updatedCartItems },
      replace: true,
    });
  };

  const handleRemove = (id, color, size) => {
    removeFromCart(id, color, size);
    const updatedCartItems = mergedCartItems.filter(
      (item) => !(item.id === id && item.color === color && item.size === size)
    );
    navigate(location.pathname, {
      state: { ...location.state, cartItems: updatedCartItems },
      replace: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#926a54]" />
      </div>
    );
  }

  if (mergedCartItems.length === 0) {
    return <EmptyCartAnimation />;
  }

  const formatIndianPrice = (price) => {
    const priceString = price.toFixed(2);
    const [wholePart, decimalPart] = priceString.split(".");
    const lastThree = wholePart.substring(wholePart.length - 3);
    const otherNumbers = wholePart.substring(0, wholePart.length - 3);
    const formattedWholePart =
      otherNumbers !== ""
        ? otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + lastThree
        : lastThree;
    return `₹${formattedWholePart}.${decimalPart}`;
  };

  return (
    <>
      <div className="px-4 py-3 mt-[53px] md:mt-[72px] lg:mt-[52px]">
        <BreadcrumbWithCustomSeparator />
        <div className="cart-continue-shopping mt-4 flex justify-between items-center">
          <h1 className="Asul text-[20px] text-[#100b09] capitalize leading-[26px]">
            Shopping Cart
          </h1>
          <h1 className="Fira text-[13px] leading-[20px] border-b-[1px] border-[#000]">
            Continue shopping
          </h1>
        </div>
        <h1 className="Fira text-[16px] mt-5 leading-[19px] tracking-wider">
          Products
        </h1>
        <div className="flex-grow overflow-y-auto pb-40 mt-4">
          {mergedCartItems.map((item) => (
            <div
              key={`${item.id}-${item.color}-${item.size}`}
              className="flex items-center gap-4 py-4 border-t"
            >
              <div className="image w-[100px] lg:w-[105px] lg:h-[130px] overflow-hidden h-[140px]">
                <img
                  className="w-full h-full rounded-2xl object-cover"
                  src={
                    item.image.url ||
                    item.image.imageSrc ||
                    "https://placehold.co/300"
                  }
                  alt={item.name}
                  onError={(e) => {
                    console.error(
                      `Failed to load image for ${item.name}:`,
                      item.image
                    );
                  }}
                />
              </div>
              <div className="ProductDetails flex-1">
                <h1 className="Asul text-[16px] text-[#100b09] capitalize leading-[20px] productName">
                  {item.name}
                </h1>
                <h1 className="Fira font-medium text-[14px] leading-[20px] mt-1 text-[#0009] productColor">
                  Color:{" "}
                  <span className="text-[#000] font-medium">{item.color}</span>
                </h1>
                <h1 className="Fira font-medium text-[14px] leading-[20px] mt-1 text-[#0009] productSize">
                  Size:{" "}
                  <span className="text-[#000] font-medium">{item.size}</span>
                </h1>
                <h1 className="Fira productPrice text-[14px] leading-[20px] font-bold mt-2">
                  {formatIndianPrice(item.price * item.quantity)}
                </h1>
                <div className="edit-remove flex my-2 ml-1 gap-3">
                  <button
                    onClick={() => handleRemove(item.id, item.color, item.size)}
                    className="Fira text-[13px] text-[#928e8e] leading-[20px] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <div className="mobile-quantity mt-2 md:hidden">
                  <QuantityControl
                    quantity={item.quantity}
                    onIncrease={() =>
                      handleIncrease(item.id, item.color, item.size)
                    }
                    onDecrease={() =>
                      handleDecrease(item.id, item.color, item.size)
                    }
                  />
                </div>
              </div>
              <div className="quantity hidden md:block">
                <QuantityControl
                  quantity={item.quantity}
                  onIncrease={() =>
                    handleIncrease(item.id, item.color, item.size)
                  }
                  onDecrease={() =>
                    handleDecrease(item.id, item.color, item.size)
                  }
                />
              </div>
            </div>
          ))}
        </div>
        <div className="subtotal-card fixed bottom-0 left-0 bg-[#f2f2f2] w-full px-4 py-5">
          <div className="flex justify-between items-center">
            <h1 className="Fira text-[16px] leading-[16px]">
              Subtotal ({mergedCartItems.length})
            </h1>
            <h1 className="Fira text-[16px] leading-[16px] font-semibold">
              {formatIndianPrice(subtotal)}
            </h1>
          </div>
          <h1 className="Fira text-[13px] leading-[24px] text-center mt-5">
            Taxes and shipping calculated at checkout
          </h1>
          <button className="w-full bg-[#926a54] text-white py-3 mt-5 rounded-md hover:bg-[#7d5a47] transition-colors duration-300">
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
