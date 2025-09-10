import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { authStore } from "../../store/authStore";
import { cartStore } from "../../store/cartStore";
import { decodeJwt } from "jose";
import NavButton from "./NavButton";
import PromotionBanner from "./PromotionBanner";
import { CMSInterface } from "../pages/adminpages/cms-settings";
import { useCMS } from "../../hooks/useCMS";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/errorHandler";

export default function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMenuShowing, setMenuShowing] = useState(false);
  const [search, setSearch] = useState(searchParams.get("query") || "");

  const cart = cartStore((state) => state.cart);

  const isLoggedInStore = authStore((state) => state.isLoggedIn);

  const userDetails = authStore((state) => state.userDetails);

  const loc = useLocation();

  const navigate = useNavigate();

  const [cms, setCMS] = useState<CMSInterface | null>(null);

  const {getCMSRecord} = useCMS();
const fetchCMS = async () => {
    try {
      const cmsContent = await getCMSRecord();
      setCMS(cmsContent.data.result);
      console.log(cmsContent.data.result);
    } catch (error) {
      toast.error(errorHandler(error, "Contents failed to load, kindly refresh this page..."));
    }
  }

  useEffect(() => {
    if(search.length == 0) {
      setSearch(searchParams.get("query") ? searchParams.get("query")!! : "");
      setSearchParams(prevValue => {
        prevValue.delete('query');
        return prevValue;
      });
    }
  }, [search]);

  useEffect(() => {
    fetchCMS();
  }, []);

  // const handleKeyDown = (e: any) => {
  //   console.log(e.key);
  //   if(e.key == "Enter") {

  //     if(loc.pathname.includes("studio") || loc.pathname.includes("products")) {
  //       setSearchParams(prevValue => {
  //       prevValue.set('query', search);
  //       return prevValue;
  //     });
  //     } else {
  //       const currentSearchParams = new URLSearchParams(location.search);
  //       currentSearchParams.set("query", search);
  //       navigate(`/products?${currentSearchParams.toString()}`);
  //       // navigate(`/products?query=${search}`);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   setSearch(searchParams?.get("query") ? searchParams?.get("query")!! : "");
  // }, [loc.search]);

  const toggleShowMenu = () => {
    setMenuShowing(!isMenuShowing);
  };

  const isLoggedIn = useMemo(() => {
    if (!userDetails.jwt) return false;

    const token = decodeJwt(userDetails.jwt);

    // console.log("token", token);

    if (isLoggedInStore) {
      if (Date.now() < token!!.exp!! * 1000) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    console.log("userDetails", userDetails);
  }, [isLoggedInStore, userDetails]);

  const toggleCart = () => {
    if (loc.pathname == "/cart") {
      navigate(searchParams.get("from") || "/products");
    } else {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('from', loc.pathname);
      navigate(`/cart?${newSearchParams.toString()}`);
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
    <header className="bg-primary px-10 xl:px-[140px]">
      <nav className="flex justify-between items-center h-[65px]">
        <div className="flex flex-row gap-1 items-center">
          {/* <img
          src="/thraustlogo.png"
          className="h-[40px] w-[40px]"
          alt="Harltze Logo"
        /> */}
          <button
            className="bg-primary p-[10px] cursor-pointer block lg:hidden"
            onClick={toggleShowMenu}
          >
            {!isMenuShowing ? (
              <GiHamburgerMenu color="white" size={35} className="ml-[-10px]" />
            ) : (
              <IoClose color="white" size={35} className="ml-[-15px]" />
            )}
          </button>
          <div className="text-[1.5rem] text-white font-bold">
            {/* <h1><Link to={"/"}>HARLTZE</Link></h1> */}
            <Link to={"/"}><img src="/HARLTZE LOGO-1.png" className="h-[40px] w-[40px]" /></Link>
          </div>
        </div>

        <div className="hidden lg:flex">
          <NavButton
            anchorEl={anchorEl}
            handleClick={handleClick}
            handleClose={handleClose}
            isLoggedIn={isLoggedIn}
            isMenuShowing={isMenuShowing}
            open={open}
            userDetails={userDetails}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* {isLoggedIn && (
            <div
              onClick={() => {
                navigate("/profile");
              }}
            >
              <img src="/profile-icon.png" className="h-[25px] w-[25px]" />
            </div>
          )} */}
          <div onClick={toggleCart} className="relative">
            <img
              src="/cart-image.png"
              className="h-[25px] w-[35px] pr-1"
              alt="Cart Icon"
            />
            <span className="absolute top-[-0.1rem] right-[-0.5rem] bg-[#7A288A] h-[10px] w-[10px] flex justify-center items-center p-2 rounded-full text-[1rem] text-white">
              {cart.length}
            </span>
          </div>
        </div>
      </nav>
      {/* <div className="p-4 flex justify-center items-center">
        <div className="bg-white flex rounded-[40px] px-2 py-1 items-center w-[90%] md:w-[440px]">
          <img src="/search-icon.png" className="h-[15px] w-[15px]" />
          <input
            type="search"
            placeholder="SEARCH"
            value={search}
            className={`py-1 px-4 w-full`}
            onChange={(e) => {setSearch(e.target.value)}}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div> */}
      <div className="block lg:hidden">
          <NavButton
            anchorEl={anchorEl}
            handleClick={handleClick}
            handleClose={handleClose}
            isLoggedIn={isLoggedIn}
            isMenuShowing={isMenuShowing}
            open={open}
            userDetails={userDetails}
          />
        </div>
    </header>
        <PromotionBanner promotionBanner={cms?.promotionBanner} />
    </div>
  );
}
