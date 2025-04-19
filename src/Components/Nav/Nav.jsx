
import React from "react";
import { Link , Outlet} from "react-router-dom";
import styles from "../Styles/Nav.module.css";
import { useUserContext } from "../../userContext";

const Navbar = ()  => {

  const {user, logout} = useUserContext();
// console.log("user", user);
  // console.log("authenticate", {authenticate});
  return (
    <>
    <nav className={styles.nav}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>BuyBusy</Link>
        <Link to="/" className={styles.navItem}>Home</Link>
      </div>
      <div className={styles.right}>
      {user ? (
        <>
        <Link to="/orders" className={styles.signIn}>My orders</Link>
        <Link to="/cart" className={styles.signIn}>My Cart</Link>
        <Link to="/" className={styles.signIn} onClick={logout}>Logout</Link>
        </>
      ) : (
        <Link to="/login" className={styles.signIn}>Sign In</Link>
      )}
       
      </div>
    </nav>
    <Outlet />
    </>
  );
}

export default Navbar;
