import React from "react";
import "../styles/pages/Register.scss";
import { useState } from "react";
import { User, registerError } from "../utils/Interfaces";
import axios from "axios";
import { redirect } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState<User>();
  const [error, setError] = useState<registerError>();

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
        console.log(response.data);
      })
      .then((data) => console.log(data))
      .catch((error) => console.log(error));

    /*  if (response.status === 200) {
        localStorage.setItem("auth", String(true));
        return redirect("/");
      } */
  };

  return (
    <div className="register">
      {error?.state && <div className="error">{error.message}</div>}
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
            type="text"
            name="password"
            onChange={(e) => handleChange(e)}
            required
          />
          <span>Password</span>
        </div>
        <div className="second-password">
          <input
            type="text"
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
