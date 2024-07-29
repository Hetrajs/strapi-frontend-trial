import React from "react";

const ShopByCategory = () => {

  const subCategories = [
    { name: 'T-Shirt', image: 'https://assets.lummi.ai/assets/QmXniWRq8YXJDm7QTzxWQVX5rEEWcD89u7aszQPwiER4hr?auto=format&w=1500', link: "/collections/category/men's-wear" },
    { name: 'Shirt', image: 'https://assets.lummi.ai/assets/QmUgLs1GDmULRihHK32k7eMLoLs3AVHY8H2pzf4VYEUmPC?auto=format&w=1500', link: "/collections/category/men's-wear" },
    { name: 'Jeans', image: 'https://assets.ajio.com/medias/sys_master/root/20230302/dhkf/64008e75f997dde6f4d8cf6f/-473Wx593H-469465328-blue-MODEL.jpg', link: "/collections/category/men's-wear" },
    { name: 'Pants', image: 'https://media.istockphoto.com/id/513988967/photo/front-back-view-of-casual-man.jpg?s=1024x1024&w=is&k=20&c=gwCVZztvFm3wsoB7APldU3zJ2GJEbVcrxndIR-B2gJo=', link: "/collections/category/men's-wear" },
    { name: 'Trouser', image: 'https://media.istockphoto.com/id/514412664/photo/photo-of-fashion-man-who-crossed-his-legs.jpg?s=1024x1024&w=is&k=20&c=mimBIOoHEC_7n-fNZA2C0r-xtU9l9vvBrWgG2emG8FU=', link: "/collections/category/men's-wear" },
    // You can add more categories here
  ];

  return (
    <div className="w-full py-10 px-4 overflow-hidden bg-gradient-to-b from-[#ffffff] to-[#eae5e2]">
      <div className="carousel lg:px-12 overflow-x-auto">
        <div className="flex space-x-2 md:space-x-4 pb-2">
        {subCategories.map((subCategory, index) => (
          <div key={index} className="relative rounded-xl overflow-hidden flex-none w-[10.5rem] h-60 md:w-[14rem] md:h-80 lg:w-[13rem] lg:h-72">
          <div className="absolute inset-0">
            <img
              src={subCategory.image}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black opacity-20"></div>
          </div>
          <div className="absolute bottom-4 left-4 text-white z-10">
            <h3 className="Asul text-[22px] leading-[28px] text-lg font-medium">
              {subCategory.name}
            </h3>
          </div>
      </div>  
        ))}        
        </div>
      </div>
    </div>
  );
};

export default ShopByCategory;