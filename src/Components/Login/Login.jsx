import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Styles/Login.module.css";
import {useUserContext} from "../../userContext";
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");




const {authenticateUser } = useUserContext();
// console.log("error",error);
  const navigate = useNavigate();




const handleSubmit = async (e) => {
    e.preventDefault();
    // if(username.trim()==="" || password.trim()===""){
    //     toast.error("Please Enter Username and Password");
    // }
    // else{
    try{
      const response = await authenticateUser(email, password);
      if(response.message){
        setError(response.message); // Set error message if there's an error
        return;
      }else{
        toast.success("Login Successfully");
        navigate("/");
      }
      
    }catch(error){
      console.log("error", error);
  }
       
    // }
}

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className={styles.button} type="submit">Log In</button>
      </form>
      <p className={styles.linkText}>
        Don't have an account? <Link to="/signup" className={styles.link}>Sign up</Link>
      </p>
    </div>
  );
}

export default Login;
