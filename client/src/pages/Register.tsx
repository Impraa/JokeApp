import React from "react";
import "../styles/pages/Register.scss";
import { useState } from "react";
import { User, flashMsg } from "../utils/Interfaces";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

function Register() {
  const [formData, setFormData] = useState<User>();
  const [error, setError] = useState<flashMsg>();
  const [success, setSuccess] = useState<flashMsg>();
  const [cookie, setCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const validateNames = (e: React.ChangeEvent<HTMLInputElement>) => {
    const regex = /^$|^[A-Za-z]+$/;
    if (!regex.test(e.currentTarget.value)) {
      setError({ state: true, message: "Names can not hold numbers!" });
    } else {
      setError({ state: false, message: "" });
      handleChange(e);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData?.password !== formData?.confirmPassword) {
      return setError({ state: true, message: "Passwords are not matching!" });
    } else {
      setError({ state: false, message: "" });
    }

    axios
      .post("http://localhost:3000/register", formData, {
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
            message: "Registered successfuly you will be redirected shortly!",
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
    <div className="register">
      {error?.state && <div className="error">{error.message}</div>}
      {success?.state && <div className="success">{success.message}</div>}
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="first-name">
          <input
            type="text"
            name="fName"
            onChange={(e) => validateNames(e)}
            required
          />
          <span>First Name</span>
        </div>
        <div className="last-name">
          <input
            type="text"
            name="lName"
            onChange={(e) => validateNames(e)}
            required
          />
          <span>Last Name</span>
        </div>
        <div className="email">
          <input
            type="email"
            name="email"
            required
            onChange={(e) => handleChange(e)}
          />
          <span>Email</span>
        </div>
        <div className="first-password">
          <input
            type="password"
            name="password"
            onChange={(e) => handleChange(e)}
            required
          />
          <span>Password</span>
        </div>
        <div className="second-password">
          <input
            type="password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
            required
          />
          <span>Confirm Password</span>
        </div>
        <button>Register</button>
      </form>
    </div>
  );
}

export default Register;
