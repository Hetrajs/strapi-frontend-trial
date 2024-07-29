import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_BASE_URL;

const LoadingAnimation = () => (
  <div className="flex justify-center items-center h-full">
    <Loader2 className="h-8 w-8 animate-spin text-[#926a54]" />
  </div>
);

const SearchResults = ({
  results,
  isLoading: initialLoading,
  error,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [initialLoading]);

  const handleProductClick = (product) => {
    onClose();
    navigate(`/products/${product.slug}`, {
      state: {
        product,
        searchResults: results.products,
      },
    });
  };

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  const hasProducts = results.products && results.products.length > 0;

  return (
    <div className="search-results fixed top-[60px] left-0 w-full h-[calc(100vh-60px)] bg-white shadow-lg z-20 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="Fira text-[15px] leading-[20px]">
          Search for "{results.searchQuery}"
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading || initialLoading ? (
          <LoadingAnimation />
        ) : !hasProducts ? (
          <div className="text-center text-gray-600">
            No results found for "{results.searchQuery}"
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 grid-rows-3">
            {results.products.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="up-down cursor-pointer"
                onClick={() => handleProductClick(product)}
              >
                <div className="border rounded-2xl overflow-hidden">
                  <img
                    src={`${API_URL}${product.colorVariants[0]?.images[0]?.url}`}
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/200";
                    }}
                    alt={product.name}
                  />
                </div>
                <div className="p-2">
                  <h4 className="Asul text-[15px] leading-[20px]">
                    {product.name}
                  </h4>
                  <div className="both-price flex justify-start gap-3 items-center">
                    <p className="Fira font-semibold text-[14px] leading-[23px]">
                      &#x20b9; {product.colorVariants[0]?.price}.00
                    </p>
                    <p className="Fira font-bold text-[14px] line-through text-[#0009] leading-[18px]">
                      &#x20b9;{" "}
                      {product.colorVariants[0]?.originalPrice ||
                        product.colorVariants[0]?.OriginalPrice}
                      .00
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

SearchResults.propTypes = {
  results: PropTypes.shape({
    searchQuery: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        name: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        colorVariants: PropTypes.arrayOf(
          PropTypes.shape({
            price: PropTypes.string.isRequired,
            originalPrice: PropTypes.string,
            images: PropTypes.arrayOf(
              PropTypes.shape({
                url: PropTypes.string.isRequired,
              })
            ).isRequired,
          })
        ).isRequired,
      })
    ),
  }).isRequired,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default SearchResults;