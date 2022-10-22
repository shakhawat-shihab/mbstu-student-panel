import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import './Header.css';


const Header = () => {
    const { user, logOut } = useAuth();
    console.log(user)
    const signOutFromAccount = () => {
        logOut()
    }
    return (
        <div className="header-bg header-show">
            <div className="container py-1">
                <span className="float-start">
                    <i className="fas fa-envelope me-1" />
                    <NavLink className="me-1 logo home" to="/home">cse@mbstu.ac.bd</NavLink>
                    <span className="ms-1 me-2">|</span>
                    <i className="fab fa-facebook-square me-1" />
                    <NavLink className='logo fb' to="www.facebook.com">Facebook</NavLink>
                </span>
                <span className="float-end">

                    {
                        user?.email
                            ?
                            <>
                                <span className='mx-3 fw-bold text-danger'>{user?.email}</span>

                                <NavLink to='/home' onClick={signOutFromAccount} className="text-decoration-none">Log Out</NavLink>
                            </>
                            :
                            <>
                                <i className="fas fa-lock me-1"></i>
                                <NavLink className="me-1 login logo" to="/login">Login</NavLink>

                                <span className="ms-1 me-2 logo">|</span>
                                <i className="fas fa-lock me-1"></i>
                                <NavLink className="me-3 register logo" to="/register">Register</NavLink>
                            </>
                    }
                </span>
            </div>
        </div>
    );
};

export default Header;

