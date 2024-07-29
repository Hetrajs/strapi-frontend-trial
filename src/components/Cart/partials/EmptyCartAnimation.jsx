import React from "react";
import { motion } from "framer-motion";

const EmptyCartAnimation = () => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center h-full">
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="120"
      height="120"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.path
        fill="none"
        stroke="#926a54"
        strokeWidth="2"
        d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.circle
        cx="9"
        cy="21"
        r="1"
        fill="#926a54"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
      />
      <motion.circle
        cx="20"
        cy="21"
        r="1"
        fill="#926a54"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, duration: 0.3 }}
      />
    </motion.svg>
    <motion.p
      className="Asul text-2xl text-[#926a54] mt-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      Your cart is empty
    </motion.p>
    <motion.p
      className="Fira text-sm text-gray-500 mt-2 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      Looks like you haven't added anything to your cart yet.
    </motion.p>
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.5 }} 
      className="Asul text-[24px] leading-[31px] mt-10 font-medium whitespace-nowrap">Have an account?</motion.h1>
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1, duration: 0.5 }} 
      className="Fira text-[14px] leading-[29px] mt-2 font-normal whitespace-nowrap cursor-pointer text-[#926a54] border-b-[1px]">Log in <span className="text-black border-none cursor-auto">to checkout faster.</span></motion.h1>
  </div>
);

export default EmptyCartAnimation;
