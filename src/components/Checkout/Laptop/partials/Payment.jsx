import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from '@/context/CartContext';

const TAX_RATE = 0.18; // 18% tax rate

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isShippingSubmitted } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  const handlePayment = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_API,
      amount: total * 100,
      currency: "INR",
      name: "Benzochem Industries",
      description: "Test Transaction",
      image: "https://example.com/your_logo.jpg",
      handler: function (response) {
        // alert(response.razorpay_payment_id);
        navigate("/success");
        // Handle successful payment here
      },
      method: {
        netbanking: true,
        card: true,
        upi: true,
        wallet: true,
      },
      prefill: {
        name: "Payer Name",
        email: "payer@example.com",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#1e40af",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <div className="Fira mx-auto max-w-xl w-[95.5%] bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Order summary</h2>

        {cartItems.map((item) => (
          <div
            key={`${item.id}-${item.color}-${item.size}`}
            className="flex items-center mb-4"
          >
            <div className="w-16 h-16 mr-4 relative">
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
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">{item.color}</p>
            </div>
            <span className="ml-auto">
              ₹{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}

        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span className="text-green-600">FREE</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Estimated taxes ({TAX_RATE * 100}%)</span>
            <span>₹{(total - subtotal).toFixed(2)}</span>
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between mb-4">
            <span className="font-bold">Total</span>
            <span className="font-bold">₹{total.toFixed(2)}</span>
          </div>
          <button
            onClick={handlePayment}
            disabled={!isShippingSubmitted}
            className={`w-full bg-black text-white py-3 rounded-md font-semibold ${
              !isShippingSubmitted ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Pay now
          </button>
        </div>
      </div>
    </>
  );
};

export default Payment;
