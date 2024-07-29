import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const ProductCard = ({ product, onProductClick }) => {
  const [selectedColor, setSelectedColor] = useState(
    product.colorVariants[0].color
  );
  const [hoveredColor, setHoveredColor] = useState(null);

  const getCurrentImageSrc = () => {
    const currentColor = hoveredColor || selectedColor;
    const imageObj = product.colorVariants.find((v) => v.color === currentColor)
      ?.images[0];
    return imageObj
      ? imageObj.url
      : product.colorVariants[0].images[0]?.url || "";
  };

  const calculateDiscount = (price, originalPrice) => {
    if (price && originalPrice && originalPrice > price) {
      return Math.round(((originalPrice - price) / originalPrice) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount(
    product.colorVariants[0].price,
    product.colorVariants[0].originalPrice
  );

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
    <div className="w-full lg:w-1/4 p-2 flex-shrink-0 snap-start">
      <div className="bg-neutral-100 rounded-2xl overflow-hidden shadow-sm h-full">
        <div
          onClick={() => onProductClick(product)}
          style={{ cursor: "pointer" }}
        >
          <div className="relative">
            <img
              src={getCurrentImageSrc()}
              alt={product.name}
              className="w-full h-96 sm:h-56 md:h-96 object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                {discount}% off
              </div>
            )}
            <button className="absolute bottom-2 right-2 bg-[#926a54] p-1 rounded-md">
              <ChevronRight size={20} color="white" />
            </button>
          </div>
          <div className="p-4">
            <div className="flex space-x-2 mb-2">
              {product.colorVariants.map((variant, index) => (
                <button
                  key={index}
                  className={`w-6 h-6 rounded-full relative focus:outline-none`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(variant.color);
                  }}
                  onMouseEnter={() => setHoveredColor(variant.color)}
                  onMouseLeave={() => setHoveredColor(null)}
                  aria-label={`Select ${variant.color} color`}
                >
                  <span
                    className={`absolute inset-0 rounded-full border-2 ${
                      variant.color === selectedColor
                        ? "border-gray-400"
                        : "border-transparent"
                    }`}
                  ></span>
                  <span
                    className="absolute inset-1 rounded-full"
                    style={{ backgroundColor: variant.color }}
                  ></span>
                </button>
              ))}
            </div>
            <h3 className="Asul text-[14px] leading-[18px] text-sm font-medium mb-1">
              {product.name}
            </h3>
            <div className="Fira flex items-center">
              <span className="text-lg font-bold mr-2">
                {formatIndianPrice(product.colorVariants[0].price)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatIndianPrice(product.colorVariants[0].originalPrice)}
              </span>
            </div>
            <button className="w-full bg-[#926a54] text-white py-2 mt-5 rounded-md hover:bg-[#7d5a47] transition-colors duration-300">
              Check It Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedProducts = () => {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/featured-products?populate[ColorVariants][populate]=*`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
            },
          }
        );
        const fetchedProducts = response.data.data.map((item) => ({
          id: item.id,
          name: item.attributes.Name,
          defaultColor: item.attributes.Default_Color,
          description: item.attributes.Description,
          slug: item.attributes.slug,
          colorVariants: item.attributes.ColorVariants.map((variant) => ({
            color: variant.Color,
            price: parseFloat(variant.Price),
            originalPrice: parseFloat(variant.originalPrice),
            stocks: variant.Stocks,
            images: variant.Images.data.map((image) => ({
              url: `${API_URL}${image.attributes.url}`,
              color: variant.Color,
            })),
          })),
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const checkScrollPosition = () => {
    const element = scrollRef.current;
    if (element) {
      setIsAtStart(element.scrollLeft === 0);
      setIsAtEnd(
        Math.ceil(element.scrollLeft + element.clientWidth) >=
          element.scrollWidth
      );
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, [products]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.clientWidth;
      const scrollAmount =
        direction === "left" ? -containerWidth : containerWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const handleProductClick = (product) => {
    navigate(`/products/${product.slug}`, { state: { product } });
  };

  return (
    <div className="w-full py-8 px-4 bg-[#fbfaf9]">
      <h1 className="Asul text-[20px] sm:text-[22px] font-normal leading-[29px] mt-3 mb-6">
        Featured Products
      </h1>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
          onScroll={checkScrollPosition}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onProductClick={handleProductClick}
            />
          ))}
        </div>
        <div className="flex mt-4 mb-2 justify-center space-x-2">
          <button
            className={`p-2 rounded bg-[#7d5a47] transition-opacity duration-300 ${
              isAtStart ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
            onClick={() => scroll("left")}
            disabled={isAtStart}
          >
            <ChevronLeft size={20} color="white" />
          </button>
          <button
            className={`p-2 rounded bg-[#7d5a47] transition-opacity duration-300 ${
              isAtEnd ? "opacity-50 cursor-not-allowed" : "opacity-100"
            }`}
            onClick={() => scroll("right")}
            disabled={isAtEnd}
          >
            <ChevronRight size={20} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
