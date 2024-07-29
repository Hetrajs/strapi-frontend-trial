import React from "react";

const FollowUs = () => {
  return (
    <div className="w-full py-8 px-4 bg-gradient-to-b from-[#ffffff] to-[#eae5e2]">
      <h1 className="Asul text-[20px] leading-[26px] capitalize">
        Follow us on instagram
      </h1>
      <p className="Fira mt-3 text-[16px] leading-[29px]">
        follow us now to add a touch of radiance to your feed.
      </p>
      <div className="logo-info flex items-center gap-4">
        <span className="flex justify-center items-center size-14 rounded-xl bg-[#926a54]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-instagram"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
        </span>
        <div className="info">
            <h1 className="Asul text-[15px] leading-[20px]">@hr_store</h1>
            <h3 className="Fira text-[13px] leading-[24px]">16k followers</h3>
        </div>
      </div>
      <h1 className="Fira text-[16px] leading-[29px] font-medium mt-4">#WesternInspiration #EleganceDesign</h1>
      <button className="bg-[#926a54] text-white flex gap-2 items-center py-3 px-4 rounded-lg mt-7">
      <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-instagram"
          >
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
          </svg>
          <h1>Follow @hr_store</h1>
      </button>
    </div>
  );
};

export default FollowUs;
