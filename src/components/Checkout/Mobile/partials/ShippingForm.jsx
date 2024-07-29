import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Info } from 'lucide-react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCart } from '@/context/CartContext';

const API_URL = import.meta.env.VITE_BASE_URL;
const API_TOKEN = import.meta.env.VITE_ADMIN_KEY;

const AddressForm = ({ onShippingConfirmed, contact }) => {
  const { cartItems, cartTotal, setIsShippingSubmitted } = useCart();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    Contact: contact
  });

  const isContactValid = (contactNumber) => {
    return /^\+\d{1,3}\s?\d{6,14}$/.test(contactNumber);
  };

  const [suggestions, setSuggestions] = useState([]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [statesList, setStatesList] = useState([]);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);

  const countryDropdownRef = useRef(null);
  const stateDropdownRef = useRef(null);

  const countries = {
    'India': [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 
      'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 
      'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
      'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 
      'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ],
    'United States': ['California', 'New York', 'Texas', 'Florida', 'Illinois'],
    'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'],
    'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia', 'South Australia'],
    'Germany': ['Bavaria', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Lower Saxony', 'Hesse'],
    'France': ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Hauts-de-France', 'Nouvelle-Aquitaine', 'Occitanie'],
    'Japan': ['Tokyo', 'Osaka', 'Kanagawa', 'Aichi', 'Fukuoka']
  };

  useEffect(() => {
    if (formData.country) {
      setStatesList(countries[formData.country] || []);
      setFormData(prevState => ({ ...prevState, state: '' }));
    }
  }, [formData.country]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
        setIsStateDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isFormSubmitted && !showExitWarning) {
        e.preventDefault();
        setShowExitWarning(true);
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isFormSubmitted, showExitWarning]);

  useEffect(() => {
    if (showExitWarning) {
      const userChoice = window.confirm(
        "⚠️ Attention! Your shopping journey isn't complete. Exiting now means starting over. Are you sure?"
      );
      if (userChoice) {
        setShowExitWarning(false);
      } else {
        setShowExitWarning(false);
      }
    }
  }, [showExitWarning]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAddressChange = async (e) => {
    const value = e.target.value;
    setFormData(prevState => ({ ...prevState, address: value }));

    if (value.length > 3) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`);
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData(prevState => ({
      ...prevState,
      address: suggestion.display_name,
      country: suggestion.address.country || '',
      state: suggestion.address.state || '',
      city: suggestion.address.city || '',
      pinCode: suggestion.address.postcode || ''
    }));
    setSuggestions([]);
  };

  const toggleCountryDropdown = () => {
    if (!isFormSubmitted) {
      setIsCountryDropdownOpen(!isCountryDropdownOpen);
    }
  };

  const selectCountry = (selectedCountry) => {
    if (!isFormSubmitted) {
      setFormData(prevState => ({ ...prevState, country: selectedCountry }));
      setIsCountryDropdownOpen(false);
    }
  };

  const toggleStateDropdown = () => {
    if (!isFormSubmitted) {
      setIsStateDropdownOpen(!isStateDropdownOpen);
    }
  };

  const selectState = (selectedState) => {
    if (!isFormSubmitted) {
      setFormData(prevState => ({ ...prevState, state: selectedState }));
      setIsStateDropdownOpen(false);
    }
  };

  const isFormComplete = () => {
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'state', 'country', 'pinCode'];
    return requiredFields.every(field => formData[field].trim() !== '');
  };

  const formatCartItems = () => {
    return cartItems.map(item => `${item.name} (${item.quantity})`).join(', ');
  };

  const calculateTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.country || !formData.state) {
      toast.error('Please select both country and state.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    if (!isContactValid(contact)) {
      toast.error('Please enter a valid contact number with country code (e.g., +91 123456789).', {
        position: "top-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      const orderedProducts = cartItems.map(item => ({
        ProductName: item.name,
        ProductPrice: item.price,
        Quantity: item.quantity
      }));

      const response = await axios.post(
        `${API_URL}/api/orders`,
        { 
          data: {
            ...formData,
            Contact: contact,
            ProductName: formatCartItems(),
            ProductPrice: cartTotal,
            Quantity: calculateTotalQuantity().toString(),
            OrderedProducts: orderedProducts
          } 
        },
        {
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        toast.success('Your order details have been confirmed successfully! You can now proceed to make the payment.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true, 
          draggable: true,
        });
        setIsFormSubmitted(true);
        setIsShippingSubmitted(true); 
        onShippingConfirmed(); 
      } else {
        toast.error('We encountered an issue while processing your details. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error('Oops! Something went wrong on our end. Please try again later.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      console.error('Error creating order:', error);
    }
  };

  return (
    <div className="max-w-md md:max-w-[550px] mx-auto bg-white p-6 rounded-lg shadow-md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative" ref={countryDropdownRef}>
          <label className="text-sm text-gray-600">Country/Region <span className='text-red-600'>*</span></label>
          <div 
            className={`flex items-center justify-between border rounded-md p-2 ${isFormSubmitted ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'}`}
            onClick={toggleCountryDropdown}
          >
            <span>{formData.country || 'Select country'}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
          {isCountryDropdownOpen && !isFormSubmitted && (
            <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto">
              {Object.keys(countries).map((c, index) => (
                <li 
                  key={index} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectCountry(c)}
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-600">First name <span className='text-red-600'>*</span></label>
          <input 
            type="text" 
            name="firstName"
            className={`w-full border rounded-md p-2 mt-1 ${isFormSubmitted ? 'bg-gray-100' : ''}`}
            value={formData.firstName}
            onChange={handleInputChange}
            required
            disabled={isFormSubmitted}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Last name <span className='text-red-600'>*</span></label>
          <input 
            type="text" 
            name="lastName"
            className={`w-full border rounded-md p-2 mt-1 ${isFormSubmitted ? 'bg-gray-100' : ''}`}
            value={formData.lastName}
            onChange={handleInputChange}
            required
            disabled={isFormSubmitted}
          />
        </div>

        <div className="relative">
          <label className="text-sm text-gray-600">Address <span className='text-red-600'>*</span></label>
          <div className={`flex items-center border rounded-md p-2 mt-1 ${isFormSubmitted ? 'bg-gray-100' : ''}`}>
            <input 
              type="text" 
              name="address"
              className={`flex-grow outline-none ${isFormSubmitted ? 'bg-gray-100' : ''}`}
              placeholder="Enter your address"
              value={formData.address}
              onChange={handleAddressChange}
              required
              disabled={isFormSubmitted}
            />
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          {suggestions.length > 0 && !isFormSubmitted && (
            <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-600">Apartment, suite, etc. (optional)</label>
          <input 
            type="text" 
            name="apartment"
            className={`w-full border rounded-md p-2 mt-1 ${isFormSubmitted ? 'bg-gray-100' : ''}`}
            value={formData.apartment}
            onChange={handleInputChange}
            disabled={isFormSubmitted}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">City <span className='text-red-600'>*</span></label>
          <input 
            type="text" 
            name="city"
            className={`w-full border rounded-md p-2 mt-1 ${isFormSubmitted ? 'bg-gray-100' : ''}`}
            value={formData.city}
            onChange={handleInputChange}
            required
            disabled={isFormSubmitted}
          />
        </div>

        <div className="relative" ref={stateDropdownRef}>
          <label className="text-sm text-gray-600">State <span className='text-red-600'>*</span></label>
          <div 
            className={`flex items-center justify-between border rounded-md p-2 ${isFormSubmitted ? 'cursor-not-allowed bg-gray-100' : 'cursor-pointer'}`}
            onClick={toggleStateDropdown}
          >
            <span>{formData.state || 'Select state'}</span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
          {isStateDropdownOpen && !isFormSubmitted && statesList.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto">
              {statesList.map((s, index) => (
                <li 
                  key={index} 
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => selectState(s)}
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-600">PIN code <span className='text-red-600'>*</span></label>
          <input 
            type="text" 
            name="pinCode"
            className={`w-full border rounded-md p-2 mt-1 ${isFormSubmitted ? 'bg-gray-100' : ''}`}
            value={formData.pinCode}
            onChange={handleInputChange}
            required
            disabled={isFormSubmitted}
          />
        </div>

        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="save-info" 
            className="mr-2"
            checked={saveInfo}
            onChange={(e) => setSaveInfo(e.target.checked)}
            disabled={isFormSubmitted}
          />
          <label htmlFor="save-info" className="text-sm text-gray-600">Save this information for next time</label>
        </div>

        <div className="flex items-center gap-4">
          <button 
            type="submit" 
            disabled={!isFormComplete() || isFormSubmitted} 
            className={`w-fit bg-black text-white py-2 whitespace-nowrap px-3 rounded-md transition-opacity duration-300 ${
              !isFormComplete() || isFormSubmitted ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
            }`}
          >
            Confirm details
          </button>
          <h1 className='Asul font-bold text-[9px] flex items-center gap-2 text-red-400'>
            <Info className='cursor-pointer' />Don't Refresh page after confirming details.
          </h1>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AddressForm;