import React, { useEffect } from "react";
import MobileView from "./Mobile/MobileView";
import LaptopView from "./Laptop/LaptopView";

const Checkout = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  })
  return (
    <div className="bg-[#f5f5f5] w-full">
      < MobileView/>
      < LaptopView/>
    </div>
  );
};

export default Checkout;
