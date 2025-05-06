
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import { Icon } from 'react-icons-kit';
import { shoppingCart } from 'react-icons-kit/feather/shoppingCart';
import { auth } from '../config/Config';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RESET_LOGOUT } from '../utils/constants';

export default function Navbar() {
  const {cartItems} = useSelector(state => state.cart);
  const { user, isAuthenticated } = useSelector(state => state.user);
  const navigate = useNavigate();
  console.log(user);
  const dispatch = useDispatch();  

  const handleLogout = () => {
    auth.signOut().then(() => {
      dispatch({ type: RESET_LOGOUT });
      navigate('/login');
    });
  };
  
  return (
    <div className='navbar'>
      <div className="leftside">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
      </div>
      <div className="rightside">
        {!isAuthenticated && <>
          <div> <Link className='navlink' to="signup">Signup</Link></div>
          <div> <Link className='navlink' to="login">Login</Link></div>
          {/* <a className='navlink' href="#footer">Footer</a> */}
        </>}
        {isAuthenticated && <>
          <div className='uppercase'><Link className='navlink' to="/">
            {user.fullName}
          </Link></div>
          <div><Link className='navlink' to="/my-orders">
            My Orders
          </Link></div>
          {
            user.isAdmin && <div><Link className='navlink' to="/dashboard">
            Admin Dashboard
          </Link></div>
          }
          <div className="cart-menu-btn">
            <Link className='navlink' to="/cart">
              <Icon icon={shoppingCart} size={20} />
            </Link>
            {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
          </div>
          <div
            className="btn btn-danger btn-md"
            onClick={handleLogout}
            style={{ cursor: 'pointer' }}
          >
            LOGOUT
          </div>

        </>}
      </div>
    </div>
  );
}
