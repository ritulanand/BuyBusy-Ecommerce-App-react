import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Styles/Login.module.css";
import {useUserContext} from "../../userContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");




const {authenticateUser} = useUserContext();
// console.log("auth",authenticateUser);



const handleSubmit = async (e) => {
    e.preventDefault();
    // if(username.trim()==="" || password.trim()===""){
    //     toast.error("Please Enter Username and Password");
    // }
    // else{
        await authenticateUser(email, password);
        
       
    // }
}

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Login</h2>
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
