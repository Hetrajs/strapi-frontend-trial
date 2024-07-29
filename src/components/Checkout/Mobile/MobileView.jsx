import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import AddressForm from "./partials/ShippingForm";
import PaymentForm from "./partials/Payment";
import { Alert, AlertDescription } from '@/components/ui/alert';

const TAX_RATE = 0.18; // 18% tax rate

const MobileView = () => {
  const location = useLocation();
  const [showSummary, setShowSummary] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [contact, setContact] = useState("");
  const [isShippingConfirmed, setIsShippingConfirmed] = useState(false);
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState("");

  const summaryRef = useRef(null);

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

  const toggleSummary = () => {
    setShowSummary(!showSummary);
  };

  const handleContactChange = (e) => {
    setContact(e.target.value);
    setContactError(""); // Clear error when input changes
  };

  const handleContactSubmit = () => {
    setIsContactSubmitted(true);
  };

  useEffect(() => {
    if (showSummary && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showSummary]);

  return (
    <div className="Fira lg:hidden overflow-hidden md:max-w-[550px] md:mx-auto bg-gray-100 mt-[53px] md:mt-[72px] lg:mt-[52px] rounded-md">
      <div
        className="flex px-4 py-4 justify-between items-center cursor-pointer"
        onClick={toggleSummary}
      >
        <div className="one-div flex items-center gap-2">
          <span className="Asul text-[14px] leading-[21px]">
            {showSummary ? "Hide" : "Show"} order summary
          </span>
          {showSummary ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </div>
        <div className="flex items-center">
          <span className="mr-2">₹{total.toFixed(2)}</span>
        </div>
      </div>

      <hr />

      {showSummary && (
        <div ref={summaryRef} className="mt-4 px-4 py-3">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center mb-4">
              <div className="w-[64px] h-[70px] mr-4 relative">
                <img
                  src={item.image.url || item.image.imageSrc || "https://placehold.co/300"}
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
                <span className="text-[14px] opacity-70 mr-2 font-normal">INR</span> ₹{total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="pt-5 px-4 py-5 bg-white">
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-medium mb-2">Contact</h2>
          <div className="flex justify-between items-center mb-2">
            <span><Info /></span>
          </div>
        </div>
        <input
          type="tel"
          name="contact"
          placeholder="Mobile phone number (with country code)"
          className={`w-full border-[1px] text-[14px] mt-2 text-black border-black rounded-xl px-3 py-4 mb-2 ${
            contactError ? 'border-red-500' : ''
          }`}
          value={contact}
          onChange={handleContactChange}
          required
          disabled={isContactSubmitted}
        />
        {contactError && (
          <p className="text-red-500 text-sm mb-2">{contactError}</p>
        )}
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span>Email me with news and offers</span>
        </label>
      </div>
      <div className="shipping-form">
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
        <p className="Fira px-4 py-4">Order Summary</p>
        <PaymentForm />
      </div>
    </div>
  );
};

export default MobileView;