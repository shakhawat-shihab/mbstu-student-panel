import React, { useState } from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import logo from '../../../loc.PNG';
import login from '../../../login.png';
import './NavigBar.css'

const NavigBar = () => {
    const { user, logout } = useAuth();
    const signOutFromAccount = () => {
        logout();
    }
    const [showAdministrationDropdown, setShowAdministrationDropdown] = useState(false);
    const [showAdmissionDropdown, setShowAdmissionDropdown] = useState(false);
    const activeDesign = {
        fontWeight: "bold",
        textShadow: '0.4px 0.4px lightgray',
        letterSpacing: '1px',
    };
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" className='border-top' >
                <Container>
                    <NavLink to='/home' className='text-decoration-none' >
                        <Navbar.Brand className='font-statl fs-2' style={{ letterSpacing: '.16rem' }}><img src={logo} alt="" width='50px' /> <span className=''>CBC</span>  </Navbar.Brand>
                    </NavLink>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="ms-auto ">
                            <NavLink to='/home' className='nav-link link px-3 mx-1 text-decoration-none'
                                activeStyle={activeDesign} >
                                Home
                            </NavLink>
                            <NavLink to='/services' className='nav-link link px-3 mx-1 text-decoration-none'
                                activeStyle={activeDesign}>
                                Services
                            </NavLink>
                            <NavDropdown title="Administration"
                                className=' link px-2 mx-1'
                                show={showAdministrationDropdown}
                                onMouseEnter={() => { setShowAdministrationDropdown(true) }}
                                onMouseLeave={() => { setShowAdministrationDropdown(false) }}
                            >
                                <Link to='/college-committee' className='text-decoration-none dropdown-item'>
                                    College Executive Committee
                                </Link>
                                <Link to='/teachers' className='text-decoration-none dropdown-item'>
                                    Teachers
                                </Link>
                                <Link to='/publications' className='text-decoration-none dropdown-item'>
                                    Publications
                                </Link>
                            </NavDropdown>
                            <NavDropdown title="Result"
                                className=' link px-2 mx-1'
                                show={showAdmissionDropdown}
                                onMouseEnter={() => { setShowAdmissionDropdown(true) }}
                                onMouseLeave={() => { setShowAdmissionDropdown(false) }}
                            >
                                <Link to='/current' className='text-decoration-none dropdown-item'>
                                    Current Result
                                </Link>
                                <Link to='/overall' className='text-decoration-none dropdown-item'>
                                    Overall Result
                                </Link>
                            </NavDropdown>
                            <NavLink to='/about' className='nav-link link px-3 mx-1 text-decoration-none'
                                activeStyle={activeDesign}>
                                Dashboard
                            </NavLink>
                            {/* <NavLink to='/login' className='nav-link link px-3 mx-1 text-decoration-none'
                                activeStyle={{}} >
                                <img src={login} alt="" width='30px' />
                            </NavLink> */}

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div >
    );
};

export default NavigBar;