import React, { useState } from 'react';
import { Globe, DollarSign } from 'lucide-react';

const PlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MinusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const footerSections = [
    {
      title: 'Contact Us',
      content: ['Email: support@hrstore.com', 'Phone: +1 (123) 456-7890', 'Address: 123 Fashion St, Style City, 12345']
    },
    {
      title: 'Quick Links',
      content: ['Home', 'Products', 'About Us', 'Blog']
    },
    {
      title: 'Company',
      content: ['Our Story', 'Careers', 'Press']
    },
    {
      title: 'Information',
      content: ['Shipping', 'Returns', 'FAQ']
    },
    {
      title: 'Our Service',
      content: ['Custom Orders', 'Cloth Refurbnish', 'Certification']
    },
  ];

  return (
    <footer className="bg-gray-100 text-gray-800 py-8">
      <div className="container mx-auto px-4 md:px-7">
        <div className="text-center mb-8 md:flex items-center justify-between lg:px-10 lg:my-10">
          <h2 className="text-3xl whitespace-nowrap font-bold mb-2">HR STORE</h2>
          <p className="Asul text-sm md:w-1/2 text-left">
            Fashion with a conscience! Our fashion features ethically sourced gemstones, perfect for customers committed to sustainable and ethical fashion choices.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {footerSections.map((section, index) => (
            <div key={index} className="border-b md:border-b-0 pb-4 md:pb-0 md:mt-2">
              <button
                className="flex justify-between items-center w-full text-left font-semibold mb-2"
                onClick={() => toggleSection(section.title)}
              >
                {section.title}
                <span className="lg:hidden">
                  {openSection === section.title ? <MinusIcon /> : <PlusIcon />}
                </span>
              </button>
              <ul className={`ml-4 space-y-2 ${openSection === section.title ? 'block' : 'hidden lg:block'}`}>
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
          <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow">
            <Globe className="h-4 w-4" />
            <span>India (₹)</span>
          </button>
          <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow">
            <DollarSign className="h-4 w-4" />
            <span>English</span>
          </button>
        </div>

        <div className="text-center text-sm space-y-2">
          <div className="space-x-4">
            <a href="#" className="hover:underline">Refund policy</a>
            <a href="#" className="hover:underline">Privacy policy</a>
            <a href="#" className="hover:underline">Terms of service</a>
          </div>
          <p>© 2024, HR STORE</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;