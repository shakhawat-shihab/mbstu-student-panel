import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Redirect, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';
import useAuth from '../../../../../Hooks/useAuth';
import NavigationBar from '../../../../Shared/Navigationbar/NavigationBar';


const ForgetPassword = () => {
    const history = useHistory();
    const { isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

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

    const checkEmail = (value) => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
            setEmailErrorMessage('');
            return;
        }
        setEmailErrorMessage("You have entered an invalid email address!")
    }

    const forgetPassword = () => {
        if (!email) {
            Toast.fire({
                icon: 'error',
                title: 'Enter an email address'
            })
            return;
        }
        fetch(`http://localhost:5000/api/v1/user/create-reset-password-link/${email}`)
            .then(res => res.json())
            .then(info => {
                if (info?.status === 'success') {
                    Toast.fire({
                        icon: 'success',
                        title: info.message
                    })
                    history.push('/login')
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: info.message
                    })
                }
            });
    }

    return (
        <div>
            <div>
                <NavigationBar></NavigationBar>
                <div className='py-5'>

                    <div className='form-width mx-auto my-4 p-3 shadow-lg rounded'>
                        <h2 className='text-center mt-5 mb-4'>Forget Password</h2>
                        {/* <h4 className='text-center my-4'>Email address: <span className='text-primary'>{email}</span> </h4> */}
                        {/* enter email */}
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <InputGroup className="">
                                <Form.Control size="lg" type='email' placeholder="Email" required
                                    onChange={(e) => {
                                        setEmail(e.target.value.trim().toLowerCase());
                                        checkEmail(e.target.value.trim());
                                    }}
                                />
                            </InputGroup>
                            <Form.Text className=" ps-2 text-danger">
                                {emailErrorMessage}
                            </Form.Text>
                        </Form.Group>

                        <button className='w-100 mb-3 btn btn-outline-success fw-bold ' onClick={forgetPassword}>
                            Send Password Reset Email
                        </button>
                    </div>

                </div>
            </div>
        </div>


    );
};

export default ForgetPassword;