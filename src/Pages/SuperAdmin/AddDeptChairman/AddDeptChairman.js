import React, { useEffect, useState } from 'react';
import { Button, Card, Form, InputGroup, Spinner } from 'react-bootstrap';
import mbstuLogo from "../../../images/mbstu-logo.jpg"
import { AiFillTag } from "react-icons/ai";
import Swal from 'sweetalert2';
import Departments from '../../../Assets/Department';
import checkDepartmentName from '../../../Functions/DeptCodeToDeptName';
const AddDeptChairman = () => {
    const [email, setEmail] = useState('');
    const [usersByEmail, setUsersByEmail] = useState([]);
    const [isLoadingUserByEmail, setIsLoadingUserByEmail] = useState(false);

    const [department, setDepartment] = useState('cse');
    const [chairman, setChairman] = useState({});
    const [isLoadingChairman, setIsLoadingChairman] = useState(true);

    const [changeChairman, setChangeChairman] = useState(true);

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
        fetch(`http://localhost:5000/api/v1/user/find-dept-chairman/${department}`, {
            method: 'get',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
        })
            .then(res => res.json())
            .then(info => {
                // console.log('chairman info = ', info);
                setChairman(info?.data)
                setIsLoadingChairman(false);
            })
    }, [department, changeChairman])


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

    const makeDepartmentChairman = (userId) => {
        // console.log('userId ', userId);
        fetch(`http://localhost:5000/api/v1/user/add-dept-chairman/${department}/${userId}`, {
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
                    setChangeChairman(!changeChairman);
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
                <h2 className='text-center'>Add Department Chairman</h2>

                {/* select department */}
                <div className=' my-4'>
                    <Form >
                        <Form.Group className="mb-1 w-100 mx-auto">
                            <Form.Label className='text-primary'>Select Department:</Form.Label>
                            <br></br>
                            <Form.Select
                                onChange={(e) => {
                                    setDepartment(e.target.value)
                                }}>

                                {
                                    Departments.map(x =>
                                        <option key={x?.value} value={x?.value}>{x?.label} </option>
                                    )
                                }
                                {/* <option key='cse' value='cse'>CSE </option>
                                <option key='ict' value='ict'>ICT </option>
                                <option key='te' value='te'>TE </option> */}

                            </Form.Select>
                        </Form.Group>
                    </Form>
                </div>

                {
                    isLoadingChairman
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
                                Object.keys(chairman)?.length !== 0
                                    ?
                                    <div className='my-4'>
                                        <p>Name: {chairman?.profile?.firstName + ' ' + chairman?.profile?.lastName}</p>
                                        <p>Email: {chairman?.email}</p>
                                    </div>
                                    :
                                    <div className='my-4'>

                                        <h4>There is no Chairman for <span className='text-primary'>{checkDepartmentName(department)} </span> Department</h4>
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

                                        <h4>No user found with </h4>

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
                                                                onClick={() => { makeDepartmentChairman(x?._id) }}
                                                            >
                                                                Make Depart Chaimran
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

export default AddDeptChairman;