import React from "react";
import { NavItemInter } from "../../utils/Interfaces";
import { Link } from "react-router-dom";

function NavItems(props: NavItemInter) {
  return (
    <Link className="nav-item" to={props.path}>
      {props.text}
    </Link>
  );
}

export default NavItems;
