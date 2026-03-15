import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { state } = useContext(AppContext);
  const { cart } = state;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const cartCount = cart.length;

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowLogout(false);
    navigate('/auth');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navLogo} onClick={() => navigate('/')}>
        <i className="fa-solid fa-utensils"></i> Food App
      </div>
      <div className={styles.navLinks}>
        <div className={styles.userMenu} onMouseEnter={() => setShowLogout(true)} onMouseLeave={() => setShowLogout(false)}>
          <i
            className="fa-solid fa-user"
            onClick={() => isLoggedIn ? navigate('/profile') : navigate('/auth')}
          ></i>
          {showLogout && isLoggedIn && (
            <div className={styles.dropdownMenu}>
              <button onClick={() => navigate('/history')}>Lịch sử đơn</button>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          )}
        </div>
        <i
          className="fa-solid fa-clock-rotate-left"
          onClick={() => isLoggedIn ? navigate('/history') : navigate('/auth')}
        ></i>
        <div className={styles.cartIcon} onClick={() => navigate('/checkout')}>
          <i className="fa-solid fa-cart-shopping"></i>
          {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
        </div>
      </div>
    </nav>
  );
}
