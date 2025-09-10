import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { PiCaretDownBold } from "react-icons/pi";
import { authStore, UserDetails } from '../../store/authStore';
import { NavLink } from "react-router";

interface NavButton {
  name: string;
  path: string;
}

interface Props {
  handleClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleClose: () => void;
  open: boolean;
  isMenuShowing: boolean;
  isLoggedIn: boolean;
  anchorEl: null | HTMLElement;
  userDetails: UserDetails;
}

export default function NavButton({handleClick, handleClose, open, userDetails, anchorEl, isMenuShowing, isLoggedIn}: Props) {

  const logOut = authStore((state) => state.removeUser);

  const navButtons: NavButton[] = [
    // { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About", path: "/aboutus" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact", path: "/contactus" },
    { name: "FAQs", path: "/faqs" },
  ];

  const activeNavbarButtonStyle =
      "bg-white w-full text-primary rounded-md lg:border-b lg:border-b-white lg:border-b-2 lg:border-b-solid lg:text-white lg:rounded-none lg:bg-primary font-bold";
    const inactiveNavbarButtonStyle = "text-white";
    const navbarDefaultStyle = "px-[8px] py-[4px]";

  return (
    <ul
        className={`${isMenuShowing
            ? "flex flex-col top-[65px] left-0 w-full bg-primary text-white items-center gap-4 py-4 rounded-b-xl"
            : "hidden"
          } lg:flex lg:relative lg:flex md:justify-between lg:flex-row lg:items-center lg:font-normal lg:m-0lg: p-0 lg:gap-4`}
      >
        {navButtons.map((navButton: NavButton) => (
          <li style={{ textDecoration: "none", zIndex: 200 }}>
            <NavLink
              to={navButton.path}
              className={({ isActive }) =>
                (isActive
                  ? activeNavbarButtonStyle
                  : inactiveNavbarButtonStyle) +
                " " +
                navbarDefaultStyle
              }
            >
              {navButton.name}
            </NavLink>
          </li>
        ))}
        {!isLoggedIn ? (
          <>
            <li style={{ textDecoration: "none" }}>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  (isActive
                    ? activeNavbarButtonStyle
                    : inactiveNavbarButtonStyle) +
                  " " +
                  navbarDefaultStyle
                }
              >
                Login
              </NavLink>
            </li>
            <li style={{ textDecoration: "none" }}>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  (isActive
                    ? activeNavbarButtonStyle
                    : inactiveNavbarButtonStyle) +
                  " " +
                  navbarDefaultStyle
                }
              >
                Register
              </NavLink>
            </li>
          </>
        ) : (
          <>
            <button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
              className="text-white"
            >
              <div className="text-white flex gap-[20px] items-center">
                <div className="text-white flex gap-[10px] items-center">
                  <img
                    className="w-[40px] h-[40px] rounded-full"
                    src={
                      !userDetails.profilePicture
                        ? "/avatar.png"
                        : userDetails.profilePicture
                    }
                  />
                  <div className="text-[20px]">{userDetails.fullName}</div>
                  <PiCaretDownBold color="white" size={20} />
                </div>
              </div>
            </button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={handleClose}>
                <NavLink to="/profile">
                  Profile
                </NavLink>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <NavLink to="/orderhistory">
                  Order History
                </NavLink>
              </MenuItem>
              <MenuItem style={{ textDecoration: "none" }}
                className="text-white"
                onClick={logOut}>
                Log Out
              </MenuItem>
            </Menu>
            {/* <li style={{ textDecoration: "none" }} className="text-white">
              
            </li>
            <li
              style={{ textDecoration: "none" }}
              className="text-white"
              onClick={logOut}
            >
              Log Out
            </li> */}
            {/* <li style={{ textDecoration: "none" }}>
              
            </li> */}
          </>
        )}
      </ul>
  )
}
