import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import AddressForm from "./partials/ShippingForm";
import OrderSummary from "./partials/Payment";
import { Info } from "lucide-react";

const TAX_RATE = 0.18; // 18% tax rate

const LaptopView = () => {
  const location = useLocation();
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const [isLeftScrolledToBottom, setIsLeftScrolledToBottom] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [contact, setContact] = useState("");
  const [isShippingConfirmed, setIsShippingConfirmed] = useState(false);
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);

  const handleContactChange = (e) => {
    setContact(e.target.value);
  };

    const handleContactSubmit = () => {
      setIsContactSubmitted(true);
    };

  useEffect(() => {
    const handleScroll = () => {
      if (leftRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = leftRef.current;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
        setIsLeftScrolledToBottom(isAtBottom);
      }
    };

    const leftElement = leftRef.current;
    if (leftElement) {
      leftElement.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (leftElement) {
        leftElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    const handleWheel = (e) => {
      if (isLeftScrolledToBottom) {
        e.preventDefault();
        if (rightRef.current) {
          rightRef.current.scrollTop += e.deltaY;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isLeftScrolledToBottom]);

  useEffect(() => {
    const receivedCartItems = location.state?.cartItems || [];
    setCartItems(receivedCartItems);

    const calculatedSubtotal = receivedCartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(calculatedSubtotal);

    const estimatedTax = calculatedSubtotal * TAX_RATE;
    setTotal(calculatedSubtotal + estimatedTax);
  }, [location.state]);

  return (
    <div className="Fira bg-white hidden lg:flex mt-[52px] w-full">
      <div ref={leftRef} className="left w-[55%] overflow-y-auto">
        <div className="contact-details max-w-xl mx-auto pt-10 px-4 py-5 bg-white">
          <div className="flex justify-between items-center">
            <h2 className="text-[20px] font-medium mb-2">Contact</h2>
            <div className="flex justify-between items-center mb-2">
              <span><Info/></span>
            </div>
          </div>
          <input
            type="tel"
            name="contact"
            placeholder="mobile phone number( with country code )"
            className="w-full border-[1px] text-[14px] mt-2 text-black border-black rounded-xl px-3 py-4 mb-2"
            value={contact}
            onChange={handleContactChange}
            required
            disabled={isContactSubmitted}
          />
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span>Email me with news and offers</span>
          </label>
        </div>
        <div className="shipping-form max-w-xl mx-auto">
          <p className="px-4 py-3 text-[20px] w-[95.5%] rounded-lg mx-auto font-medium bg-[#f3f4f6] mb-2">
            Shipping Address
          </p>
          <AddressForm
            onShippingConfirmed={() => {
              setIsShippingConfirmed(true);
              handleContactSubmit();
            }}
            contact={contact}
            setContact={setContact}
            isContactSubmitted={isContactSubmitted}
          />
          <OrderSummary />
        </div>
      </div>
      <div
        ref={rightRef}
        className="right w-[45%] bg-[#f5f5f5] sticky top-[52px] right-0"
      >
        <div className="mt-4 px-4 py-3">
          {cartItems.map((item, index) => (
            <div
              key={`${item.id}-${item.color}-${item.size}`}
              className="flex items-center mb-4"
            >
              <div className="w-[64px] h-[70px] mr-4 relative">
                <img
                  src={
                    item.image.url ||
                    item.image.imageSrc ||
                    "https://placehold.co/300"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
                <span className="absolute -top-2 -right-2 bg-gray-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {item.quantity}
                </span>
              </div>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-600">{item.color}</p>
                <p className="font-medium">₹{item.price}.00</p>
              </div>
            </div>
          ))}
          <div className="space-y-3 pt-7">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="Fira text-[14px] leading-[21px]">
                Enter shipping address
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[14px] leading-[21px]">
                Estimated taxes ({TAX_RATE * 100}%)
              </span>
              <span className="text-[16px] leading-[21px]">
                ₹{(total - subtotal).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[19px] font-medium">
              <span>Total</span>
              <span className="Fira text-[22px] leading-[21px]">
                <span className="text-[14px] opacity-70 mr-2 font-normal">
                  INR
                </span>{" "}
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopView;