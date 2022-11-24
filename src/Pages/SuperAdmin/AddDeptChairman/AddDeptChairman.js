import React, { useEffect, useState } from 'react';
import { Button, Card, Form, InputGroup, Spinner } from 'react-bootstrap';
import { AiFillTag } from "react-icons/ai";
import Swal from 'sweetalert2';
import Departments from '../../../Assets/Department';
import checkDepartmentName from '../../../Functions/DeptCodeToDeptName';

import userPhoto from "../../../images/user.png"
import studentPhoto from "../../../images/student.png"
import teacherPhoto from "../../../images/teacher.png"
import chairmanPhoto from "../../../images/chairman.png"
import academicCommitteePhoto from "../../../images/academicCommittee.png"
import hallProvostPhoto from "../../../images/hallProvost.png"




const AddDeptChairman = () => {
    const [email, setEmail] = useState('');
    const [usersByEmail, setUsersByEmail] = useState([]);
    const [isLoadingUserByEmail, setIsLoadingUserByEmail] = useState(false);

    const [department, setDepartment] = useState('cse');
    const [chairman, setChairman] = useState({});
    const [isLoadingChairman, setIsLoadingChairman] = useState(true);

    const [changeChairman, setChangeChairman] = useState(true);

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
        // setMessage('');
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
                    console.log('chairman info = ', info);
                    setUsersByEmail(info?.data);
                    setIsLoadingUserByEmail(false);

                    if (info?.data?.length === 0) {
                        setMessage(`No user found with ${email}`);
                    }
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


    let chairmanImg = chairmanPhoto;

    if (chairman?.profile?.imageURL) {
        chairmanImg = chairman?.profile?.imageURL;
    }





    return (
        <div className='px-2 py-5 my-5 shadow-lg container w-100 mx-auto rounded '>
            <h2 className='text-center text-primary fw-bold '>Add Department Chairman</h2>
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
                                <div className='my-5 mx-auto d-flex flex-column w-25'>
                                    <h5 className='text-center text-success fw-bold mb-3'>Current Chairman</h5>
                                    <div className='mx-auto mb-2'>
                                        <img src={chairmanImg} style={{ width: "160px", height: "160px" }} alt="chairman" />
                                    </div>
                                    <div className='d-flex flex-column mx-auto'>
                                        <span className="fw-bold ms-4 ps-5"><span >Name:</span> <span style={{ color: "#815b5b" }}>{chairman?.profile?.firstName + ' ' + chairman?.profile?.lastName}</span></span>
                                        <span><span className="fw-bold ms-4 ps-5">Email:</span> <span style={{ color: "#815b5b" }}> {chairman?.email}</span></span>
                                    </div>

                                </div>
                                :
                                <div className='my-5 text-center'>

                                    <h4 className='py-3 fw-bold text-muted'>There is no Chairman for <span className='text-primary'>{checkDepartmentName(department)} </span> Department</h4>
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
                            (usersByEmail?.length === 0)
                                ?

                                <div className='text-center'>
                                    <h4>{message} </h4>
                                </div>
                                :
                                <div className='container my-5'>
                                    <h4 className='text-center my-5'><u>Search Result</u></h4>
                                    <div className='row'>
                                        {
                                            usersByEmail.map(x =>
                                                <div className='col-lg-6 col-md-12 col-sm-12'>
                                                    <Card key={x?._id} className="mb-3 shadow-sm">
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
                                                                <div className='ms-4 pt-3'>
                                                                    <h4 className='text-start fw-bold'> {x?.profile?.firstName + ' ' + x?.profile?.lastName}</h4>

                                                                    <h6 className='text-start '> Email:  {x?.email}</h6>
                                                                    {
                                                                        x?.department
                                                                        &&
                                                                        <h6 className='text-start s'> Department: {x?.department?.toUpperCase()}</h6>
                                                                    }

                                                                    <div className='text-start'>
                                                                        {
                                                                            x?.isStudent
                                                                            &&
                                                                            <>
                                                                                <AiFillTag className=' fs-4' />
                                                                                <span className='ms-1 me-2'>Student</span>
                                                                            </>
                                                                        }

                                                                        {
                                                                            x?.isTeacher
                                                                            &&
                                                                            <>
                                                                                <AiFillTag className='text-info fs-4' />
                                                                                <span className='ms-1 me-2 text-info'>Teacher</span>
                                                                            </>
                                                                        }

                                                                        {
                                                                            x?.isDeptChairman
                                                                            &&
                                                                            <>
                                                                                <AiFillTag className='text-primary fs-4' />
                                                                                <span className='ms-1 me-2 text-primary'>Department Chairman</span>
                                                                            </>
                                                                        }

                                                                        {
                                                                            x?.isAcademicCommittee
                                                                            &&
                                                                            <>
                                                                                <AiFillTag className='text-success fs-4' />
                                                                                <span className='ms-1 me-2 text-success'>Academic Committee</span>
                                                                            </>
                                                                        }

                                                                        {
                                                                            x?.isHallProvost
                                                                            &&
                                                                            <>
                                                                                <AiFillTag className='text-warning fs-4' />
                                                                                <span className='ms-1 me-2  text-warning'>Hall Provost</span>
                                                                            </>
                                                                        }
                                                                    </div>

                                                                    <div className='text-start pt-3'>
                                                                        <Button variant="primary" className=''
                                                                            onClick={() => { makeDepartmentChairman(x?._id) }}
                                                                        >
                                                                            Make Department Chaimran
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

export default AddDeptChairman;

