import { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { NavLink, Redirect, useHistory, useLocation } from 'react-router-dom';

import { BiShow, BiHide } from "react-icons/bi";

import NavigationBar from '../../Shared/Navigationbar/NavigationBar';
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';


const Login = () => {

    const { login, authenticate, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const [visiblePassword, setVisiblePassword] = useState(false);
    const history = useHistory();
    const location = useLocation();
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

    if (isAuthenticated()) {
        // console.log('redirect called')
        return <Redirect to="/" />
    }

    const handleLogIn = e => {
        e.preventDefault();
        // console.log(email, password);
        // login({ email, password })
        //     .then(response => {
        //         // console.log(response.data.data.token)
        //         console.log(response)
        //         authenticate(response.data.data.token, () => {
        //             const destination = location?.state?.from || '/';
        //             history.replace(destination);
        //             Toast.fire({
        //                 icon: 'success',
        //                 title: 'Log in successfully'
        //             })
        //         })
        //     })
        //     .catch(err => {
        //         // let errMsg = 'Something went wrong!';
        //         // if (err.response) {
        //         //     errMsg = err.response.data;
        //         // } else {
        //         //     errMsg = 'Something went wrong!';
        //         // }
        //         console.log(err);

        //     })

        login({ email, password })
            .then(res => res.json())
            .then(info => {
                // console.log(info)
                if (info?.data) {
                    authenticate(info.data.token, () => {
                        const destination = location?.state?.from || '/';
                        history.replace(destination);
                        Toast.fire({
                            icon: 'success',
                            title: 'Log in successfully'
                        })
                    })
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: info.message
                    })
                }
            })

    }
    const checkEmail = (value) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            setEmailErrorMessage('');
            return;
        }
        setEmailErrorMessage("You have entered an invalid email address!")
    }

    const logoSrc = "https://i.ibb.co/fFWMnnd/login-logo.png";
    return (

        <div>
            {/* <Header></Header> */}
            <NavigationBar></NavigationBar>
            <h2 className='text-center my-3'>Sign in </h2>
            <div className='form-width mx-auto my-4 p-3 shadow-lg'>
                <div className='pb-4 text-center'>
                    <img src={logoSrc} className="img-fluid rounded mx-auto img-width" alt="" />
                </div>
                {/* enter email */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <InputGroup className="">
                        <Form.Control size="lg" type='email' placeholder="Email" required
                            onChange={(e) => {
                                setEmail(e.target.value.trim().toLowerCase());
                                checkEmail(e.target.value.trim());
                            }}
                        />

                        {/* <div className=' d-flex  align-items-center'>

                        </div> */}

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
                            }}
                        />
                        <InputGroup.Text className='bg-white'
                            onClick={() => setVisiblePassword(!visiblePassword)}
                        > {visiblePassword ? <BiShow className='fs-4' /> : <BiHide className='fs-4' />}
                        </InputGroup.Text>
                        <div className=' d-flex  align-items-center'>

                        </div>
                    </InputGroup>
                    <Form.Text className="text-danger ps-2">
                        {/* {passwordErrorMessage} */}
                    </Form.Text>
                </Form.Group>
                <small className='ms-1'><NavLink to="/register" className="link">Not a member yet?</NavLink></small>
                {/* enter login */}
                {/* <Form.Group className="my-3 " controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Keep Me logged in" />
                </Form.Group> */}
                <button className='w-100 my-3 btn btn-outline-success fw-bold ' onClick={handleLogIn}>
                    Log In
                </button>


            </div>

        </div>

    );
}

export default Login;