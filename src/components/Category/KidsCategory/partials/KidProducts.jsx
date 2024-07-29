import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const API_URL = import.meta.env.VITE_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const ProductCard = ({
  id,
  discount,
  images,
  colors,
  name,
  price,
  originalPrice,
  onClick,
  onCheckItOut
}) => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [hoveredColor, setHoveredColor] = useState(null);

  const getCurrentImageSrc = () => {
    const currentColor = hoveredColor || selectedColor;
    const imageObj = images.find(img => img.color === currentColor);
    return imageObj ? imageObj.imageSrc : images[0].imageSrc;
  };

  return (
    <div className="bg-neutral-100 mt-4 rounded-2xl overflow-hidden shadow-sm h-full cursor-pointer" onClick={onClick}>
      <div className="relative">
        <img src={getCurrentImageSrc()} alt={name} className="w-full h-96 lg:h-96 object-cover" />
        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          {discount}% off
        </div>
      </div>
      <div className="p-4">
        <div className="flex space-x-2 mb-2">
          {colors.map((color, index) => (
            <button
              key={index}
              className={`w-6 h-6 rounded-full relative focus:outline-none`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(color);
              }}
              onMouseEnter={() => setHoveredColor(color)}
              onMouseLeave={() => setHoveredColor(null)}
              aria-label={`Select ${color} color`}
            >
              <span
                className={`absolute inset-0 rounded-full border-2 ${
                  color === selectedColor
                    ? "border-gray-400"
                    : "border-transparent"
                }`}
              ></span>
              <span
                className="absolute inset-1 rounded-full"
                style={{ backgroundColor: color }}
              ></span>
            </button>
          ))}
        </div>
        <h3 className="Asul text-[14px] leading-[18px] font-medium mb-1 truncate">{name}</h3>
        <div className="Fira flex items-center">
          <span className="text-sm font-bold mr-2">&#x20b9; {price}</span>
          <span className="text-xs text-gray-500 line-through">
            &#x20b9; {originalPrice}
          </span>
        </div>
        <button 
          className="w-full bg-[#926a54] text-white py-2 mt-3 rounded-md hover:bg-[#7d5a47] transition-colors duration-300 text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onCheckItOut();
          }}
        >
          Check It Out
        </button>
      </div>
    </div>
  );
};

const WomenProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/kids-products?populate[ColorVariants][populate]=*`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`
            }
          }
        );
        const data = response.data;
        
        const formattedProducts = data.data.map(product => {
          const colorVariants = product.attributes.ColorVariants || [];
          return {
            id: product.id,
            name: product.attributes.Name,
            slug: product.attributes.slug,
            description: product.attributes.Description,
            colorVariants: colorVariants.map(variant => ({
              color: variant.Color,
              price: variant.Price,
              originalPrice: variant.originalPrice,
              stocks: variant.Stocks,
              images: variant.Images.data.map(image => ({
                imageSrc: image.attributes.formats?.medium?.url
                  ? `${API_URL}${image.attributes.formats.medium.url}`
                  : `${API_URL}${image.attributes.url}`
              }))
            })),
            images: colorVariants.map(variant => ({
              color: variant.Color,
              imageSrc: variant.Images.data[0]?.attributes.formats?.medium?.url
                ? `${API_URL}${variant.Images.data[0].attributes.formats.medium.url}`
                : variant.Images.data[0]?.attributes.url
                ? `${API_URL}${variant.Images.data[0].attributes.url}`
                : "/api/placeholder/400/320",
            })),
            colors: colorVariants.map(variant => variant.Color),
            price: colorVariants[0]?.Price,
            originalPrice: colorVariants[0]?.originalPrice,
            discount: calculateDiscount(colorVariants[0]?.Price, colorVariants[0]?.originalPrice),
          };
        });

        setProducts(formattedProducts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const calculateDiscount = (price, originalPrice) => {
    if (!price || !originalPrice) return 0;
    const discount = ((originalPrice - price) / originalPrice) * 100;
    return Math.round(discount);
  };

  const handleProductClick = (product) => {
    navigate(`/products/${product.slug}`, { state: { product } });
  };

  if (loading) return <div>Loading...</div>;  
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full py-4 pt-6 px-4 bg-[#fbfaf9]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            {...product} 
            onClick={() => handleProductClick(product)}
            onCheckItOut={() => handleProductClick(product)}
          />
        ))}
      </div>
    </div>
  );
};

export default WomenProducts;