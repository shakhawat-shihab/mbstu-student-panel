import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Nav, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import checkDepartmentNameFromIdCode from '../../../Functions/IdCodeToDeptName';
import useAuth from '../../../Hooks/useAuth';
import Application from '../Application/Application';

const ApplyToSupervisor = () => {
    const { courseId } = useParams();
    const { user } = useAuth();
    const email = user?.email;
    const id = email.substr(0, 7);
    const name = (user?.fullName);
    const session = '20' + parseInt(id.substring(2, 4)) - 1 + '-' + id.substring(2, 4);
    const studentProfileId = user?.profileId;
    const department = user?.department;
    const departmentName = checkDepartmentNameFromIdCode(id);

    const [student, setStudent] = useState({});
    const [isLoadingTeacher, setIsLoadingTeacher] = useState(true);
    const [teachers, setTeachers] = useState([]);
    const [courseCode, setCourseCode] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [waitMessage, setWaitMessage] = useState(false);
    const [message, setMessage] = useState(false);
    const [errorMessageForId, setErrorMessageForId] = useState('');
    const [state, setState] = useState(1);
    const [proposals, setProposals] = useState([]);
    const [isLoadingProposals, setIsLoadingProposals] = useState(true);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

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
        fetch(`http://localhost:5000/api/v1/project-application/my-proposal/${courseId}`, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        })
            .then(res => res.json())
            .then(proposal => {
                // console.log("proposal ", proposal);
                setProposals(proposal.data);
                setIsLoadingProposals(false)

            })
    }, [courseId])


    // useEffect(() => {
    //     fetch(`http://localhost:5000/semesters/isRunning/${courseCode}/${semesterCode}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             if (Object.keys(data).length === 0) {
    //                 setIsRunning(false);
    //             }
    //             else {
    //                 setIsRunning(true);
    //             }
    //             setIsLoading(false);
    //             setTeachers(data);
    //         })
    // }, [semesterCode, courseCode]);
    // useEffect use kore teacher nam khuje ber korbo jar kase se already allocated

    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/marks/load-teacher/${courseId}`, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        })
            .then(res => res.json())
            .then(info => {
                // console.log("teachers of a project course ", info);
                setCourseCode(info?.data?.courseCode);
                setCourseTitle(info?.data?.courseTitle)
                setTeachers(info?.data?.teacherList);
                setIsLoadingTeacher(false);
            })
    }, [courseId])

    // console.log(teachers);




    const onSubmit = data => {
        // console.log('on submit ', data);

        const application = {};

        application.courseCode = data.courseCode;
        application.courseTitle = data.courseTitle;
        application.courseMarksId = data.courseId;
        application.projectApplicationTitle = data.projectApplicationTitle;
        application.projectApplicationDescription = data.projectApplicationDescription;


        application.department = data.department;
        application.departmentName = data.departmentName;
        const obj = {};
        obj.teacherProfileId = data.teacher.split("=/=")[0]
        obj.name = data.teacher.split("=/=")[1]
        application.teacher = obj

        application.applicantName = data.applicantName;
        application.applicantId = data.applicantId;
        application.applicantEmail = data.applicantEmail;
        application.applicantProfileId = data.applicantProfileId;
        application.applicantSession = data.applicantSession;


        console.log('application to push ', application);

        fetch('http://localhost:5000/api/v1/project-application/create', {
            method: 'post',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
            body: JSON.stringify(application)
        })
            .then(res => res.json())
            .then(data => {
                // console.log("data ", data);
                if (data?.status === 'success') {
                    Toast.fire({
                        icon: 'success',
                        title: data.message
                    })
                    reset();
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: data.message
                    })
                }
            });
    }
    return (
        <div>
            <div className='container my-5'>
                <Nav justify variant="pills" defaultActiveKey="1" >
                    <Nav.Item>
                        <Nav.Link onClick={() => { setState(1) }} eventKey="1" >My Application</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={() => { setState(2) }} eventKey="link-1" >Apply For Supervisor</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
            {
                (isLoadingProposals || isLoadingTeacher)
                    ?
                    <div className='text-center my-5 py-5 '>
                        <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <>
                        {
                            state === 1 ?

                                <div className='container my-4 py-3 w-100'>
                                    {/* <h4 className='text-center text-primary mb-4'>My Applications</h4> */}
                                    {
                                        proposals?.map(x =>
                                            <Application key={x._id} applicationDetais={x}></Application>)
                                    }
                                </div>

                                :

                                <div className='w-75 mx-auto shadow-lg rounded px-4 py-5 my-4'>
                                    {/* <h2 className='text-center'>Apply </h2> */}
                                    <Form onSubmit={handleSubmit(onSubmit)}>

                                        <div className="row row-cols-lg-2 row-cols-md-2 row-cols-sm-1">
                                            <Form.Group className="mb-3">
                                                <Form.Label className='text-primary'>Course Title: </Form.Label>
                                                <input type='text' {...register("courseTitle")} className="w-100" value={courseTitle} />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className='text-primary'>Course Code: </Form.Label>
                                                <input type='text' {...register("courseCode", { required: true })} className="w-100 text-uppercase" value={courseCode} />
                                                <input type='text' hidden {...register("courseId", { required: true })} className="w-100 text-uppercase" value={courseId} />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className='text-primary'>Name: </Form.Label>
                                                <input type='text' {...register("applicantName")} className="w-100" defaultValue={name} />
                                                <input hidden type='text' {...register("applicantEmail")} className="w-100" value={email} />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className='text-primary'>ID: </Form.Label>
                                                <input type='text' {...register("applicantId", { required: true })} className="w-100 text-uppercase" value={id} />
                                                <input type='text' hidden {...register("applicantProfileId", { required: true })} className="w-100" value={studentProfileId} />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className='text-primary'>Department: </Form.Label>
                                                <input type='text'  {...register("departmentName", { required: true })} className="w-100" value={departmentName} />
                                                <input type='text' hidden  {...register("department")} className="w-100" value={department} />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className='text-primary'>Session: </Form.Label>
                                                <input type='text' {...register("applicantSession")} className="w-100" value={session} />
                                            </Form.Group>

                                            {/* <Form.Group className="mb-3">
                                                 <Form.Label className='text-primary'>Email: </Form.Label>
                                                 <input type='text' {...register("email")} className="w-100" value={email} />
                                             </Form.Group> */}

                                        </div>


                                        <Form.Group className="mb-3" >
                                            <Form.Label className='text-primary'>Subject</Form.Label>
                                            <Form.Control {...register("projectApplicationTitle", { required: true })} type="text" placeholder="Write the Subject" />
                                        </Form.Group>
                                        <Form.Group className="mb-3" >
                                            <Form.Label className='text-primary'>Teacher List</Form.Label>
                                            <Form.Select {...register("teacher", { required: true })}>
                                                <option value="">Select teacher</option>
                                                {
                                                    teachers.map(x => {
                                                        // console.log(x);
                                                        return (<option key={x?._id} value={`${x?._id}=/=${x?.firstName} ${x?.lastName}`}>
                                                            {
                                                                x?.firstName
                                                                    ?
                                                                    x?.firstName + ' ' + x?.lastName
                                                                    :
                                                                    x?.email
                                                            }
                                                        </option>)
                                                    })
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3" >
                                            <Form.Label className='text-primary'>Give a short description on which type of work you want to do</Form.Label>
                                            <Form.Control {...register("projectApplicationDescription", { required: true })} as="textarea" rows={3} />
                                        </Form.Group>

                                        <br />
                                        <p className='text-danger' >{errorMessageForId}</p>
                                        <div className='my-3'>
                                            <Form.Control type="submit" value='Apply' className='btn btn-primary w-75' />
                                        </div>
                                    </Form>
                                </div>
                            // :
                            // <h5 className='text-center text-danger'>Sorry there is no running semester</h5>

                        }
                    </>
            }





        </div >
    );
};

export default ApplyToSupervisor;