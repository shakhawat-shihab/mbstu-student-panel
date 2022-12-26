import React, { useState } from 'react';
import { Form, InputGroup, OverlayTrigger, Popover } from 'react-bootstrap';
import { BiHide, BiShow, BiInfoCircle, BiError } from 'react-icons/bi';
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FaSpinner } from "react-icons/fa";
import { NavLink, useHistory } from 'react-router-dom';
// import Header from '../../Shared/Header/Header';
import './Register.css';
import { useEffect } from 'react';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';
// import { getAuth, updateProfile } from 'firebase/auth';
// import NavigationBar from '../../Shared/Navigationbar/NavigationBar';
import logoSrc from '../../../images/login-logo.png'
import useMongoose from '../../../Hooks/useMongoose';
import NavigationBar from '../../Shared/Navigationbar/NavigationBar';
// import { register } from '../../../api/apiAuth';
const Register = () => {
    // const { register } = apiAuth();
    // const auth = getAuth();
    // const { user, saveUser, registerUser, authError, isLoadingRegister, setIsLoadingRegister, setUser } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('');
    const [lastName, setLastName] = useState('');
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('');

    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [isLoadingEmailExist, setIsLoadingEmailExist] = useState(false);
    const [password, setPassword] = useState('');
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    // const logoSrc = "https://i.ibb.co/fFWMnnd/login-logo.png";
    const { user } = useAuth();
    const history = useHistory();
    if (user.email) {
        history.push('/home');
    }

    const { register } = useMongoose();
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
    const checkFirstName = (value) => {
        if (value.length >= 3) {
            setFirstNameErrorMessage('');
            return;
        }
        setFirstNameErrorMessage('Name length must be 3 character long');
    }
    const checkLastName = (value) => {
        if (value.length >= 3) {
            setLastNameErrorMessage('');
            return;
        }
        setLastNameErrorMessage('Name length must be 3 character long');
    }
    const checkEmail = (value) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            setEmailErrorMessage('');
            return;
        }
        setEmailErrorMessage("You have entered an invalid email address!")
    }

    const checkPasswod = (value) => {
        //  I use the following script for min 8 letter password,
        // with at least a symbol, upper and lower case letters and a number
        // if (/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value)) {
        //     setPasswordErrorMessage('');
        //     return;
        // }
        // setPasswordErrorMessage("Chose a strong Password!")
        if (value?.trim()?.length >= 6) {
            setPasswordErrorMessage('');
            return;
        }
        setPasswordErrorMessage("Chose a strong Password!")
    }

    const checkPasswordMatch = (value) => {
        console.log(value, password)
        if (password === value?.trim()) {
            setConfirmPasswordErrorMessage('');
            return;
        }
        setConfirmPasswordErrorMessage("Password mismatched")
    }

    // const checkEmailIsAlreadyUsed = () => {
    //     setIsLoadingEmailExist(true);
    //     fetch(`https://mbstu-panel-server.onrender.com/users/exist/${email}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             setIsLoadingEmailExist(false);
    //             if (data === true) {
    //                 setEmailErrorMessage('Email is already used');
    //             }
    //         })
    // }



    const handleCreateAccount = (e) => {
        e.preventDefault();

        // register({ firstName, lastName, email, password, confirmPassword })
        //     .then(response => {
        //         // console.log(response.data.data.token)
        //         console.log(response);
        //         history.push('/login')
        //     })
        //     .catch(err => {
        //         let errMsg = 'Something went wrong!';
        //         if (err.response) {
        //             errMsg = err.response.data;
        //         } else {
        //             errMsg = 'Something went wrong!';
        //         }
        //     })

        register({ firstName, lastName, email, password, confirmPassword })
            .then(res => res.json())
            .then(info => {
                // console.log(info);
                Toast.fire({
                    icon: 'success',
                    title: info.message
                })
                history.push('/login')

            })

    }
    const popoverName = (
        <Popover id="popover-basic">
            <Popover.Body>
                Enter your full name
            </Popover.Body>
        </Popover>
    );
    const popoverEmail = (
        <Popover id="popover-basic">
            <Popover.Body>
                Enter a valid email address.
            </Popover.Body>
        </Popover>
    );
    const popoverPassword = (
        <Popover id="popover-basic">
            <Popover.Body>
                Min. 8 letter password, with at least a symbol, upper and lower case letters and a number
            </Popover.Body>
        </Popover>
    );
    const popoverConfirmPassword = (
        <Popover id="popover-basic">
            <Popover.Body>
                Password must match previous one.
            </Popover.Body>
        </Popover>
    );


    return (
        <div>
            {/* <Header></Header> */}
            <NavigationBar></NavigationBar>
            <div className='form-width mx-auto my-4 p-3 shadow-lg rounded'>

                <h2 className='text-center text-primary fw-bold mt-3 mb-5'>Create an account </h2>
                <div className='pb-4 text-center'>
                    <img src={logoSrc} className="img-fluid rounded mx-auto img-width" alt="" />
                </div>
                <Form>

                    {/* enter first name */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <InputGroup className="">
                            <Form.Control size="lg" type='text' placeholder="First Name" required
                                onChange={(e) => {
                                    setFirstName(e.target.value.trim());
                                    checkFirstName(e.target.value.trim());
                                }}
                            />
                            <OverlayTrigger trigger="hover" placement="bottom" overlay={popoverName}>
                                <div className=' d-flex  align-items-center'>
                                    {
                                        firstName === ""
                                            ?
                                            <BiInfoCircle className='fs-4 mx-2' />
                                            :
                                            <>
                                                {
                                                    firstNameErrorMessage === ''
                                                        ?
                                                        <AiOutlineCheckCircle className='fs-4 mx-2 text-success' />
                                                        :
                                                        <BiError className='fs-4 mx-2 text-danger' />
                                                }

                                            </>
                                    }
                                </div>
                            </OverlayTrigger>
                        </InputGroup>
                        <Form.Text className=" ps-2 text-danger">
                            {firstNameErrorMessage}
                        </Form.Text>
                    </Form.Group>

                    {/* enter last name */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <InputGroup className="">
                            <Form.Control size="lg" type='text' placeholder="Last Name" required
                                onChange={(e) => {
                                    setLastName(e.target.value.trim());
                                    checkLastName(e.target.value.trim());
                                }}
                            />
                            <OverlayTrigger trigger="hover" placement="bottom" overlay={popoverName}>
                                <div className=' d-flex  align-items-center'>
                                    {
                                        lastName === ""
                                            ?
                                            <BiInfoCircle className='fs-4 mx-2' />
                                            :
                                            <>
                                                {
                                                    lastNameErrorMessage === ''
                                                        ?
                                                        <AiOutlineCheckCircle className='fs-4 mx-2 text-success' />
                                                        :
                                                        <BiError className='fs-4 mx-2 text-danger' />
                                                }

                                            </>
                                    }
                                </div>
                            </OverlayTrigger>
                        </InputGroup>
                        <Form.Text className=" ps-2 text-danger">
                            {lastNameErrorMessage}
                        </Form.Text>
                    </Form.Group>



                    {/* enter email */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <InputGroup className="">
                            <Form.Control size="lg" type='email' placeholder="Email" required
                                onChange={(e) => {
                                    setEmail(e.target.value.trim().toLowerCase());
                                    checkEmail(e.target.value.trim());
                                }}
                            // onBlur={checkEmailIsAlreadyUsed}
                            />
                            <OverlayTrigger trigger="hover" placement="bottom" overlay={popoverEmail}>
                                <div className=' d-flex  align-items-center'>
                                    {
                                        email === ""
                                            ?
                                            <BiInfoCircle className='fs-4 mx-2' />
                                            :
                                            <>
                                                {
                                                    isLoadingEmailExist === false
                                                        ?
                                                        <>
                                                            {
                                                                emailErrorMessage === ''
                                                                    ?
                                                                    <AiOutlineCheckCircle className='fs-4 mx-2 text-success' />
                                                                    :
                                                                    <BiError className='fs-4 mx-2 text-danger' />
                                                            }
                                                        </>
                                                        :
                                                        <>
                                                            {
                                                                <FaSpinner className='fs-4 mx-2 rotate text-info' />
                                                            }
                                                        </>
                                                }

                                            </>
                                    }
                                </div>
                            </OverlayTrigger>
                        </InputGroup>
                        <Form.Text className=" ps-2 text-danger">
                            {emailErrorMessage}
                        </Form.Text>
                    </Form.Group>

                    {/* enter password */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <InputGroup className="">
                            <Form.Control size="lg" className='input-design' type={visiblePassword ? 'text' : 'password'} placeholder="Password" required
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    checkPasswod(e.target.value);
                                    //checkPasswordMatch(confirmPassword);
                                }}
                            />
                            <InputGroup.Text className='bg-white'
                                onClick={() => setVisiblePassword(!visiblePassword)}
                            > {visiblePassword ? <BiShow className='fs-4' /> : <BiHide className='fs-4' />}
                            </InputGroup.Text>
                            <OverlayTrigger trigger="hover" placement="bottom" overlay={popoverPassword}>
                                <div className=' d-flex  align-items-center'>
                                    {
                                        password === "" && passwordErrorMessage === ""
                                            ?
                                            <BiInfoCircle className='fs-4 mx-2' />
                                            :
                                            <>
                                                {
                                                    passwordErrorMessage === ""
                                                        ?
                                                        <>
                                                            <AiOutlineCheckCircle className='fs-4 mx-2 text-success' />
                                                        </>

                                                        :
                                                        <>
                                                            <BiError className='fs-4 mx-2 text-danger' />
                                                        </>
                                                }
                                            </>
                                    }
                                </div>
                            </OverlayTrigger>
                        </InputGroup>
                        <Form.Text className="text-danger ps-2">
                            {passwordErrorMessage}
                        </Form.Text>
                    </Form.Group>


                    {/* re-enter password */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <InputGroup className="">
                            <Form.Control size="lg" className='input-design' type={visibleConfirmPassword ? 'text' : 'password'} placeholder="Re-enter password" required
                                onChange={(e) => {
                                    console.log(e.target.value);
                                    setConfirmPassword(e.target.value);
                                    checkPasswordMatch(e.target.value);
                                }} />
                            <InputGroup.Text className='bg-white' onClick={() => setVisibleConfirmPassword(!visibleConfirmPassword)} > {visibleConfirmPassword ? <BiShow className='fs-4' /> : <BiHide className='fs-4' />}
                            </InputGroup.Text>
                            <OverlayTrigger trigger="hover" placement="bottom" overlay={popoverConfirmPassword}>
                                <div className=' d-flex  align-items-center'>
                                    {
                                        confirmPassword === "" && confirmPasswordErrorMessage === ""
                                            ?
                                            <BiInfoCircle className='fs-4 mx-2' />
                                            :
                                            <>
                                                {
                                                    confirmPasswordErrorMessage === ""
                                                        ?
                                                        <>
                                                            <AiOutlineCheckCircle className='fs-4 mx-2 text-success' />
                                                        </>
                                                        :
                                                        <>
                                                            <BiError className='fs-4 mx-2 text-danger' />
                                                        </>
                                                }
                                            </>
                                    }
                                </div>
                            </OverlayTrigger>
                        </InputGroup>
                        <Form.Text className="text-danger ps-2">
                            {confirmPasswordErrorMessage}
                        </Form.Text>
                    </Form.Group>

                    <small className='ms-1'><NavLink to="/login" className="link">Already a member?</NavLink></small>
                    {/* <button className='w-100 my-3 btn btn-outline-success fw-bold ' onClick={handleCreateAccount}>
                        Create account
                    </button> */}

                    <div className='my-3'>
                        <button className='w-100 mb-3 btn btn-success fw-bold ' onClick={handleCreateAccount}>
                            Create account
                        </button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default Register;