import React, { useState, useEffect } from "react";

const ProductCard = ({
  discount,
  images,
  colors,
  name,
  price,
  originalPrice,
}) => {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [hoveredColor, setHoveredColor] = useState(null);

  const getCurrentImageSrc = () => {
    const currentColor = hoveredColor || selectedColor;
    const imageObj = images.find(img => img.color === currentColor);
    return imageObj ? imageObj.imageSrc : images[0].imageSrc;
  };

  return (
    <div className="bg-neutral-100 rounded-2xl overflow-hidden shadow-sm h-full">
      <div className="relative">
        <img src={getCurrentImageSrc()} alt={name} className="w-full h-48 lg:h-96 object-cover" />
        <div className="absolute top-3 left-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          {discount}% off
        </div>
      </div>
      <div className="p-4">
        <div className="flex space-x-2 mb-2">
          {colors.map((color, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full relative focus:outline-none`}
              onClick={() => setSelectedColor(color)}
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
          <span className="text-sm font-bold mr-2">&#x20b9; {price.toFixed(2)}</span>
          <span className="text-xs text-gray-500 line-through">
            &#x20b9; {originalPrice.toFixed(2)}
          </span>
        </div>
        <button className="w-full bg-[#926a54] text-white py-2 mt-3 rounded-md hover:bg-[#7d5a47] transition-colors duration-300 text-sm">
          Add to cart
        </button>
      </div>
    </div>
  );
};

const YouMayAlsoLike = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const dummyData = [
        {
          id: 1,
          discount: 3,
          images: [
            { color: '#000000', imageSrc: "https://assets.lummi.ai/assets/QmZkEwa9ky6PRJPXkZ4zRAketXzfUpRxX8YDT1JjFo4iGL?auto=format&w=1500" },
            { color: '#FFFFFF', imageSrc: "https://assets.lummi.ai/assets/QmSBaTbav6dsjYywCXdXuW542ESEQyqVb6x13WqLMPSR6U?auto=format&w=1500" },
            { color: '#d85124', imageSrc: "https://assets.lummi.ai/assets/QmZS21J2hEzt55yyNaoUArqGitJGhtsP1kAfpkVFByawte?auto=format&w=600" },
          ],
          colors: ['#000000', '#FFFFFF', '#d85124'],
          name: "Pocket V Neck Knit Sweater",
          price: 2600.00,
          originalPrice: 2700.00
        },
        {
          id: 2,
          discount: 5,
          images: [
            { color: '#b1c1c4', imageSrc: "https://assets.lummi.ai/assets/QmTj8QDm5w4HScQRb9XNjmxV4eujBk2TNsD1utznv173ok?auto=format&w=1500" },
            { color: '#4b342a', imageSrc: "https://images.unsplash.com/photo-1677856447105-e4ee53b88fd1?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
          ],
          colors: ['#b1c1c4', '#4b342a'],
          name: "Casual Denim Jacket",
          price: 3200.00,
          originalPrice: 3400.00
        },
        {
          id: 3,
          discount: 10,
          images: [
            { color: '#cdd2e0', imageSrc: "https://images.unsplash.com/photo-1553782376-b2e8256ab838?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { color: '#e1c9bf', imageSrc: "https://images.unsplash.com/photo-1499939667766-4afceb292d05?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
          ],
          colors: ['#cdd2e0', '#e1c9bf'],
          name: "Summer Floral Dress",
          price: 1800.00,
          originalPrice: 2000.00
        },
        {
          id: 4,
          discount: 7,
          images: [
            { color: '#876041', imageSrc: "https://assets.lummi.ai/assets/QmbwzUGLvcT9WjUTpiTwbzJa1DUHmiXMsG1evLYACuxFD7?auto=format&w=1500" },
            { color: '#f4e4d7', imageSrc: "https://images.unsplash.com/photo-1610398752800-146f269dfcc8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
          ],
          colors: ['#876041', '#f4e4d7'],
          name: "Classic Leather Boots",
          price: 4500.00,
          originalPrice: 4800.00
        },
        {
          id: 5,
          discount: 15,
          images: [
            { color: '#080709', imageSrc: "https://assets.lummi.ai/assets/QmXUTwp6kJngkmv7WCYo4B5PXiLwKwyAEaiSsUvUA4XBHn?auto=format&w=1500" },
            { color: '#8fabbb', imageSrc: "https://plus.unsplash.com/premium_photo-1693242804269-90f818c6001f?q=80&w=1906&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
          ],
          colors: ['#080709', '#8fabbb'],
          name: "Slim Fit Denim Jeans",
          price: 1900.00,
          originalPrice: 2200.00
        },
        {
          id: 6,
          discount: 8,
          images: [
            { color: '#b8d2ed', imageSrc: "https://assets.lummi.ai/assets/QmP1P54VML3HbZbnHsdq5w54gD1VfnTEdcykWxdrn5CyHN?auto=format&w=1500" },
            { color: '#e8b39d', imageSrc: "https://plus.unsplash.com/premium_photo-1705554519595-c1143c7fef97?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
            { color: '#fff', imageSrc: "https://plus.unsplash.com/premium_photo-1690406382383-3827c1397c48?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
          ],
          colors: ['#b8d2ed', '#e8b39d', '#fff'],
          name: "Comfortable Cotton T-Shirt",
          price: 800.00,
          originalPrice: 950.00
        }
      ];

      await new Promise((resolve) => setTimeout(resolve, 500));
      setProducts(dummyData);
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full py-8 bg-[#fbfaf9]">
      <h1 className="Asul text-[20px] sm:text-[22px] capitalize font-normal leading-[29px] mt-3 mb-6">
        You May Also Like
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default YouMayAlsoLike;