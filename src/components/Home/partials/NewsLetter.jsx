import React, { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";

const NewsletterPromo = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    console.log("Subscribing with email:", email);
    setEmail("");
  };

  return (
    <>
      <div className="px-4 py-5 md:px-4">
      <div className="bg-[#f5f3f1] p-6 rounded-3xl w-full mx-auto">
        <div className="mb-8">
          <h2 className="Asul text-2xl font-normal mb-5">Newsletter</h2>
          <p className="Fira text-gray-700 mb-4">
            To Know The Latest News And Updates, Enter Your
            <br />
            Email So That We Can Contact You
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <div className="input-button md:flex md:items-center md:gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full md:w-[40%] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            <button
              type="submit"
              className="bg-[#926a54] text-white py-2 px-4 mt-3 md:mt-0 rounded-md hover:bg-[#7d5a47] transition-colors duration-300 flex items-center justify-center"
            >
              Subscribe <ArrowRight className="ml-2" size={20} />
            </button>
            </div>
              </div>
          </form>
        </div>

        <div>
          <img
            src="https://assets.lummi.ai/assets/Qme8Y8rd3DdJi8NZxqDZqrAr2enRQpw83g5c46QjnEWnuX?auto=format&w=1500"
            alt="Clothing on hangers"
            className="w-full h-40 md:h-60 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">Save your money</h3>
          <p className="text-gray-700">
            Shop Upto &#x20b9;2999.00 And Get One item Free!
          </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default NewsletterPromo;
