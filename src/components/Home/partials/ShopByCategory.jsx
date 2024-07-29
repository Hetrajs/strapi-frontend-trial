import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { name: 'Men', image: 'https://assets.lummi.ai/assets/QmQzmkwjhgPF9UMLXdnbSG3ux3zDvLEaR8FGRsqCgGYiS2?auto=format&w=1500', link: "/collections/category/men's-wear" },
  { name: 'Women', image: 'https://assets.lummi.ai/assets/QmVdphZqCQuKGBMaDam7o6o2PQ6ScuXCzPMVfr1TwSJvs5?auto=format&w=1500', link: "/collections/category/women's-wear" },
  { name: 'Kids', image: 'https://assets.lummi.ai/assets/QmR8YgHjzFWGLUQCacUBq4RpCvNaPV6JkRNon9mdRqPtVB?auto=format&w=1500', link: "/collections/category/kid's-wear" },
  // You can add more categories here
];


const ShopByCategory = () => {
  return (
    <>
      <div className="w-full py-8 px-4 overflow-hidden bg-[#fbfaf9]">
        <div className="heading flex flex-col md:flex-row md:justify-between mb-6">
          <h1 className="Asul text-[22px] font-normal leading-[29px]">
            Shop By Category
          </h1>
          <h1 className="Fira text-[16px] font-normal leading-[36px]">
            Shop All Category
          </h1>
        </div>
        <div className="carousel overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            {categories.map((category, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden flex-none w-64">
                <Link to={category.link}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopByCategory;