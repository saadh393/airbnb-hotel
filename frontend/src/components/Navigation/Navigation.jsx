import styles from "./navigation.module.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  function isActivelink({ isActive }) {
    return `${styles.navLink} ${isActive && styles.activeLink}`;
  }

  return (
    <nav className={styles.navContainer}>
      <ul className={styles.navLinks}>
        <li className={styles.navItem}>
          <NavLink to="/">
            <img src="/logo.svg" height={25} />
          </NavLink>
        </li>
      </ul>
      {isLoaded && (
        <div className={styles.actions}>
          {sessionUser && (
            <NavLink to="/spots/new" className={isActivelink}>
              Create a New Spot
            </NavLink>
          )}
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
