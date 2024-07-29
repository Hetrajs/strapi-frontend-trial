import React from "react";
import { BreadcrumbWithCustomSeparator } from "./partials/CategoryBreadCrumb";
import SubCategory from "./partials/SubCategory";
import Filter from "./partials/Filter";
import MenProducts from "./partials/MenProducts";

const Category = () => {

  return (
    <div className="w-full mt-[53px] md:mt-[72px] lg:mt-[52px]">
      <div className="heading w-full py-5 px-7 md:py-7 md:px-9 h-[110px] md:h-[120px] lg:h-[320px] lg:py-14 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(https://assets.lummi.ai/assets/QmX93dpuH7ZyAug5UK1dwbzEYfityQQBaTKchpjZMtYC1S?auto=format&w=1500)`,
          }}
        />
        <div className="absolute inset-0 bg-black opacity-45" />
        <div className="relative z-10">
          <BreadcrumbWithCustomSeparator />
          <h1 className="Asul text-[26px] mt-3 leading-[31px] capitalize text-white">
            Mens Wear
          </h1>
        </div>
      </div>
      {/* <SubCategory /> */}
      {/* <Filter/> */}
      <MenProducts/>
    </div>
  );
};

export default Category;
