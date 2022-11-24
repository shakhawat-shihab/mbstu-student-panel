import React, { useEffect, useState } from 'react';
import { Button, Card, Form, InputGroup, Spinner } from 'react-bootstrap';
import mbstuLogo from "../../../images/mbstu-logo.jpg"
import { AiFillTag } from "react-icons/ai";
import Swal from 'sweetalert2';
import checkHallName from '../../../Functions/HallCodeToHaLLName';
import Halls from '../../../Assets/Hall';

const AddHallProvost = () => {
    const [email, setEmail] = useState('');
    const [usersByEmail, setUsersByEmail] = useState([]);
    const [isLoadingUserByEmail, setIsLoadingUserByEmail] = useState(false);

    const [halls, setHalls] = useState([]);
    const [hallsLoading, setHallsLoading] = useState(true);
    const [hall, setHall] = useState('');
    const [provost, setProvost] = useState({});
    const [isLoadingProvost, setIsLoadingProvost] = useState(true);

    const [changeProvost, setChangeProvost] = useState(true);

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

    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/hall/get-halls`, {
            method: 'get',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
        })
            .then(res => res.json())
            .then(info => {
                console.log('halls info = ', info);
                setHalls(info?.data);
                setHall(info?.data?.[0]?.codeName);
                setHallsLoading(false);
            })
    }, [])

    useEffect(() => {
        console.log('hall ==> ', hall)
        if (hall !== '') {
            fetch(`http://localhost:5000/api/v1/user/find-hall-provost/${hall}`, {
                method: 'get',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
                },
            })
                .then(res => res.json())
                .then(info => {
                    // console.log('chairman info = ', info);
                    setProvost(info?.data);
                    setIsLoadingProvost(false);
                })
        }

    }, [hall, changeProvost])


    const findUsersByEmail = () => {
        // console.log('email  ', email);
        if (email.trim() !== '') {
            setIsLoadingUserByEmail(true);
            fetch(`http://localhost:5000/api/v1/user/email/${email.trim()}`, {
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
                })
        }
    }

    const addHallProvost = (userId) => {
        console.log('userId ', userId);
        fetch(`http://localhost:5000/api/v1/user/add-hall-provost/${hall}/${userId}`, {
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
                    setChangeProvost(!changeProvost);
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
        <div className='text-center'>
            <div className=' mx-4 my-5'>
                <h2 className='text-center'>Add Hall Provost</h2>

                {/* select hall */}
                {
                    hallsLoading
                        ?
                        <div className='text-center my-4 '>
                            <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>

                        </div>
                        :
                        <div className=' my-4'>
                            <Form >
                                <Form.Group className="mb-1 w-100 mx-auto">
                                    <Form.Label className='text-primary'>Select Hall:</Form.Label>
                                    <br></br>
                                    <Form.Select
                                        onChange={(e) => {
                                            setHall(e.target.value)
                                        }}>
                                        {
                                            halls?.map(x =>
                                                <option key={x?.codeName} value={x?.codeName}>{x?.name} </option>
                                            )
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        </div>
                }


                {
                    isLoadingProvost
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
                                Object.keys(provost)?.length !== 0
                                    ?
                                    <div className='my-4'>
                                        <p>Name: {provost?.profile?.firstName + ' ' + provost?.profile?.lastName}</p>
                                        <p>Email: {provost?.email}</p>
                                    </div>
                                    :
                                    <div className='my-4'>

                                        <h4>There is no Provost for <span className='text-primary'>{checkHallName(hall)} </span></h4>
                                    </div>
                            }
                        </>
                }


                <div >
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
                                usersByEmail.length === 0
                                    ?
                                    <div className='my-4'>
                                        {

                                            <h4>No user found with </h4>
                                        }
                                    </div>
                                    :
                                    usersByEmail.map(x =>
                                        <Card key={x?._id} className="mb-3 shadow-sm">
                                            <div className='py-4 px-3'>
                                                <div className='d-flex'>
                                                    <div >
                                                        <img src={mbstuLogo} width='200px' />
                                                    </div>
                                                    <div className='ms-5'>
                                                        <h4 className='text-start mb-2'> {x?.profile?.firstName + ' ' + x?.profile?.lastName}</h4>
                                                        <br />
                                                        <h5 className='text-start '> Email:  {x?.email}</h5>
                                                        {
                                                            x?.department
                                                            &&
                                                            <h6 className='text-start s'> Department: {x?.department}</h6>
                                                        }

                                                        <div className='text-start'>
                                                            {
                                                                x?.isStudent
                                                                &&
                                                                <>
                                                                    <AiFillTag className=' fs-4' />
                                                                    <span className='ms-1 me-3'>Student</span>
                                                                </>
                                                            }

                                                            {
                                                                x?.isTeacher
                                                                &&
                                                                <>
                                                                    <AiFillTag className='text-info fs-4' />
                                                                    <span className='ms-1 me-3 text-info'>Teacher</span>
                                                                </>
                                                            }

                                                            {
                                                                x?.isDeptChairman
                                                                &&
                                                                <>
                                                                    <AiFillTag className='text-primary fs-4' />
                                                                    <span className='ms-1 me-3 text-primary'>Department Chairman</span>
                                                                </>
                                                            }

                                                            {
                                                                x?.isAcademicCommittee
                                                                &&
                                                                <>
                                                                    <AiFillTag className='text-success fs-4' />
                                                                    <span className='ms-1 me-3 text-success'>Academic Committee</span>
                                                                </>
                                                            }

                                                            {
                                                                x?.isHallProvost
                                                                &&
                                                                <>
                                                                    <AiFillTag className='text-warning fs-4' />
                                                                    <span className='ms-1 me-3  text-warning'>Hall Provost</span>
                                                                </>
                                                            }
                                                        </div>

                                                        <div className='text-start pt-3'>
                                                            <Button variant="primary" className=''
                                                                onClick={() => { addHallProvost(x?._id) }}
                                                            >
                                                                Make Hall Provost
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>


                                            </div>
                                        </Card>
                                    )
                            }
                        </>
                }

            </div>


        </div >
    );
};

export default AddHallProvost;