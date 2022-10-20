import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import { signOut, userInfo } from '../../../utils/auth';
import './Header.css';


const Header = () => {
    // const useLogin = () => {
    //     const history = useHistory();
    //     history.push("./login");
    // }
    // const { user, logout } = useAuth();

    console.log(useAuth())
    const decode = userInfo();
    console.log('decode ====== ', decode)
    // console.log("user photo = ", user?.photoURL);
    // console.log("user = ", user?.displayName);
    const signOutFromAccount = () => {
        signOut()
    }
    //signOutFromAccount();
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
                    <>
                        <i className="fas fa-lock me-1"></i>
                        <NavLink className="me-1 login logo" to="/login">Login</NavLink>

                        <span className="ms-1 me-2 logo">|</span>
                        <i className="fas fa-lock me-1"></i>
                        <NavLink className="me-3 register logo" to="/register">Register</NavLink>
                    </>
                    {/* {
                        user?.email
                            ?
                            <>
                                <span className='mx-3 fw-bold text-danger'>{user?.displayName}</span>
                              
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



                


                    } */}
                </span>

            </div>
        </div>

    );
};

export default Header;

