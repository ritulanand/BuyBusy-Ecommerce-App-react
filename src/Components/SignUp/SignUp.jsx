import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../Styles/SignUp.module.css";
import {useUserContext} from "../../userContext";

function Signup() {
    const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const {newUser} = useUserContext();
  console.log("newuser", newUser);


const handleSubmit = (e) => {
    e.preventDefault();
    newUser(name, email, password);
    navigate("/login")
}

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Signup</h2>
     
      <form className={styles.form} onSubmit={handleSubmit}>
      <input
          className={styles.input}
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button className={styles.button} type="submit">Sign Up</button>
      </form>
      
     
      <p className={styles.linkText}>
        Already have an account? <Link to="/login" className={styles.link}>Log in</Link>
      </p>
    </div>
  );
}

export default Signup;
