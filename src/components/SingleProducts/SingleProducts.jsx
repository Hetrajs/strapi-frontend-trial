import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { BreadcrumbWithCustomSeparator } from "./partials/BreadCrumb";
import ProductCarousel from "./partials/ProductCarousel";
import { Loader2, Minus, Plus } from "lucide-react";
import YouMayAlsoLike from "./partials/YouMayAlsoLike";
import Footer from "../Footer/Footer";
import { useCart } from "@/context/CartContext";

const QuantityControl = React.memo(({ quantity, onIncrease, onDecrease }) => (
  <div className="flex items-center space-x-5">
    <button
      onClick={onDecrease}
      className={`p-3.5 rounded-lg ${
        quantity === 1 ? "bg-gray-300" : "bg-[#926a54]"
      } ${
        quantity === 1 ? "cursor-not-allowed" : "cursor-pointer"
      } outline-none border-none`}
      disabled={quantity === 1}
    >
      <Minus size={16} color="white" />
    </button>
    <span className="text-md font-semibold">{quantity}</span>
    <button
      onClick={onIncrease}
      className="p-3.5 rounded-lg bg-[#926a54] outline-none border-none"
    >
      <Plus size={16} color="white" />
    </button>
  </div>
));

const ColorSelector = React.memo(
  ({ colors, selectedColor, setSelectedColor }) => (
    <div className="color mt-6">
      <h1 className="Fira font-normal text-[14px] leading-[25px]">
        Color:{" "}
        <span className="Fira font-medium text-[14px] leading-[25px]">
          {selectedColor}
        </span>
      </h1>
      <div className="flex space-x-2 mt-2">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-8 h-8 rounded-full relative focus:outline-none`}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select ${color} color`}
          >
            <span
              className={`absolute inset-0 rounded-full ${
                color === selectedColor
                  ? "ring-1 ring-offset-2 ring-gray-400"
                  : ""
              }`}
            ></span>
            <span
              className="absolute inset-1 rounded-full"
              style={{ backgroundColor: color }}
            ></span>
          </button>
        ))}
      </div>
    </div>
  )
);

