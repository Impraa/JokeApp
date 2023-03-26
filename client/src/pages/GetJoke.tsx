import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { flashMsg } from "../utils/Interfaces";
import axios from "axios";
import "../styles/pages/GetJoke.scss";

function GetJoke() {
  const [cookie, setCookie] = useCookies(["token"]);
  const [error, setError] = useState<flashMsg>();
  const [success, setSuccess] = useState<flashMsg>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cookie.token) {
      return navigate("/login");
    }
  }, [cookie]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();

    axios
      .post("http://localhost:3000/getJoke", cookie, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          setSuccess({
            state: true,
            message: "Joke has been sent to mail be sure to check spam!",
          });
          setTimeout(() => {
            setSuccess({ state: false, message: "" });
          }, 5000);
        }
      })
      .catch((error) => {
        setError({ state: true, message: error.response.data });
      });
  }

  return (
    <div className="get-joke">
      {error?.state && <div className="error">{error.message}</div>}
      {success?.state && <div className="success">{success.message}</div>}
      <form onSubmit={(e) => handleSubmit(e)}>
        <button>Send me a Joke</button>
      </form>
    </div>
  );
}

export default GetJoke;
