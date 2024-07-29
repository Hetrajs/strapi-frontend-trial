import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/components/Home/Home";
import SingleProduct from "@/components/SingleProducts/SingleProducts"
import MenCategory from "@/components/Category/MensCategory/MenCategory";
import WomenCategory from "@/components/Category/WomensCategory/WomenCategory"
import KidCategory from '@/components/Category/KidsCategory/KidCategory'
import Cart from "@/components/Cart/Cart";
import Checkout from "@/components/Checkout/Checkout";
import Success from "@/components/Success/Success";

const RouteConfig = () => {
  return (
    <Routes className="overflow-hidden">
      <Route index element={<Home />} />
      <Route path="/products/:slug" element={<SingleProduct />} />
      <Route path="/collections/category/men's-wear" element={<MenCategory />} />
      <Route path="/collections/category/women's-wear" element={<WomenCategory />} />
      <Route path="/collections/category/kid's-wear" element={<KidCategory />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
};

export default RouteConfig;
