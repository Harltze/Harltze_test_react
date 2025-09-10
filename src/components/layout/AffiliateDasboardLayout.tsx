import React, { useMemo } from "react";
import { NavLink, useNavigate } from "react-router";
import { authStore } from "../../../store/authStore";
import {decodeJwt} from "jose";

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

export default function AffiliateDasboardLayout({
  children,
  header,
  searchAction,
  searchPlaceholder,
  searchValue,
  setSearchValue,
  showSearch,
  addTopPadding = true,
}: Props) {
  const activeNavbarButtonStyle = "text-primary bg-white";
  const inactiveNavbarButtonStyle = "text-white bg-transparent";
  const navbarDefaultStyle = "py-2 w-full rounded-md px-4";

  const navigate = useNavigate();

  const userDetails = authStore(state => state.userDetails);
  const isLogggedInStore = authStore(state => state.isLoggedIn);
  const removeUser = authStore(state => state.removeUser);

  // console.log("userDetails", userDetails);

  if(userDetails.role == "customer") {
    navigate("/");
  }

  const isLoggedIn = useMemo(() => {

    if(!userDetails.jwt) return false;

      const token = decodeJwt(userDetails.jwt);
  
      // console.log("token", token);
  
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

  const logOut = () => {
    removeUser();
    navigate("/admin/login");
  }

  return (
    <div className="h-screen w-full flex">
      <div className="w-[20%] border-r h-full bg-primary px-4 flex flex-col gap-4 py-10 font-bold text-white">
        <div className="mb-10 text-[25px]">Harltze Affiliate</div>
        <NavLink
          to="/affiliate/products"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Products
        </NavLink>
        {/* <NavLink
          to="/affiliate/referals"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Referals
        </NavLink> */}
        <NavLink
          to="/affiliate/earning"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Earning
        </NavLink>
        {/* <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Pending Orders
        </NavLink>
        <NavLink
          to="/admin/gallery"
          className={({ isActive }) =>
            (isActive ? activeNavbarButtonStyle : inactiveNavbarButtonStyle) +
            " " +
            navbarDefaultStyle
          }
        >
          Gallery
        </NavLink> */}
        <button onClick={logOut} className="text-left py-2 w-full rounded-md px-4">
          Log Out
        </button>
      </div>
      <div className="w-[80%] h-full">
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

          <div className="w-[200px] flex gap-4 items-center">
          <img
                      className="w-[40px] h-[40px] rounded-full"
                      src={
                        !userDetails.profilePicture
                          ? "/avatar.png"
                          : userDetails.profilePicture
                      }
                    />
            <div className="text-[20px] font-medium">{userDetails.fullName}</div>
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
