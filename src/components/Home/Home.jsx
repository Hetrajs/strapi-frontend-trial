import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import ShopByCategory from "./partials/ShopByCategory";
import ServiceFeaturesRow from "./partials/servicesDetails";
import NewArrivals from "./partials/NewArrivals";
import FashionTrends from "./partials/FashionTrends";
import FeaturedProducts from "./partials/FeaturedProducts";
import StoreLocator from "./partials/StoreLocator";
import FollowUs from "./partials/FollowUs";
import NewsletterPromo from "./partials/NewsLetter";
import Footer from "../Footer/Footer";

const Home = () => {
  const images = [
    "https://assets.lummi.ai/assets/QmZtykT69vmKLkhXpr5qkHKN5ykqMknbMqiq9dvpRUn5ks?auto=format&w=1500",
    "https://assets.lummi.ai/assets/Qmc4sHjLXg9iHmoLZb414jaTWzaiEDt32JJvui1ysyTPiu?auto=format&w=1500",
    "https://assets.lummi.ai/assets/Qme8Y8rd3DdJi8NZxqDZqrAr2enRQpw83g5c46QjnEWnuX?auto=format&w=1500",
    "https://assets.lummi.ai/assets/QmR3U8fGeaNSrS3KrehS7imR6TXhc4JwcUgys8hkYPsxAq?auto=format&w=1500",
    "https://assets.lummi.ai/assets/QmTGYyEX8p3vy9TiQC7XR3q7mj4NKpQwDYMh8rQH9UENeJ?auto=format&w=1500",
  ];

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [details, setDetails] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    detailsChanged(s) {
      setDetails(s.track.details);
    },
    created() {
      setLoaded(true);
    },
  });

  function scaleStyle(idx) {
    if (!details) return {};
    const slide = details.slides[idx];
    const scale_size = 0.7;
    const scale = 1 - (scale_size - scale_size * slide.portion);
    return {
      transform: `scale(${scale})`,
      WebkitTransform: `scale(${scale})`,
    };
  }

  return (
    <>
      <div className="relative mt-[53px] md:mt-[72px] lg:mt-[52px]">
        <div ref={sliderRef} className="keen-slider zoom-out h-[500px]">
          {images.map((src, idx) => (
            <div key={idx} className="keen-slider__slide zoom-out__slide">
              <div style={scaleStyle(idx)}>
                <img
                  src={src}
                  alt={`Slide ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === currentSlide && (
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                    <h2 className="text-4xl font-bold mb-4">Step Into Style</h2>
                    <p className="text-center max-w-md mb-6">
                      Elevate your style with our collection of versatile
                      one-pieces. Effortless fashion made easy with our curated
                      selection.
                    </p>
                    <button className="bg-white text-black px-6 py-2 rounded-full font-semibold">
                      Shop now →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {loaded && instanceRef.current && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full flex items-center px-2 py-1">
            <div className="flex py-2 justify-center items-center space-x-2 mx-2">
              {[
                ...Array(
                  instanceRef.current.track.details.slides.length
                ).keys(),
              ].map((idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === idx ? "bg-white w-8" : "bg-white/50 w-2"
                  }`}
                >
                  <span className="sr-only">Go to slide {idx + 1}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <ShopByCategory />
      <ServiceFeaturesRow />
      <NewArrivals />
      <FashionTrends />
      <FeaturedProducts />
      <StoreLocator/>
      <FollowUs/>
      <NewsletterPromo/>
      <Footer/>
    </>
  );
};

export default Home;
