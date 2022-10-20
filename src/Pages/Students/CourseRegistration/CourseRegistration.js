import React, { useEffect, useState } from 'react';
import { Form, Spinner, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
// import checkHallName from '../../../Functions/HallCodeToHaLLName';
import checkDepartmentNameFromIdCode from '../../../Functions/IdCodeToDeptName';
import checkSemesterName from '../../../Functions/SemesterCodeToSemesterName';
import useAuth from '../../../Hooks/useAuth';
// import Application from '../Application/Application';
import BacklogCourseRegistration from './BacklogCourseRegistration/BacklogCourseRegistration';
import './CourseRegistration.css'
const CourseRegistration = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const history = useHistory()
    const { user } = useAuth();
    const email = user?.email;
    const id = email.substr(0, 7);
    let session = user.email.substring(2, 4);
    session = '20' + parseInt(session) - 1 + '-' + session;
    const department = checkDepartmentNameFromIdCode(id);

    const [semester, setSemester] = useState("");
    const [regularCourses, setRegularCourses] = useState([]);
    const [isLoadingRegularCourses, setIsLoadingRegularCourse] = useState(true);
    const [backlogCourses, setBacklogCourses] = useState([]);
    const [isLoadingBacklogCourses, setIsLoadingBacklogCourse] = useState(true);
    const [credit, setCredit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [hall, setHall] = useState({});
    const [isLoadingHall, setIsLoadingHall] = useState(true);
    const [semesterName, setSemesterName] = useState('');
    const [semesterCode, setSemesterCode] = useState(0);
    const [name, setName] = useState('');
    const [isLoadingStudent, setIsLoadingStudent] = useState(true);
    const [creditError, setCreditError] = useState('');

    const [applications, setApplications] = useState([]);
    const [regularCourseAppliedDone, setRegularCourseAppliedDone] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/application-course-registration/${email.substring(0, 7)}`)
            .then(res => res.json())
            .then(data => {
                console.log('applications = ', data);
                setApplications(data);
                data.map(x => {
                    if (x?.regularCourses?.length !== 0) {
                        setRegularCourseAppliedDone(true)
                        return true;
                    }
                })
            })
    }, [])

    useEffect(() => {
        fetch(`http://localhost:5000/get-regular-courses/${email.substring(0, 7)}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setRegularCourses(data.courses);
                setSemesterName(checkSemesterName(data.semester_code))
                setSemesterCode(data.semester_code)
                let sum = 0;
                data.courses.map(x => sum += x.credit)
                setCredit(sum);
                setTotalCredit(sum);
                setIsLoadingRegularCourse(false)
            })
    }, [email])

    useEffect(() => {
        fetch(`http://localhost:5000/get-backlog-courses/${email.substring(0, 7)}`)
            .then(res => res.json())
            .then(data => {
                console.log('Backlog course ', data);
                setBacklogCourses(data);
                setIsLoadingBacklogCourse(false)
            })
    }, [email])
    useEffect(() => {
        fetch(`http://localhost:5000/get-hall-select/${email.substring(0, 7)}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setHall(data);
                setIsLoadingHall(false)
            })
    }, [email])
    useEffect(() => {
        fetch(`http://localhost:5000/students/${email}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setName(data?.displayName);
                setIsLoadingStudent(false)
            })
    }, [email])

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
    const onSubmit = data => {
        //console.log('error ', errors);
        console.log('form data ', data);
        const backlog = [];
        for (const key in data) {
            if (key.endsWith('_check') && data[`${key}`] === true) {
                //console.log(key)
                const obj = {}
                obj.course_code = data[`${key.split("_")[0]}_code`];
                obj.course_title = data[`${key.split("_")[0]}_title`];
                obj.credit = data[`${key.split("_")[0]}_credit`];
                backlog.push(obj)
            }
        }
        //console.log(backlog)
        const application = {}
        application.s_id = data.id;
        application.displayName = data.name;
        application.department = data.department;
        application.session = data.session;
        application.hall_code = data.hall_code;
        application.semester = data.semester;
        application.semester_code = data.semester_code;
        application.backlogCourses = backlog;
        application.totalCredit = totalCredit;
        application.isPaymentDone = false;

        application.regularCourses = regularCourses.map(c => ({ course_code: c.course_code, course_title: c.course_title, credit: c.credit }))
        console.log('form to push ', application);
        if (totalCredit < 27) {
            fetch('http://localhost:5000/application-course-registration', {
                method: 'put',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(application)
            })
                .then(res => res.json())
                .then(data => {
                    console.log("data ", data);
                    if (data.insertedId) {
                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully Regsitered'
                        })
                        reset();
                        history.push('/home')
                    }
                });
        }
        else {
            Toast.fire({
                icon: 'error',
                title: "You can't take more than 27 credit in a semester"
            })
        }
    };
    return (
        <>
            {
                (isLoadingRegularCourses | isLoadingBacklogCourses | isLoadingHall | isLoadingStudent)
                    ?
                    <div className='text-center my-5 py-5 '>
                        <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <>
                        {
                            regularCourseAppliedDone === false
                                ?
                                <div>
                                    <div className='container-fluid shadow-lg rounded w-75 my-5 py-2'>
                                        <h4 className='text-center py-3 fw-bold'> Course Registration from</h4>
                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <h5>
                                                <input type='text' {...register("semester", { required: true })} className="w-100 text-center border-0" value={`${semesterName} Final Examination `} />
                                            </h5>

                                            <div className="row row-cols-lg-2 row-cols-md-2 row-cols-sm-1">
                                                <Form.Group className="mb-3">
                                                    <Form.Label className='text-primary'>Name: </Form.Label>
                                                    <input type='text' {...register("name")} className="w-100" defaultValue={name} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className='text-primary'>ID: </Form.Label>
                                                    <input type='text' {...register("id", { required: true })} className="w-100 text-uppercase" value={id} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className='text-primary'>Department: </Form.Label>
                                                    <input type='text'  {...register("department", { required: true })} className="w-100" value={department} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className='text-primary'>Session: </Form.Label>
                                                    <input type='text' {...register("session", { required: true })} className="w-100" value={session} />
                                                </Form.Group>
                                                <Form.Group className="mb-3">
                                                    <Form.Label className='text-primary'>Hall: </Form.Label>
                                                    <input type='text' {...register("hall_name")} className="w-100" value={hall?.hall_name} />
                                                </Form.Group>
                                                <input type='text' hidden {...register("hall_code", { required: true })} className="w-100" value={hall?.hall_code} />
                                                <input type='text' hidden {...register("semester_code", { required: true })} className="w-100" value={semesterCode} />
                                            </div>


                                            <br />
                                            <Form.Group className='mb-3'>
                                                <Form.Label className='text-primary mb-3'>Regular Courses: </Form.Label>
                                                <Table responsive striped bordered hover style={{ border: "1px solid black" }}>
                                                    <col width="15%" />
                                                    <col width="40%" />
                                                    <col width="10%" />

                                                    <thead>
                                                        <tr className='text-center' style={{ border: "1px solid black" }}>
                                                            <th style={{ border: "1px solid black" }}>Course Code</th>
                                                            <th style={{ border: "1px solid black" }}>Course Title</th>
                                                            <th style={{ border: "1px solid black" }}>Credit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            regularCourses?.map(x => {
                                                                return (<tr key={`${x.course_code}`} className='text-center' style={{ border: "1px solid black" }}>
                                                                    <td style={{ border: "1px solid black" }}>{x?.course_code}</td>
                                                                    <td style={{ border: "1px solid black" }}>{x?.course_title}</td>
                                                                    <td style={{ border: "1px solid black" }}>{x?.credit}</td>
                                                                </tr>)
                                                            })
                                                        }
                                                        <tr className='text-center' style={{ border: "1px solid black" }}>
                                                            <td></td>
                                                            <td style={{ border: "1px solid black" }} className='fw-bold'>Total Credit</td>
                                                            <td style={{ border: "1px solid black" }} className='fw-bold'>{credit}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>

                                                <br />
                                            </Form.Group>

                                            <Form.Group className='mb-3'>
                                                <Form.Label className='text-primary mb-3'>Backlog Courses: </Form.Label>
                                                <Table responsive striped bordered hover className='text-center' style={{ border: "1px solid black" }}>
                                                    <thead>
                                                        <tr style={{ border: "1px solid black" }}>
                                                            <th style={{ border: "1px solid black" }}>Course Code</th>
                                                            <th style={{ border: "1px solid black" }}>Course Title</th>
                                                            {/* <th style={{ border: "1px solid black" }}>Status</th> */}
                                                            <th style={{ border: "1px solid black" }}>Check to select</th>
                                                            <th style={{ border: "1px solid black" }}>Credit</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            backlogCourses?.map(x => {
                                                                if (x.isRunningCourse) {
                                                                    return (<tr key={`${x.course_code}`} className='text-center' style={{ border: "1px solid black" }}>
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <input type='text' {...register(`${x?.course_code}_code`)} className="w-100 border-0 text-center input-color-inherit" value={x?.course_code} />
                                                                        </td>
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <input type='text' {...register(`${x?.course_code}_title`)} className="w-100 border-0 text-center input-color-inherit" value={x?.course_title} />
                                                                        </td>
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <Form.Check
                                                                                inline
                                                                                size='lg'
                                                                                type='checkbox'
                                                                                label="Select"
                                                                                id={`${x?.course_code}_check`}
                                                                                {...register(`${x?.course_code}_check`)}
                                                                                onChange={(e) => {
                                                                                    //console.log(`${x?.course_code}_check`, e.target.checked)
                                                                                    if (e.target.checked) {
                                                                                        const sum = totalCredit + parseFloat(x?.credit)
                                                                                        setTotalCredit(sum)
                                                                                        if (sum > 27)
                                                                                            setCreditError("You can't take more than 27 credit")
                                                                                    }
                                                                                    else {
                                                                                        const sum = totalCredit - parseFloat(x?.credit)
                                                                                        setTotalCredit(sum)
                                                                                        if (sum <= 27)
                                                                                            setCreditError("")
                                                                                    }
                                                                                }
                                                                                }
                                                                            />
                                                                        </td>
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <input type='text' {...register(`${x?.course_code}_credit`)} className="w-100 border-0 text-center input-color-inherit" value={x?.credit} />
                                                                        </td>
                                                                    </tr>)
                                                                }
                                                            })
                                                        }
                                                        <tr className='text-center' style={{ border: "1px solid black" }}>
                                                            <td></td>
                                                            <td></td>
                                                            <td style={{ border: "1px solid black" }} className='fw-bold'>Total Credit</td>
                                                            <td className='fw-bold'>{totalCredit - credit}</td>
                                                        </tr>
                                                    </tbody>
                                                </Table>
                                                {
                                                    creditError
                                                    &&
                                                    <span className='text-danger'> {creditError} </span>
                                                }

                                            </Form.Group>

                                            <h4 className='text-center'>Total Credits taken {totalCredit}</h4>
                                            <div className='text-center my-4'>
                                                <input type="submit" value='Register' className='btn btn-primary' />
                                            </div>
                                        </Form>

                                    </div>
                                </div>
                                :
                                <div>
                                    <BacklogCourseRegistration
                                        backlogCourses={backlogCourses}
                                        applications={applications}
                                        name={name}
                                        id={id}
                                        department={department}
                                        session={session}
                                        hall_code={hall?.hall_code}
                                        hall_name={hall?.hall_name}
                                    />
                                </div>
                        }
                    </>



            }

        </>

    );
};

export default CourseRegistration;