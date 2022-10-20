import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import { ImDrawer } from "react-icons/im";
import './DashboardNavigationBar.css'
const DashboardNavigationBar = (props) => {
    const { user } = useAuth();
    const { func } = props;

    return (

        <>
            <div className='container-fluid navbar-bg d-flex flex-row justify-content-center align-items-center'>
                <div className='ms-5'>
                    {/* <img src={trayIcon} style={{ cursor: 'pointer' }} alt="" width='35px' onClick={func} /> */}
                    <ImDrawer className='text-white fs-2 ms-5 drawer' onClick={func}></ImDrawer>
                </div>
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
                                    {
                                        user?.email
                                        &&
                                        <li className='nav-item me-4 mt-2'>
                                            <NavLink to='/dashboard'>
                                                Dashboard
                                            </NavLink>
                                        </li>

                                    }

                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>



        </>

    );
};

export default DashboardNavigationBar;