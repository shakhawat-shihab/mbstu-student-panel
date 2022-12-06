import React, { useState } from 'react';
import { Form, InputGroup, OverlayTrigger, Popover } from 'react-bootstrap';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BiError, BiHide, BiInfoCircle, BiShow } from 'react-icons/bi';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../../../../Hooks/useAuth';
import NavigationBar from '../../../../Shared/Navigationbar/NavigationBar';


const PasswordReset = () => {

    const history = useHistory();
    const { email, token } = useParams();
    const { isAuthenticated } = useAuth();
    const [password, setPassword] = useState('');
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [visibleConfirmPassword, setVisibleConfirmPassword] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');


    // if (isAuthenticated()) {
    //     // console.log('redirect called')
    //     return <Redirect to="/" />
    // }


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

    const checkPassword = (value) => {
        //  I use the following script for min 8 letter password,
        // with at least a symbol, upper and lower case letters and a number
        // if (/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(value)) {
        //     setPasswordErrorMessage('');
        //     return;
        // }
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



    const changePassword = () => {

        const supObj = {}
        supObj.email = email;
        supObj.password = password;
        supObj.confirmPassword = confirmPassword;
        console.log('supObj ', supObj)
        console.log('token ', token)

        if (password !== confirmPassword) {
            // console.log('Mismatchedd');
            Toast.fire({
                icon: 'error',
                title: 'Password mismatched'
            })
            return;
        }

        fetch(`http://localhost:5000/api/v1/user/reset-password/${token}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json',
                // 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
            body: JSON.stringify(supObj)
        })
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
            <NavigationBar></NavigationBar>
            <div className='py-5'>
                {/* <h2 className='text-center'>Reset Password</h2> */}
                <div className='form-width mx-auto my-4 p-3 shadow-lg rounded'>
                    <h2 className='text-center text-primary fw-bold mt-3 mb-3'>Reset Password</h2>
                    <p className='my-4 text-center'>Email address: <span className='text-danger'>{email}</span> </p>
                    {/* enter password */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <InputGroup className="">
                            <Form.Control size="lg" className='input-design' type={visiblePassword ? 'text' : 'password'} placeholder="Password" required
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    checkPassword(e.target.value);
                                    // checkPasswordMatch(confirmPassword);
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
                                    // console.log(e.target.value);
                                    setConfirmPassword(e.target.value);
                                    // checkPassword(e.target.value);
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

                    {/* <button className='w-100 my-3 btn btn-outline-success fw-bold ' onClick={changePassword}>
                        Save Password
                    </button> */}

                    <div className='my-3'>
                        <button className='w-100  mb-3 btn btn-success fw-bold ' onClick={changePassword}>
                            Save Password
                        </button>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default PasswordReset;