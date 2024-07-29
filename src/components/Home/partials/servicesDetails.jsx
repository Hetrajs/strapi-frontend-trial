import React from 'react';
import { TruckIcon, CreditCard, Award, HeadphonesIcon, RotateCcw } from 'lucide-react';

const features = [
  { icon: <RotateCcw size={24} />, text: 'Easy Returns' },
  { icon: <TruckIcon size={24} />, text: 'Free Shipping' },
  { icon: <CreditCard size={24} />, text: 'Secure Payment' },
  { icon: <Award size={24} />, text: 'Quality Assured' },
  { icon: <HeadphonesIcon size={24} />, text: 'Great Support' },
];

const ServiceFeaturesRow = () => {
  return (
    <div className="w-full bg-gray-100 py-4 overflow-hidden">
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-container {
            display: flex;
            overflow: hidden;
            width: 100%;
          }
          .marquee {
            flex: 0 0 auto;
            display: flex;
            min-width: 100%;
            animation: marquee 30s linear infinite;
          }
          .marquee-container:hover .marquee {
            animation-play-state: paused;
          }
        `}
      </style>
      <div className="marquee-container">
        <div className="marquee">
          {[...features, ...features].map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 mx-4">
              <span className="text-gray-700">{feature.icon}</span>
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{feature.text}</span>
            </div>
          ))}
        </div>
        <div className="marquee" aria-hidden="true">
          {[...features, ...features].map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 mx-4">
              <span className="text-gray-700">{feature.icon}</span>
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceFeaturesRow;