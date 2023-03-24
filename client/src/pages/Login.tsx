import React, { useState } from "react";
import { User, flashMsg } from "../utils/Interfaces";
import "../styles/pages/Login.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Login() {
  const [formData, setFormData] = useState<User>();
  const [error, setError] = useState<flashMsg>();
  const [success, setSuccess] = useState<flashMsg>();
  const [cookie, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          setCookie("token", response.data, { path: "/" });
          setSuccess({
            state: true,
            message: "Logged in successfuly you will be redirected shortly!",
          });
          setTimeout(() => {
            setSuccess({ state: false, message: "" });
            return navigate("/");
          }, 5000);
        }
      })
      .catch((error) => {
        setError({ state: true, message: error.response.data });
      });
  };

  return (
    <div className="login">
      {error?.state && <div className="error">{error.message}</div>}
      {success?.state && <div className="success">{success.message}</div>}
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="email">
          <input
            type="email"
            name="email"
            required
            onChange={(e) => handleChange(e)}
          />
          <span>Email</span>
        </div>
        <div className="password">
          <input
            type="text"
            name="password"
            onChange={(e) => handleChange(e)}
            required
          />
          <span>Password</span>
        </div>
        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
