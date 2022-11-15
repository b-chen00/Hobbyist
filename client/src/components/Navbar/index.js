import React from "react";
import { Nav, NavLink, NavMenu }
    from "./NavBarElements";

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavMenu>
          <NavLink to="/" activeStyle>
            All
          </NavLink>
          <NavLink to="/profile" activeStyle>
            Profile
          </NavLink>
          <NavLink to="/create" activeStyle>
            Create
          </NavLink>
          <NavLink to="/login" activeStyle>
            Login
          </NavLink>
          <NavLink to="/register" activeStyle>
            Register
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
