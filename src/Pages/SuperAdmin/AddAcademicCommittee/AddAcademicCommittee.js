import React, { useEffect, useState } from 'react';
import { Button, Card, Form, InputGroup, Spinner } from 'react-bootstrap';
import mbstuLogo from "../../../images/mbstu-logo.jpg"
import { AiFillTag } from "react-icons/ai";
import Swal from 'sweetalert2';

import userPhoto from "../../../images/user.png"
import studentPhoto from "../../../images/student.png"
import teacherPhoto from "../../../images/teacher.png"
import chairmanPhoto from "../../../images/chairman.png"
import academicCommitteePhoto from "../../../images/academicCommittee.png"
import hallProvostPhoto from "../../../images/hallProvost.png"

const AddAcademicCommittee = () => {
    const [email, setEmail] = useState('');
    const [usersByEmail, setUsersByEmail] = useState([]);
    const [isLoadingUserByEmail, setIsLoadingUserByEmail] = useState(false);

    const [message, setMessage] = useState('');

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


    const findUsersByEmail = () => {
        // console.log('email  ', email);
        if (email.trim() !== '') {
            setIsLoadingUserByEmail(true);
            fetch(`https://mbstu-panel-server.onrender.com/api/v1/user/email/${email.trim()}`, {
                method: 'get',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
                },
            })
                .then(res => res.json())
                .then(info => {
                    // console.log('chairman info = ', info);
                    setUsersByEmail(info?.data);
                    setIsLoadingUserByEmail(false);

                    if (info?.data?.length === 0) {
                        setMessage(`No user found with ${email}`);
                    }
                })
        }
    }

    const makeAcademicCommittee = (userId) => {
        // console.log('userId ', userId);
        fetch(`https://mbstu-panel-server.onrender.com/api/v1/user/add-academic-committee/${userId}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
        })
            .then(res => res.json())
            .then(info => {
                if (info?.status === 'success') {
                    Toast.fire({
                        icon: 'success',
                        title: info?.message
                    });
                    findUsersByEmail();
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: info?.message
                    })
                }
            })
    }

    const removeAcademicCommittee = (userId) => {
        // console.log('userId ', userId);
        fetch(`https://mbstu-panel-server.onrender.com/api/v1/user/remove-academic-committee/${userId}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
        })
            .then(res => res.json())
            .then(info => {
                if (info?.status === 'success') {
                    Toast.fire({
                        icon: 'success',
                        title: info?.message
                    });
                    findUsersByEmail();
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: info?.message
                    })
                }
            })
    }


    return (
        <div className='px-2 py-5 my-5 shadow-lg container w-100 mx-auto rounded '>
            <h2 className='text-center text-primary fw-bold '>Add Academic Committee Member</h2>

            <div className='my-5'>
                <InputGroup className="mb-3 w-50 mx-auto">
                    <Form.Control
                        placeholder="Write an email"
                        aria-label="Write an email"
                        onKeyUp={(e) => { setEmail(e.target.value) }}
                    />
                    <Button variant="outline-secondary" id="button-addon2" onClick={() => findUsersByEmail()}>
                        Search
                    </Button>
                </InputGroup>
            </div>

            {
                isLoadingUserByEmail
                    ?
                    <>
                        <div className='text-center my-4 '>
                            <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>

                        </div>
                    </>
                    :
                    <>
                        {
                            (usersByEmail?.length === 0)
                                ?

                                <div className='text-center'>
                                    <h4>{message} </h4>
                                </div>
                                :
                                <div className='container my-5'>
                                    <h4 className='text-center my-5'><u>Search Result</u></h4>
                                    <div className='row g-3'>
                                        {
                                            usersByEmail.map(x =>
                                                <div className='col-lg-6 col-md-12 col-sm-12'>
                                                    <Card key={x?._id} className="mb-3 shadow-sm h-100">
                                                        <div className='py-3'>
                                                            <div className='d-flex p-2'>
                                                                <div >

                                                                    {
                                                                        x?.profile?.imageURL
                                                                            ?
                                                                            <img src={x?.profile?.imageURL} alt={` ${x?.profile?.firstName}  ${x?.profile?.lastName}`} width='200px' height='200px' />
                                                                            :
                                                                            <>
                                                                                {
                                                                                    x?.isAcademicCommittee
                                                                                        ?
                                                                                        <img src={academicCommitteePhoto} alt={` ${x?.profile?.firstName}  ${x?.profile?.lastName}`} width='200px' height='200px' />
                                                                                        :
                                                                                        <>
                                                                                            {
                                                                                                x?.isDeptChairman
                                                                                                    ?
                                                                                                    <img src={chairmanPhoto} alt={` ${x?.profile?.firstName}  ${x?.profile?.lastName}`} width='200px' height='200px' />
                                                                                                    :
                                                                                                    <>
                                                                                                        {
                                                                                                            x?.isHallProvost
                                                                                                                ?
                                                                                                                <img src={hallProvostPhoto} alt={` ${x?.profile?.firstName}  ${x?.profile?.lastName}`} width='200px' height='200px' />
                                                                                                                :
                                                                                                                <>
                                                                                                                    {

                                                                                                                        x?.isTeacher
                                                                                                                            ?
                                                                                                                            <img src={teacherPhoto} alt={` ${x?.profile?.firstName}  ${x?.profile?.lastName}`} width='200px' height='200px' />
                                                                                                                            :
                                                                                                                            <>
                                                                                                                                {
                                                                                                                                    x?.isStudent
                                                                                                                                        ?
                                                                                                                                        <img src={studentPhoto} alt={` ${x?.profile?.firstName}  ${x?.profile?.lastName}`} width='200px' height='200px' />
                                                                                                                                        :
                                                                                                                                        <img src={userPhoto} alt={` ${x?.profile?.firstName}  ${x?.profile?.lastName}`} width='200px' height='200px' />
                                                                                                                                }
                                                                                                                            </>
                                                                                                                    }
                                                                                                                </>
                                                                                                        }
                                                                                                    </>
                                                                                            }
                                                                                        </>

                                                                                }
                                                                            </>

                                                                    }

                                                                </div>
                                                                <div className='ms-4 pt-3 w-75 '>
                                                                    <h4 className='text-start fw-bold'> {x?.profile?.firstName + ' ' + x?.profile?.lastName}</h4>

                                                                    <h6 className='text-start '> Email:  {x?.email}</h6>

                                                                    {
                                                                        x?.isStudent
                                                                        &&
                                                                        <h6 className='text-start'> ID: {x?.profile?.id?.toUpperCase()}</h6>

                                                                    }
                                                                    {
                                                                        x?.department
                                                                        &&
                                                                        <h6 className='text-start'> Department: {x?.department?.toUpperCase()}</h6>
                                                                    }

                                                                    {
                                                                        (x?.hall?.name)
                                                                        &&
                                                                        <h6 className='text-start'> Hall: {x?.hall?.name}</h6>

                                                                    }

                                                                    <div className=' mt-3 text-start row g-2'>
                                                                        {
                                                                            x?.isStudent
                                                                            &&
                                                                            <span className='col-5'>
                                                                                <AiFillTag className=' fs-4' />
                                                                                <span className='ms-1 me-2'>Student</span>
                                                                            </span>
                                                                        }

                                                                        {
                                                                            x?.isTeacher
                                                                            &&
                                                                            <span className='col-5'>
                                                                                <AiFillTag className='text-info fs-4' />
                                                                                <span className='ms-1 me-2 text-info'>Teacher</span>
                                                                            </span>
                                                                        }

                                                                        {
                                                                            x?.isDeptChairman
                                                                            &&
                                                                            <span className='col-5'>
                                                                                <AiFillTag className='text-primary fs-4' />
                                                                                <span className='ms-1 me-2 text-primary'> Chairman</span>
                                                                            </span>
                                                                        }

                                                                        {
                                                                            x?.isAcademicCommittee
                                                                            &&
                                                                            <span className='col-5'>
                                                                                <AiFillTag className='text-success fs-4' />
                                                                                <span className='ms-1 me-2 text-success'>Academic Committee</span>
                                                                            </span>
                                                                        }

                                                                        {
                                                                            x?.isHallProvost
                                                                            &&
                                                                            <span className='col-5'>
                                                                                <AiFillTag className='text-warning fs-4' />
                                                                                <span className='ms-1 me-2  text-warning'>Hall Provost</span>
                                                                            </span>
                                                                        }
                                                                    </div>

                                                                    <div className='text-start pt-3'>
                                                                        <Button variant="primary" className=''
                                                                            onClick={() => { makeAcademicCommittee(x?._id) }}
                                                                        >
                                                                            Make Academic Committee Member
                                                                        </Button>
                                                                        <br />
                                                                        <Button variant="danger" className=' mt-3'
                                                                            onClick={() => { removeAcademicCommittee(x?._id) }}
                                                                        >
                                                                            Remove Academic Committee Member
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                        }
                    </>
            }
        </div>
    );
};

export default AddAcademicCommittee;

