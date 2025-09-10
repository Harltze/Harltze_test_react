import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { authStore } from "../../../store/authStore";
import {decodeJwt} from "jose";
import { IoMenu } from "react-icons/io5";
import { Drawer } from "@mui/material";
import { CgClose } from "react-icons/cg";
import {
  Box,
  Modal,
  Typography,
} from "@mui/material";

interface Props {
  children: React.ReactNode;
  header: string;
  addTopPadding?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  setSearchValue?: (e: string) => void;
  searchAction?: () => void;
  showSearch: boolean;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  borderRadius: "8px",
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AdminDasboardLayout({
  children,
  header,
  searchAction,
  searchPlaceholder,
  searchValue,
  setSearchValue,
  showSearch,
  addTopPadding = true,
}: Props) {
  // const activeNavbarButtonStyle = "text-primary bg-white";
  // const inactiveNavbarButtonStyle = "text-white bg-transparent";
  // const navbarDefaultStyle = "py-2 w-full rounded-md px-4";

  const [isExpired, setIsExpired] = useState(false);

  const jwt = authStore(state => state.userDetails.jwt);

  const logOut = authStore((state) => state.removeUser);

  const isTokenExpired = (token: string) => {
  if (!token) return true;

  const payload = decodeJwt(token);
  if (!payload || !payload.exp) {
    // If there's no payload or expiration time, the token is considered invalid or expired.
    return true;
  }

  // The 'exp' claim is in seconds, but Date.now() is in milliseconds.
  // We check if the current time is greater than the expiration time.
  const currentTime = Date.now() / 1000;
  return currentTime > payload.exp;
};

const checkToken = () => {
  if(isLoggedIn) {
    const expired = isTokenExpired(jwt);
    setIsExpired(expired);
    // if (expired) {
    //   setMessage("Token is expired.");
    // } else {
    //   setMessage("Token is valid and not expired.");
    // }
  }
  };

  const navigate = useNavigate();

  const userDetails = authStore(state => state.userDetails);
  const isLogggedInStore = authStore(state => state.isLoggedIn);
  // const removeUser = authStore(state => state.removeUser);

  const token = decodeJwt(userDetails.jwt);
  
    console.log("token", token);

  // console.log("userDetails", userDetails);

  if(userDetails.role == "customer") {
    navigate("/");
  }

  const isLoggedIn = useMemo(() => {

    if(!userDetails.jwt) return false;
  
      if(isLogggedInStore) {
        if(Date.now() < token!!.exp!! * 1000) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
  
    }, [isLogggedInStore, userDetails]);

  if(!isLoggedIn) {
    navigate("/admin/login");
  }

  // const logOut = () => {
  //   removeUser();
  //   navigate("/admin/login");
  // }

  useEffect(() => {
    // Initial check when the component mounts
    checkToken();

    // Set up the interval to run every 20 minutes (20 * 60 * 1000 milliseconds)
    const intervalId = setInterval(checkToken, 20 * 60 * 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [jwt, isLoggedIn]);

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div className="h-screen w-full flex">
      <Modal
              open={isExpired}
              onClose={logOut}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  <div>
                    <div>Your session has expired.</div>
                    <button>Log Out</button>
                  </div>
                </Typography>
              </Box>
            </Modal>
      <div className="hidden lg:block"><NavbarLinks toggleSidebar={setOpen} /></div>
      <div className="block lg:hidden">
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <NavbarLinks toggleSidebar={setOpen} />
      </Drawer>
    </div>
      <div className="w-full lg:w-[80%] h-full">
        <div className="w-full h-[65px] px-4 flex justify-between items-center">
          <div className="font-bold w-[200px] text-[20px]">{header}</div>
          {showSearch && (
            <div className="flex w-[600px] border border-2 border-primary rounded-xl overflow-hidden">
              <input
                className="w-full h-[40px] px-2"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => {setSearchValue!!(e.target.value)}}
              />
              <button
                onClick={searchAction}
                className="px-4 inline-block bg-primary text-white font-bold"
              >
                Search
              </button>
            </div>
          )}

          <div className="w-[220px] flex gap-4 items-center">
          <img
                      className="w-[40px] h-[40px] rounded-full"
                      src={
                        !userDetails.profilePicture
                          ? "/avatar.png"
                          : userDetails.profilePicture
                      }
                    />
            <div className="text-[14px] md:text-[20px] font-medium">{userDetails.fullName}</div>
            <IoMenu className="block lg:hidden" onClick={toggleDrawer(true)} size={35} />
            </div>
        </div>
        <div
          className={`w-full h-[calc(100vh_-_65px)] overflow-y-auto ${
            !addTopPadding && "pt-0"
          } p-4`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

interface NavbarProps {
  toggleSidebar: (value: boolean) => void;
}

function NavbarLinks ({toggleSidebar}: NavbarProps) {

  const navigate = useNavigate();
const removeUser = authStore(state => state.removeUser);

  const activeNavbarButtonStyle = "text-primary bg-white";
  const inactiveNavbarButtonStyle = "text-white bg-transparent";
  const navbarDefaultStyle = "py-2 w-full rounded-md px-4";
const userDetails = authStore(state => state.userDetails);

const logOut = () => {
    removeUser();
    navigate("/admin/login");
  }

  return (
    <div className="w-full border-r h-full bg-primary px-4 flex flex-col gap-4 py-10 font-bold text-white overflow-y-auto">
        <div className="mb-10 text-[25px] flex items-center justify-between">
          <div>Harltze {userDetails.role == "admin" ? "Admin" : (userDetails.role[0].toLocaleUpperCase() + userDetails.role.slice(1))}</div>
            <CgClose size={25} onClick={() => {toggleSidebar(false)}} className="block lg:hidden" />
          </div>
        {(userDetails.role == "admin" || userDetails.role == "marketer") && (<NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Home
        </NavLink>)}
        {(userDetails.role == "admin") && (<NavLink
          to="/admin/collections"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Collections
        </NavLink>)}
        {(userDetails.role == "admin") && (<NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Categories
        </NavLink>)}
        {(userDetails.role == "admin" || userDetails.role == "marketer" || userDetails.role == "affiliate") && (<NavLink
          to="/admin/products"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Products
        </NavLink>)}
        {(userDetails.role == "admin" || userDetails.role == "marketer") && (<NavLink
          to="/admin/studio"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Harltze Studio
        </NavLink>)}
        {/* {(userDetails.role == "admin") && (<NavLink
          to="/admin/cravings-summary"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Studio Cravings Summary
        </NavLink>)} */}
        {(userDetails.role == "admin" || userDetails.role == "marketer") && (<NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Pending Orders
        </NavLink>)}
        {(userDetails.role == "admin") && (<NavLink
          to="/admin/gallery"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Gallery
        </NavLink>)}
        {(userDetails.role == "admin") && (<NavLink
          to="/admin/discounts"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Discounts
        </NavLink>)}
        {(userDetails.role == "admin") && (<NavLink
          to="/admin/affiliates"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Affiliates
        </NavLink>)}
        {(userDetails.role == "admin") && (<NavLink
          to="/admin/marketers"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Marketers
        </NavLink>)}
        {(userDetails.role == "admin") && (<NavLink
          to="/admin/cms"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          CMS Settings
        </NavLink>)}
        {
          (userDetails.role == "affiliate") && (
            <NavLink
          to={"/admin/affiliate-earnings"}
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Earnings
        </NavLink>
          )
        }
        {
          (userDetails.role == "admin") && (
            <NavLink
          to={"/admin/affiliates-cashouts"}
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Affiliate's Cashouts
        </NavLink>
          )
        }
        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Profile
        </NavLink>
        <button onClick={logOut} className="text-left py-2 w-full rounded-md px-4">
          Log Out
        </button>
      </div>
  );
}
