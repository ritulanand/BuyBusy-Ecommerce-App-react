import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../Styles/SignUp.module.css";
import {useUserContext} from "../../userContext";
import { toast } from 'react-toastify';

function Signup() {
    const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {newUser} = useUserContext();
  // console.log("error sign", error);


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await newUser(name, email, password); // Attempt to create a new user
    console.log("user sign", response);
    // Wait for the error state to update and check its value
    if (response.message) {
      setError(response.message); // Set error message if there's an error   
        return;
    }else{
      toast.success("Signup Successfully");
      navigate("/login"); // Navigate to login if there's an error
    }
} catch (err) { 
    console.error("Unexpected error during signup:", err); // Log any unexpected errors
}

}

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Signup</h2>
     {error && <p className={styles.error}>{error}</p>}
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
