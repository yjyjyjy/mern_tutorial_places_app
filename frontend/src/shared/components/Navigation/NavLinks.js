import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.currentUserId}/places`}>MY PLACES</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACES</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button to="/" onClick={auth.logout}>LOG OUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
