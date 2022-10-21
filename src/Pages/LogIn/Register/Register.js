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
import NavigationBar from '../../Shared/Navigationbar/NavigationBar';
// import useM from '../../../api/apiAuth';
import apiAuth from '../../../api/apiAuth';
import useMongoose from '../../../Hooks/useMongoose';
// import { register } from '../../../api/apiAuth';
const Register = () => {
    // const { register } = apiAuth();
    // const auth = getAuth();
    // const { user, saveUser, registerUser, authError, isLoadingRegister, setIsLoadingRegister, setUser } = useAuth();
    const [name, setName] = useState('');
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [isLoadingEmailExist, setIsLoadingEmailExist] = useState(false);
    const [password, setPassword] = useState('');
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const logoSrc = "https://i.ibb.co/fFWMnnd/login-logo.png";
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
    const checkName = (value) => {
        if (value.length >= 3) {
            setNameErrorMessage('');
            return;
        }
        setNameErrorMessage('Name length must be 3 character long');
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
        if (/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value)) {
            setPasswordErrorMessage('');
            return;
        }
        setPasswordErrorMessage("Chose a strong Password!")
    }
    const checkEmailIsAlreadyUsed = () => {
        setIsLoadingEmailExist(true);
        fetch(`http://localhost:5000/users/exist/${email}`)
            .then(res => res.json())
            .then(data => {
                setIsLoadingEmailExist(false);
                if (data === true) {
                    setEmailErrorMessage('Email is already used');
                }
            })
    }
    useEffect(() => {
        if (password === confirmPassword && passwordErrorMessage === '') {
            setConfirmPasswordErrorMessage('');
        }
        else {
            setConfirmPasswordErrorMessage("Password mismathed!");
        }
    }, [password, confirmPassword, passwordErrorMessage]);



    const handleCreateAccount = (e) => {
        e.preventDefault();
        //console.log("Clicked");
        console.log(email, password, confirmPassword);
        // register({ email, password, confirmPassword });

        register({ email, password, confirmPassword })
            .then(response => {
                // console.log(response.data.data.token)
                console.log(response);

                history.push('/login')
            })
            .catch(err => {
                let errMsg = 'Something went wrong!';
                if (err.response) {
                    errMsg = err.response.data;
                } else {
                    errMsg = 'Something went wrong!';
                }

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
            {/* <NavigationBar></NavigationBar> */}
            <h2 className='text-center my-3'>Create an account </h2>
            <div className='form-width mx-auto my-4 p-3 shadow-lg'>
                <div className='pb-4 text-center'>
                    <img src={logoSrc} className="img-fluid rounded mx-auto img-width" alt="" />
                </div>
                <Form>

                    {/* enter username */}
                    {/* <Form.Group className="mb-3" controlId="formBasicEmail">
                        <InputGroup className="">
                            <Form.Control size="lg" type='text' placeholder="User Name" required
                                onChange={(e) => {
                                    setName(e.target.value.trim());
                                    checkName(e.target.value.trim());
                                }}
                            />
                            <OverlayTrigger trigger="hover" placement="bottom" overlay={popoverName}>
                                <div className=' d-flex  align-items-center'>
                                    {
                                        name === ""
                                            ?
                                            <BiInfoCircle className='fs-4 mx-2' />
                                            :
                                            <>
                                                {
                                                    nameErrorMessage === ''
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
                            {nameErrorMessage}
                        </Form.Text>
                    </Form.Group> */}



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
                                    // checkPasswod(e.target.value);
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
                                    // checkPasswordMatch(e.target.value);
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
                    <button className='w-100 my-3 btn btn-outline-success fw-bold ' onClick={handleCreateAccount}>
                        Create account
                    </button>
                </Form>
            </div>
        </div>
    );
};

export default Register;