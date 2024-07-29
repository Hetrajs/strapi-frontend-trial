import { Tally2 } from "lucide-react";
import React from "react";

const Filter = () => {
  return (
    <>
    <div className="w-[93%] h-12 my-8 opacity-75 mx-auto border-[1px]">
        <div className="w-full h-full px-4 flex items-center justify-between">
            <div className="grids-control flex items-center">
            <Tally2 className="font-black cursor-pointer" />
            <Tally2 className="rotate-90 mt-3 font-black cursor-pointer" />
            </div>
        </div>
    </div>
    </>
  );
};

export default Filter;
