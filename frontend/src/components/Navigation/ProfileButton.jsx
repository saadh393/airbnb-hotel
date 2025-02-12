import styles from "./navigation.module.css";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle, FaBars } from "react-icons/fa";
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal.jsx";
import SignupFormModal from "../SignupFormModal/SignupFormModal.jsx";
import { Link, NavigationType } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import HamburgerIcon from "../../svg/hamburger-icon.jsx";

function ProfileButton({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(false);
    navigate("/");
  };

  const ulClassName = `${styles.profileDropdown} ${
    !showMenu ? styles.hidden : ""
  }`;

  return (
    <div className={styles.profileButtonContainer}>
      <button onClick={toggleMenu} className={styles.profileButton}>
        <FaBars size={15} />
        <FaUserCircle />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <li>
              <div className={styles.profileCard}>
                <div className={styles.profileAvatar}>S</div>
                <div className={styles.profileRow}>
                  <p className={styles.userName}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p className={styles.userEmail}>{user.email}</p>
                </div>
              </div>
            </li>
            <li className={styles.menu}>
              <Link to="/manageSpots" onClick={() => setShowMenu(false)}>
                Manage Spots
              </Link>
            </li>
            <li className={styles.menu}>
              <Link to="/manageReviews" onClick={() => setShowMenu(false)}>
                Manage Reviews
              </Link>
            </li>
            <li className={styles.menu}>
              <button onClick={logout}>Log Out</button>
            </li>
          </>
        ) : (
          <>
            <li className={styles.menu}>
              <OpenModalButton
                setShowMenu={setShowMenu}
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
              />
            </li>
            <li className={styles.menu}>
              <OpenModalButton
                setShowMenu={setShowMenu}
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
              />
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default ProfileButton;
