import React, { useState } from 'react';
// import { ListGroup, Nav, Offcanvas } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
// import DashboardHome from '../../Dashboard/DashboardHome/DashboardHome';
import './NavigationBar.css';
// import trayIcon from '../../../../src/full_tray.png'

const NavigationBar = () => {
    // const logoSrc = "https://i.ibb.co/QMbh6wz/mbstu-logo.png";
    // const { user, logout } = useAuth();
    const [visible, setVisible] = useState(false);
    // const [some, setSome] = useState(true);
    // const signOutFromAccount = () => {
    //     logout();
    // }
    //const { url } = useRouteMatch();
    // console.log('Navigation Bar url ', url);
    // console.log('Navigation Bar visible ', visible);
    // console.log('Navigation Bar url.includes(dashboard) ', url.includes('dashboard'));


    return (

        <>
            <div className='container-fluid navbar-bg d-flex flex-row justify-content-center align-items-center'>
                {/* <div className='logo-show'>
                    <div className="img-pos p-3 me-5">
                        <img src={logoSrc} style={{ width: "70px" }} className="img-fluid pb-2" alt="mbstu_logo" />
                    </div>
                </div> */}
                {/* <div className='ms-5'>
                    <img src={trayIcon} style={{ cursor: 'pointer' }} alt="" width='35px' />
                </div> */}
                <div className='mx-auto w-50'>
                    <nav className="navbar navbar-expand-lg navbar-dark">
                        <div>
                            <button className="navbar-toggler ms-5 fs-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon float-start"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0 menu">
                                    <li className="nav-item me-4 mt-2">
                                        {/* <a className="nav-link active" aria-current="page" href="#">Home</a> */}
                                        <NavLink to='/home'>
                                            Home
                                        </NavLink>
                                    </li>
                                    <li className="nav-item dropdown me-4">
                                        <a className="nav-link dropdown-toggle active" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">About</a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><a className="dropdown-item" href="#">Action</a></li>
                                            <li><a className="dropdown-item" href="#">Another action</a></li>
                                            {/* <li><hr className="dropdown-divider" /></li> */}
                                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown me-4">
                                        <a className="nav-link dropdown-toggle active" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Academic
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><a className="dropdown-item" href="#">Action</a></li>
                                            <li><a className="dropdown-item" href="#">Another action</a></li>
                                            {/* <li><hr className="dropdown-divider" /></li> */}
                                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item dropdown me-4">
                                        <a className="nav-link dropdown-toggle active" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            People
                                        </a>
                                        <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            <li><a className="dropdown-item" href="#">Action</a></li>
                                            <li><a className="dropdown-item" href="#">Another action</a></li>
                                            {/* <li><hr className="dropdown-divider" /></li> */}
                                            <li><a className="dropdown-item" href="#">Something else here</a></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item me-4">
                                        <a className="nav-link active" aria-current="page" href="#">
                                            Announcement
                                        </a>
                                    </li>
                                    <li className="nav-item me-4">
                                        <a className="nav-link active" aria-current="page" href="#">
                                            Contact
                                        </a>
                                    </li>
                                    {/* {
                                        user?.email
                                        &&

                                        <li className='nav-item me-4 mt-2'>
                                            <NavLink to='/dashboard' onClick={() => setVisible(true)}>
                                                Dashboard
                                            </NavLink>
                                        </li>
                                    } */}
                                    {/* {
                                        user?.email
                                            ?
                                            <>
                                                <li className="nav-item me-4 my-2 log-reg">
                                                    <span className="fw-bold text-danger">{user.displayName}</span>
                                                </li>
                                                <li className='my-2 log-reg'>
                                                    <NavLink to='/home' onClick={signOutFromAccount} className="text-decoration-none">Log Out</NavLink>
                                                </li>
                                            </>
                                            :
                                            <>
                                                <li className="nav-item me-4 my-2 log-reg">
                                                    <NavLink to="/login">Login</NavLink>
                                                </li>
                                                <li className='my-2 log-reg'>
                                                    <NavLink to='/register'>Register</NavLink>
                                                </li>
                                            </>
                                    } */}
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>



        </>

    );
};

export default NavigationBar;