const SingleProducts = ({ newArrivals, featuredProducts }) => {
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.state) {
      if (location.state.product) {
        setTimeout(() => {
          setProduct(location.state.product);
          if (location.state.product.colorVariants) {
            setSelectedColor(location.state.product.colorVariants[0].color);
            setSelectedVariant(location.state.product.colorVariants[0]);
          }
          setIsLoading(false);
        }, 2000);
      }
    } else {
      console.log("No location state found");
      setIsLoading(false);
    }
  }, [location]);

  const handleIncrease = useCallback(() => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  }, []);

  const handleDecrease = useCallback(() => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1));
  }, []);

  useEffect(() => {
    if (product && product.colorVariants) {
      const newVariant = product.colorVariants.find(
        (v) => v.color === selectedColor
      );
      if (newVariant) {
        setSelectedVariant(newVariant);
      }
    }
  }, [selectedColor, product]);

  const calculateDiscount = useCallback((price, originalPrice) => {
    if (price && originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  }, []);

  const calculateDiscountO = useCallback((price, OriginalPrice) => {
    if (price && OriginalPrice && OriginalPrice > price) {
      return Math.round(((OriginalPrice - price) / OriginalPrice) * 100);
    }
    return 0;
  }, []);

  const handleAddToCart = () => {
    if (product && selectedVariant) {
      setIsAddingToCart(true);
      setTimeout(() => {
        const cartItem = {
          id: product.id,
          name: product.name,
          color: selectedColor,
          size: selectedVariant.size,
          price: selectedVariant.price,
          originalPrice:
            selectedVariant.originalPrice || selectedVariant.OriginalPrice,
          quantity: quantity,
          image: selectedVariant.images[0],
          Image: selectedVariant.images[0],
        };
        addToCart(cartItem);
        setIsAddingToCart(false);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }, 2000);
    }
  };

  const discount = calculateDiscount(
    selectedVariant?.price,
    selectedVariant?.originalPrice
  );

  const discountO = calculateDiscountO(
    selectedVariant?.price,
    selectedVariant?.OriginalPrice
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#926a54]" />
      </div>
    );
  }


  return (
    <>
      <div className="mt-[53px] py-3 md:py-6 px-4 lg:px-8 md:mt-[72px] lg:mt-[52px]">
        <BreadcrumbWithCustomSeparator />
        <div className="productDetails flex w-full md:gap-10 md:items-center flex-col md:flex-row mt-4 md:mt-7">
          <div className="images w-full h-auto mx-auto flex justify-center items-center md:w-1/2">
            {selectedVariant && (
              <ProductCarousel images={selectedVariant?.images} />
            )}
          </div>
          <div className="ProductContent mt-10 md:mt-0 md:w-1/2 w-full">
            <h1 className="Asul ProductName text-[18px] capitalize leading-[23px] lg:text-[32px] lg:leading-[42px]">
              {product?.name}
            </h1>
            <div className="Price-offer mt-4 flex items-center justify-between">
              <div className="price flex gap-3 items-center">
                <h1 className="Fira font-bold text-[18px] leading-[23px] lg:text-[26px] lg:leading-[34px]">
                  ₹{selectedVariant?.price || product?.price}.00
                </h1>
                <h1 className="Fira font-semibold text-[14px] line-through text-[#0009] leading-[18px] lg:text-[20px] lg:leading-[26px]">
                  ₹{selectedVariant?.originalPrice ||
                    selectedVariant?.OriginalPrice}.00
                </h1>
              </div>
              <div className="offer">
                <h1 className="Fira font-medium text-[14px] leading-[18px] text-green-500 lg:text-[17px] lg:leading-[24px]">
                  {discount || discountO}% off
                </h1>
              </div>
            </div>
            <div className="stocks mt-4 flex gap-3 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 100 100"
              >
                <circle cx="50" cy="50" r="48" fill="rgba(75,220,100,0.25)" />
                <circle
                  cx="50"
                  cy="50"
                  r="35"
                  stroke="white"
                  strokeWidth="4"
                  fill="rgb(75,220,100)"
                />
              </svg>
              <h1 className="Fira font-normal text-[16px] leading-[21px]">
                {(product?.colorVariants &&
                  product.colorVariants.find((v) => v.color === selectedColor)
                    ?.stocks) ||
                  "N/A"}{" "}
                In stock
              </h1>
            </div>
            <hr className="my-4" />
            <div className="description">
              <p className="Fira font-normal text-[16px] leading-[29px] text-[#000000b3]">
                {product?.description}
              </p>
            </div>
            {product?.colorVariants && (
              <ColorSelector
                colors={product.colorVariants.map((v) => v.color)}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />
            )}
            <hr className="my-6" />
            <div className="quantity-add_to_cart">
              <div className="q-add flex gap-3 justify-between items-center">
                <QuantityControl
                  quantity={quantity}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                />
                <button
                  onClick={handleAddToCart}
                  className={`w-full ${
                    isAdded
                      ? "bg-green-500"
                      : isAddingToCart
                      ? "bg-[#926a54] opacity-75"
                      : "bg-[#926a54]"
                  } text-white py-2.5 rounded-md hover:bg-[#7d5a47] transition-colors duration-300 flex justify-center items-center`}
                  disabled={isAdded || isAddingToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                    </>
                  ) : isAdded ? (
                    "Added to Cart"
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              </div>
              <button className="w-full bg-[#926a54] mt-4 text-white py-2.5 rounded-md hover:bg-[#7d5a47] transition-colors duration-300">
                Buy it now
              </button>
            </div>
          </div>
        </div>
        <YouMayAlsoLike
          newArrivals={newArrivals}
          featuredProducts={featuredProducts}
        />
      </div>
      <Footer />
    </>
  );
};

export default SingleProducts;