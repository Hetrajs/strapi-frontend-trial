import React from "react";

const StoreLocator = () => {
  return (
    <div className="w-full px-4 py-5 bg-[#ffffff] flex flex-col md:flex-row md:gap-5 lg:items-center">
      <div className="picture w-full md:w-[70%] h-[450px] overflow-hidden">
        <img data-scroll data-scroll-speed="-.1"
          className="w-full h-full rounded-xl object-cover"
          src="https://assets.lummi.ai/assets/QmVmRdiRSCPxhhehnK8jiQ3JVs4gNyxBx9AWp2WkszmSS4?auto=format&w=1500"
          alt="Store Locator"
        />
      </div>
      <div className="content md:w-[30%]">
        <h1 className="Asul mt-5 text-[20px] leading-[26px] md:text-[24px] md:leading-[31px] capitalize">Enhance Your Shopping Experience by Visiting Our Store</h1>
        <p className="Fira mt-3 md:mt-5 font-normal text-[14px] leading-[22px] md:text-[16px] md:leading-[26px]">We are conveniently located in the heart of Fashion City, just a block away from the central plaza. Our store is easily accessible by public transportation and offers ample parking space for those driving.</p>
        <button className="px-4 py-2.5 mt-5 md:mt-7 bg-[#926a54] text-white rounded-md">Locate store</button>
      </div>
    </div>
  );
};

export default StoreLocator;
