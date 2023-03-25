import React, { useEffect, useState } from "react";
import { NavItemInter } from "../utils/Interfaces";
import { Squeeze as Hamburger } from "hamburger-react";
import NavTitle from "./components/NavTitle";
import NavItems from "./components/NavItem";
import "../styles/layout/Navbar.scss";
import { useCookies } from "react-cookie";
import axios from "axios";

const NavItem: NavItemInter[] = [
  { text: "Home", path: "/" },
  { text: "Get a Joke", path: "/getJoke" },
];

const UserItem: NavItemInter[] = [
  { text: "Login", path: "/login" },
  { text: "Register", path: "/register" },
];

function Navbar() {
  const [style, setStyle] = useState<boolean>(false);
  const [cookie, setCookie, removeCookie] = useCookies(["token"]);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    window.onresize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/logout", cookie, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          removeCookie("token");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={style ? "opened navbar" : "navbar"}>
      <div className="title-and-hamburger">
        <NavTitle />
        <span className={windowSize.width < 1024 ? "show-ham" : "hide-ham"}>
          <Hamburger
            onToggle={(toggled) => {
              if (toggled) {
                setStyle(true);
              } else {
                setStyle(false);
              }
            }}
            color="black"
            easing="ease-out"
            rounded
          />
        </span>
      </div>
      <div className={style ? "show links" : "hide links"}>
        {NavItem.map((navitem: NavItemInter, i: number) => {
          return <NavItems key={i} {...navitem} />;
        })}
      </div>

      {cookie.token ? (
        <form onSubmit={(e) => handleSubmit(e)}>
          <button className={style ? "show logout" : "hide logout"}>
            Logout
          </button>
        </form>
      ) : (
        <div className={style ? "show links" : "hide links"}>
          {UserItem.map((navitem: NavItemInter, i: number) => {
            return <NavItems key={i} {...navitem} />;
          })}
        </div>
      )}
    </div>
  );
}

export default Navbar;
