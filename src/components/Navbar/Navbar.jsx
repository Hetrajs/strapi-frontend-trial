import React, { useEffect, useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import "remixicon/fonts/remixicon.css";
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import axios from "axios";
import SearchResults from "./partials/SearchResults";
import { useNavigate } from "react-router-dom";
import EmptyCartAnimation from "./partials/EmptyCartAnimation";

const API_URL = import.meta.env.VITE_BASE_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const QuantityControl = ({ quantity, onIncrease, onDecrease, isUpdating }) => (
  <div className="flex items-center space-x-3">
    <button
      onClick={onDecrease}
      className={`p-2 rounded-lg ${
        quantity === 1 || isUpdating ? "bg-gray-300" : "bg-[#926a54]"
      } ${
        quantity === 1 || isUpdating ? "cursor-not-allowed" : "cursor-pointer"
      } outline-none border-none`}
      disabled={quantity === 1 || isUpdating}
    >
      {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Minus size={16} color="white" />}
    </button>
    <span className="text-lg font-semibold">{quantity}</span>
    <button
      onClick={onIncrease}
      className={`p-2 rounded-lg ${isUpdating ? "bg-gray-300" : "bg-[#926a54]"} outline-none border-none`}
      disabled={isUpdating}
    >
      {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} color="white" />}
    </button>
  </div>
);

