import React, { useContext, useState } from "react";
import "./login.css";
import assets from "../assets/assets";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../UserProvider";
import { URL } from "../Constant";


const Login = () => {
  const [currentPage, setCurrentPage] = useState("Sign Up");
    const navigate = useNavigate();
    const {loginUser} = useContext(UserContext);

  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
  });

  const changePage = (value) => {
    console.log("change page logic is working")
    setCurrentPage(value);
  };

  const regiterOrLogIn = (e) => {
    
     e.preventDefault(); // stop page reload
     console.log(currentPage)
      console.log(user)
    if (currentPage === "Sign Up") {
      registerUser();
     
    }else{
      login();
    }
  };

  const registerUser =  () => {
    console.log(user)
     console.log("logic1 is working");
   

   axios.post(URL+"/user/register", user)
  .then(res => {
    console.log(res);
    console.log(res.data.statusCode)

    if (res.data.statusCode === 'OK') {
      alert(res.data.message);
      changePage("Log In")
    }else{
       alert(res.data.message);
    }
  })
  .catch(err => {
    console.log(err)
  });
  };

  const setUserObj = (field, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));
  };



  const login = () => {
     console.log(user)
     console.log("logic1 is working");
   

   axios.post(URL+"/user/login", user)
  .then(res => {
    console.log(res);
    console.log(res.data.statusCode)

    if (res.data.statusCode === 'OK') {
      console.log(user.username)
      loginUser(res.data.data.username)
      alert(res.data.message);
      localStorage.setItem("isLoggedIn", true)
      console.log( localStorage.getItem("isLoggedIn"))
      navigate("/")
    }else{
       alert(res.data.message);
    }
  })
  .catch(err => {
    console.log(err)
  });
  }
  

  return (
    <div className="login">
      <img src={assets.logo_big} alt="" className="logo" />
      <form className="login-form">
        <h2>{currentPage}</h2>
        {currentPage === "Sign Up" ? (
          <input
            type="text"
            className="form-input"
            placeholder="Username"
            value={user.username}
            required
            onChange={(e) => setUserObj("username", e.target.value)}
          />
        ) : null}
        <input
          type="email"
          placeholder="Email"
          className="form-input"
          required
          value={user.email}
          onChange={(e) => setUserObj("email", e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="form-input"
          required
          value={user.password}
          onChange={(e) => setUserObj("password", e.target.value)}
        />
        <button type="submit" onClick={(e) => regiterOrLogIn(e)}>
          {currentPage}
        </button>
        <div className="login-forgot">
          {currentPage === "Sign Up" ? (
            <p className="login-toggle">
              {" "}
              Already have an account{" "}
              <span onClick={() => changePage("Log In")}> Click Here </span>
            </p>
          ) : null}
          {currentPage === "Log In" ? (
            <p onClick={() => changePage("Sign Up")}> Register</p>
          ) : null}
        </div>
      </form>
    </div>
  );
};

export default Login;