const ProductImage = ({ src, alt }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-[100px] lg:w-[105px] lg:h-[130px] overflow-hidden h-[140px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <Loader2 className="animate-spin h-8 w-8 text-gray-900" />
        </div>
      )}
      <img
        className={`w-full h-full rounded-2xl object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        src={src}
        alt={alt}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};
export default () => {
  const [state, setState] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModelOpen, setIsSearchModelOpen] = useState(false);
  const [closeMenu, setCloseMenu] = useState(false);
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [searchResults, setSearchResults] = useState({
    products: [],
    searchQuery: "",
  });
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [updatingItems, setUpdatingItems] = useState({});

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults({ products: [], searchQuery: "" });
  };

  const toggleSearchModel = () => {
    setIsSearchModelOpen(!isSearchModelOpen);
    if (!isSearchModelOpen) {
      clearSearch();
    }
  };

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim() !== "") {
        try {
          const [
            newArrivalResponse,
            featuredResponse,
            kidsResponse,
            mensResponse,
            womensResponse,
          ] = await Promise.all([
            axios.get(
              `${API_URL}/api/new-arrival-products?populate[ColorVariants][populate]=*`,
              {
                params: { _q: searchQuery },
                headers: { Authorization: `Bearer ${API_TOKEN}` },
              }
            ),
            axios.get(
              `${API_URL}/api/featured-products?populate[ColorVariants][populate]=*`,
              {
                params: { _q: searchQuery },
                headers: { Authorization: `Bearer ${API_TOKEN}` },
              }
            ),
            axios.get(
              `${API_URL}/api/kids-products?populate[ColorVariants][populate]=*`,
              {
                params: { _q: searchQuery },
                headers: { Authorization: `Bearer ${API_TOKEN}` },
              }
            ),
            axios.get(
              `${API_URL}/api/mens-products?populate[ColorVariants][populate]=*`,
              {
                params: { _q: searchQuery },
                headers: { Authorization: `Bearer ${API_TOKEN}` },
              }
            ),
            axios.get(
              `${API_URL}/api/womens-products?populate[ColorVariants][populate]=*`,
              {
                params: { _q: searchQuery },
                headers: { Authorization: `Bearer ${API_TOKEN}` },
              }
            ),
          ]);

          const newArrivalProducts = newArrivalResponse.data?.data || [];
          const featuredProducts = featuredResponse.data?.data || [];
          const kidsProducts = kidsResponse.data?.data || [];
          const mensProducts = mensResponse.data?.data || [];
          const womensProducts = womensResponse.data?.data || [];

          const allProducts = [
            ...newArrivalProducts,
            ...featuredProducts,
            ...kidsProducts,
            ...mensProducts,
            ...womensProducts,
          ];

          const formattedResults = allProducts.map((product) => {
            const attributes = product.attributes;
            return {
              id: product.id,
              name: attributes.Name,
              description: attributes.Description,
              createdAt: attributes.createdAt,
              updatedAt: attributes.updatedAt,
              publishedAt: attributes.publishedAt,
              slug: attributes.slug,
              colorVariants: attributes.ColorVariants.map((variant) => ({
                id: variant.id,
                color: variant.Color,
                price: variant.Price,
                originalPrice: variant.originalPrice,
                OriginalPrice: variant.OriginalPrice,
                stocks: variant.Stocks,
                images: variant.Images.data.map((image) => ({
                  id: image.id,
                  name: image.attributes.name,
                  alternativeText: image.attributes.alternativeText,
                  caption: image.attributes.caption,
                  width: image.attributes.width,
                  height: image.attributes.height,
                  formats: image.attributes.formats,
                  hash: image.attributes.hash,
                  ext: image.attributes.ext,
                  mime: image.attributes.mime,
                  size: image.attributes.size,
                  url: image.attributes.url,
                  previewUrl: image.attributes.previewUrl,
                  provider: image.attributes.provider,
                  providerMetadata: image.attributes.provider_metadata,
                  createdAt: image.attributes.createdAt,
                  updatedAt: image.attributes.updatedAt,
                })),
              })),
            };
          });

          setSearchResults({ products: formattedResults, searchQuery });
        } catch (error) {
          console.error("Error searching products:", error);
          setSearchResults({ products: [], searchQuery });
        }
      } else {
        setSearchResults({ products: [], searchQuery: "" });
      }
    };

    const debounce = setTimeout(() => {
      searchProducts();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const navigation = [
    { title: "Men", path: "/collections/category/men's-wear" },
    { title: "Women", path: "/collections/category/women's-wear" },
    { title: "Kids", path: "/collections/category/kid's-wear" },
  ];

  const handleIncrease = async (id, color, size, price) => {
    const key = `${id}-${color}-${size}`;
    setUpdatingItems(prev => ({ ...prev, [key]: true }));
    try {
      const item = cartItems.find(
        (item) => item.id === id && item.color === color && item.size === size
      );
      if (item) {
        await updateQuantity(id, color, size, item.quantity + 1);
      }
    } finally {
      setUpdatingItems(prev => ({ ...prev, [key]: false }));
    }
  };
  
  const handleDecrease = async (id, color, size, price) => {
    const key = `${id}-${color}-${size}`;
    setUpdatingItems(prev => ({ ...prev, [key]: true }));
    try {
      const item = cartItems.find(
        (item) => item.id === id && item.color === color && item.size === size
      );
      if (item && item.quantity > 1) {
        await updateQuantity(id, color, size, item.quantity - 1);
      }
    } finally {
      setUpdatingItems(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleProductClick = (cartItems) => {
    setCloseMenu(true);
    setIsSheetOpen(false);
    navigate(`/cart`, {
      state: {
        cartItems,
      },
    });
  };
  const handleProductClickCheckout = (cartItems) => {
    setCloseMenu(true);
    setIsSheetOpen(false);
    navigate(`/checkout`, {
      state: {
        cartItems,
      },
    });
  };

  return (
    <nav className="bg-white fixed top-0 z-[1] border-b md:pb-2 lg:pb-0 w-full md:text-sm">
      <div className="items-center px-4 max-w-screen-xl mx-auto md:px-8">
        <div className="flex md:w-full items-center justify-between py-2.5 md:py-5 lg:py-2.5">
          <a href="/">
            <h1 className="font-bold lg:text-lg">HR STORE</h1>
          </a>
          <div className="flex justify-start items-center gap-2 md:gap-4 lg:gap-6">
            <div className="search-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
                onClick={toggleSearchModel}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.5 2a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8.5a8.5 8.5 0 1115.2 5.3l4.5 4.5a1 1 0 11-1.4 1.4l-4.5-4.5A8.5 8.5 0 010 8.5z"
                  fill="currentColor"
                />
              </svg>
              <div
                className={`search-model justify-center ${
                  isSearchModelOpen ? "flex" : "hidden"
                } items-center gap-2 absolute top-1.5 left-0 z-10 w-full h-[55px] px-4 py-1.5 bg-white`}
              >
                <div className="s_bar w-[20rem] flex justify-between items-center h-full px-3 py-6 rounded-lg bg-[#ededed]">
                  <i className="ri-search-line text-xl text-[#a5a5a5]"></i>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    className="flex-grow px-3 py-2 bg-transparent outline-none text-black"
                  />
                  {searchQuery && (
                    <span onClick={clearSearch} className="cursor-pointer">
                      <i className="ri-close-circle-line text-xl text-[#a5a5a5]"></i>
                    </span>
                  )}
                </div>
                <div
                  onClick={toggleSearchModel}
                  className="s_close-btn flex cursor-pointer justify-center items-center w-[7rem] h-full rounded-md bg-[#926a54]"
                >
                  <i className="ri-close-large-fill text-white text-xl"></i>
                </div>
              </div>
              {searchResults.products.length > 0 && isSearchModelOpen && (
                <SearchResults
                  results={searchResults}
                  onClose={toggleSearchModel}
                />
              )}
            </div>
            <div className="profile">
              <div className="w-fit text-right">
                <Menu>
                  <MenuButton className="inline-flex items-center gap-2 rounded-md py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="22"
                      viewBox="0 0 20 22"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6 12.5C3.79086 12.5 2 14.2909 2 16.5V19.3222C2.00529 19.3253 2.01096 19.3286 2.01701 19.332C2.16716 19.4163 2.44197 19.5 2.8 19.5H17.2C17.558 19.5 17.8328 19.4163 17.983 19.332C17.989 19.3286 17.9947 19.3253 18 19.3222V16.5C18 14.2909 16.2091 12.5 14 12.5H6ZM18.0684 19.2726C18.0689 19.2727 18.0659 19.2763 18.0578 19.283C18.0637 19.2758 18.0678 19.2725 18.0684 19.2726ZM1.93164 19.2726C1.9322 19.2725 1.93626 19.2758 1.94214 19.283C1.93403 19.2763 1.93108 19.2727 1.93164 19.2726ZM0 16.5C0 13.1863 2.68629 10.5 6 10.5H14C17.3137 10.5 20 13.1863 20 16.5V19.4888C20 20.2904 19.4323 20.8118 18.9626 21.0756C18.4612 21.3573 17.836 21.5 17.2 21.5H2.8C2.16393 21.5 1.53875 21.3573 1.03741 21.0756C0.567701 20.8118 0 20.2904 0 19.4888V16.5Z"
                        fill="black"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 2.5C8.34315 2.5 7 3.84315 7 5.5C7 7.15685 8.34315 8.5 10 8.5C11.6569 8.5 13 7.15685 13 5.5C13 3.84315 11.6569 2.5 10 2.5ZM5 5.5C5 2.73858 7.23858 0.5 10 0.5C12.7614 0.5 15 2.73858 15 5.5C15 8.26142 12.7614 10.5 10 10.5C7.23858 10.5 5 8.26142 5 5.5Z"
                        fill="black"
                      />
                    </svg>
                  </MenuButton>

                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="w-52 z-[2] origin-top-right shadow-black rounded-xl border border-black/10 bg-white p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                  >
                    <MenuItem>
                      <div className="Login-and-my-account_btn">
                        {isLoggedIn ? (
                          <button className="myAccount group flex w-full font-medium items-center text-black gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 1792 1792"
                              className="size-4"
                            >
                              <path d="M1600 1405q0 120-73 189.5t-194 69.5h-874q-121 0-194-69.5t-73-189.5q0-53 3.5-103.5t14-109 26.5-108.5 43-97.5 62-81 85.5-53.5 111.5-20q9 0 42 21.5t74.5 48 108 48 133.5 21.5 133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5t-271.5 112.5-271.5-112.5-112.5-271.5 112.5-271.5 271.5-112.5 271.5 112.5 112.5 271.5z" />
                            </svg>
                            My Account
                            <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                              ⌘E
                            </kbd>
                          </button>
                        ) : (
                          <button className="login group flex w-full items-center font-medium text-black gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              className="size-4"
                            >
                              <path d="M8,0C5.239,0,3,2.239,3,5v1H2v10h12V6h-1V5C13,2.239,10.761,0,8,0z M12,6H4V5c0-2.206,1.794-4,4-4s4,1.794,4,4V6z" />
                            </svg>
                            Login
                            <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                              ⌘E
                            </kbd>
                          </button>
                        )}
                      </div>
                    </MenuItem>
                    <MenuItem>
                      <div className="creat-account-and-logout">
                        {!isLoggedIn ? (
                          <button className="create-account group flex font-medium w-full whitespace-nowrap items-center text-black gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 1792 1792"
                              className="size-4"
                            >
                              <path d="M1600 1405q0 120-73 189.5t-194 69.5h-874q-121 0-194-69.5t-73-189.5q0-53 3.5-103.5t14-109 26.5-108.5 43-97.5 62-81 85.5-53.5 111.5-20q9 0 42 21.5t74.5 48 108 48 133.5 21.5 133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5t-271.5 112.5-271.5-112.5-112.5-271.5 112.5-271.5 271.5-112.5 271.5 112.5 112.5 271.5z" />
                            </svg>
                            Create Account
                            <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                              ⌘D
                            </kbd>
                          </button>
                        ) : (
                          <button className="logout group flex w-full font-medium whitespace-nowrap items-center text-black gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 1792 1792"
                            >
                              <path d="M704 1440q0 4 1 20t.5 26.5-3 23.5-10 19.5-20.5 6.5h-320q-119 0-203.5-84.5t-84.5-203.5v-704q0-119 84.5-203.5t203.5-84.5h320q13 0 22.5 9.5t9.5 22.5q0 4 1 20t.5 26.5-3 23.5-10 19.5-20.5 6.5h-320q-66 0-113 47t-47 113v704q0 66 47 113t113 47h312l11.5 1 11.5 3 8 5.5 7 9 2 13.5zm928-544q0 26-19 45l-544 544q-19 19-45 19t-45-19-19-45v-288h-448q-26 0-45-19t-19-45v-384q0-26 19-45t45-19h448v-288q0-26 19-45t45-19 45 19l544 544q19 19 19 45z" />
                            </svg>
                            Log out
                            <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                              ⌘D
                            </kbd>
                          </button>
                        )}
                      </div>
                    </MenuItem>
                    <div className="my-1 h-px bg-white/5" />
                  </MenuItems>
                </Menu>
              </div>
            </div>
            <div className="basket mr-4">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <a
                    className="focus-inset flex items-center md:gap-2 justify-center underline-remove bubble-center wbhcart withtext cursor-pointer"
                    role="button"
                    aria-haspopup="dialog"
                  >
                    <span className="svgbg">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 19 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M-0.000244141 5.91504C-0.000244141 5.36275 0.447471 4.91504 0.999756 4.91504H17.9489C18.5012 4.91504 18.9489 5.36275 18.9489 5.91504V19.3049C18.9489 20.7932 17.7423 21.9998 16.254 21.9998H2.69467C1.20633 21.9998 -0.000244141 20.7932 -0.000244141 19.3049V5.91504ZM1.99976 6.91504V19.3049C1.99976 19.6886 2.3109 19.9998 2.69467 19.9998H16.254C16.6378 19.9998 16.9489 19.6886 16.9489 19.3049V6.91504H1.99976Z"
                          fill="black"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M9.47449 2C8.15461 2 7.08466 3.06995 7.08466 4.38983V7.61017C7.08466 8.16245 6.63694 8.61017 6.08466 8.61017C5.53237 8.61017 5.08466 8.16245 5.08466 7.61017V4.38983C5.08466 1.96538 7.05004 0 9.47449 0C11.8989 0 13.8643 1.96538 13.8643 4.38983V7.61017C13.8643 8.16245 13.4166 8.61017 12.8643 8.61017C12.312 8.61017 11.8643 8.16245 11.8643 7.61017V4.38983C11.8643 3.06995 10.7944 2 9.47449 2Z"
                          fill="black"
                        />
                      </svg>
                    </span>
                    <div className="cart-count flex">
                      <span className="mobile-hide hidden md:block text-sm lg:text-lg">
                        Cart
                      </span>
                      <sup className="wbhcartitem lg:hidden">
                        &nbsp;({cartItems.length})
                      </sup>
                      <span className="hidden lg:block">
                        &nbsp;({cartItems.length})
                      </span>
                    </div>
                  </a>
                </SheetTrigger>
                <SheetContent className="flex flex-col h-full">
                  <SheetHeader>
                    <SheetTitle className="Fira text-[20px] leading-none opacity-75 mt-2">
                      Your Cart ({cartItems.length})
                    </SheetTitle>
                  </SheetHeader>
                  {cartItems.length === 0 ? (
                    <div className="flex-grow overflow-y-auto pb-20 mt-4">
                      <EmptyCartAnimation />
                    </div>
                  ) : (
                    <div className="flex-grow overflow-y-auto pb-20 mt-4">
                      {cartItems.map((item) => {
                        const imageSrc =
                          item.image.url ||
                          item.image.imageSrc ||
                          `${API_URL}${
                            item.image.url || item.image.imageSrc
                          }` ||
                          "https://placehold.co/200";
                        return (
                          <div
                            key={`${item.id}-${item.color}-${item.size}`}
                            className="flex items-center gap-4 py-4 border-t"
                          >
                            <ProductImage src={imageSrc} alt={item.name} />
                            <div className="ProductDetails flex-1">
                              <h1 className="Asul text-[16px] text-[#100b09] capitalize leading-[20px] productName">
                                {item.name}
                              </h1>
                              <h1 className="Fira font-medium text-[14px] leading-[20px] mt-1 text-[#0009] productColor">
                                Color:{" "}
                                <span className="text-[#000] font-medium">
                                  {item.color}
                                </span>
                              </h1>
                              <h1 className="Fira font-medium text-[14px] leading-[20px] mt-1 text-[#0009] productSize">
                                Size:{" "}
                                <span className="text-[#000] font-medium">
                                  {item.size}
                                </span>
                              </h1>
                              <h1 className="Fira productPrice text-[14px] leading-[20px] font-bold mt-2">
                              &#x20b9; {item.price * item.quantity}.00
                              </h1>
                              <div className="edit-remove flex my-2 ml-1 gap-3">
                                <button
                                  onClick={() =>
                                    removeFromCart(
                                      item.id,
                                      item.color,
                                      item.size
                                    )
                                  }
                                  className="Fira text-[13px] outline-none border-none text-[#928e8e] leading-[20px] cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                              <div className="mobile-quantity mt-2 md:hidden">
                                <QuantityControl
                                  quantity={item.quantity}
                                  onIncrease={() =>
                                    handleIncrease(
                                      item.id,
                                      item.color,
                                      item.size
                                    )
                                  }
                                  onDecrease={() =>
                                    handleDecrease(
                                      item.id,
                                      item.color,
                                      item.size
                                    )
                                  }
                                  isUpdating={updatingItems[`${item.id}-${item.color}-${item.size}`]}
                                />
                              </div>
                            </div>
                            <div className="quantity hidden md:block">
                              <QuantityControl
                                quantity={item.quantity}
                                onIncrease={() =>
                                  handleIncrease(item.id, item.color, item.size)
                                }
                                onDecrease={() =>
                                  handleDecrease(item.id, item.color, item.size)
                                }
                                isUpdating={updatingItems[`${item.id}-${item.color}-${item.size}`]}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <SheetFooter>
                    <div className="cartFooter absolute px-3 bottom-0 left-0 w-full h-[100px] lg:h-[120px] bg-[#f3f4f6]">
                      <div className="subtotal flex justify-between items-center mt-1 md:mt-3 p-1">
                        <h1 className="Asul text-[16px] font-medium text-[#100b09] capitalize leading-[20px]">
                          Subtotal ({cartItems.length})
                        </h1>
                        <h1 className="Fira productPrice text-[16px] leading-[20px] font-bold">
                          &#x20b9;
                          {cartItems
                            .reduce(
                              (total, item) =>
                                total + item.price * item.quantity,
                              0
                            )
                            .toFixed(2)}
                        </h1>
                      </div>
                      <div className="view-cart_checkout mt-2 flex items-center justify-between gap-3">
                        <button
                          onClick={() => handleProductClick(cartItems)}
                          className="Fira w-1/2 outline-none border-none font-normal text-[16px] leading-[20px] rounded-lg py-3 px-11 bg-[#926a54] text-white"
                        >
                          View Cart
                        </button>
                        <button
                        onClick={() => handleProductClickCheckout(cartItems)}
                        className="Fira w-1/2 font-normal text-[16px] leading-[20px] rounded-lg py-3 px-11 bg-[#926a5419] border border-[#e0d8d4]">
                          Checkout
                        </button>
                      </div>
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
            <button
              className="text-gray-800 lg:hidden"
              onClick={() => setState(!state)}
            >
              {state ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 font-bold"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div
          className={`flex-1 pb-3 mt-8 h-screen md:h-full md:pb-0 md:mt-0 ${
            state ? "block" : "hidden"
          }`}
        >
          <ul className="justify-end items-center space-y-6 md:flex md:space-x-6 md:space-y-0">
            {navigation.map((item, idx) => {
              return (
                <li key={idx} className="text-gray-700 hover:text-[#926a54]">
                  <div className="items-flex flex justify-between items-center">
                    <a href={item.path} className="block font-medium uppercase">
                      {item.title}
                    </a>
                    <HiOutlineArrowLongRight className="font-medium text-xl md:hidden" />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};
