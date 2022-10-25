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
    const name = (user?.fullName);
    const session = '20' + parseInt(id.substring(2, 4)) - 1 + '-' + id.substring(2, 4);
    const hallName = (user?.hall?.name)
    const hallId = (user?.hall?.hallId)
    const studentProfileId = user?.profileId;
    const department = user?.department;
    const departmentName = checkDepartmentNameFromIdCode(id);

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
    const [degree, setDegree] = useState('');
    const [semesterCode, setSemesterCode] = useState(0);
    // const [name, setName] = useState('');
    // const [session, setSession] = useState('');
    // const [hallName, setHallName] = useState('');
    // const [hallId, setHallId] = useState('');
    const [isLoadingStudent, setIsLoadingStudent] = useState(true);
    const [creditError, setCreditError] = useState('');
    const [applications, setApplications] = useState([]);
    const [regularCourseAppliedDone, setRegularCourseAppliedDone] = useState(false);

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
    // useEffect(() => {
    //     fetch(`http://localhost:5000/application-course-registration/${email.substring(0, 7)}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log('applications = ', data);
    //             setApplications(data);
    //             data.map(x => {
    //                 if (x?.regularCourses?.length !== 0) {
    //                     setRegularCourseAppliedDone(true)
    //                     return true;
    //                 }
    //             })
    //         })
    // }, [])


    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/student-result/get-semester-code/${user?.profileId}`)
            .then(res => res.json())
            .then(result => {
                if (result?.status === 'fail') {
                    Toast.fire({
                        icon: 'error',
                        title: result.message
                    })
                    history.push('/home');
                    return;
                }
                setSemesterCode(result?.data?.semesterCode)
                // console.log(user);
                const id = user?.email.substring(0, 7);
                // const session = '20' + parseInt(id.substring(2, 4)) - 1 + '-' + id.substring(2, 4);
                // setName(user?.fullName);
                // setSession(session);
                // setHallName(user?.hall?.name)
                // setHallId(user?.hall?.hallId)
            })
    }, [user])

    useEffect(() => {
        if (semesterCode !== 0) {
            fetch(`http://localhost:5000/api/v1/semester/courses-running/${semesterCode}`, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
                }
            })
                .then(res => res.json())
                .then(info => {

                    setRegularCourses(info?.data?.coursesMarks);
                    setSemesterName(info?.data?.name)
                    setDegree(info?.data?.degree)
                    let sum = 0;
                    info?.data?.coursesMarks.map(x => sum += x.credit)
                    setCredit(sum);
                    setTotalCredit(sum);
                    setIsLoadingRegularCourse(false)
                })
        }
        // })
    }, [semesterCode])
    // console.log(hallName)

    useEffect(() => {
        if (semesterCode !== 0) {
            fetch(`http://localhost:5000/api/v1/semester/courses-previous/${semesterCode}`, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
                }
            })
                .then(res => res.json())
                .then(info => {
                    // console.log('Backlog course ', info);
                    const arr = []
                    info?.data?.map(c => {
                        arr.push(c?.course)
                    })
                    // console.log('course ', arr);
                    setBacklogCourses(arr);
                    // setIsLoadingBacklogCourse(false)
                })
        }
    }, [semesterCode])


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
            // fetch('http://localhost:5000/application-course-registration', {
            //     method: 'put',
            //     headers: {
            //         'content-type': 'application/json'
            //     },
            //     body: JSON.stringify(application)
            // })
            //     .then(res => res.json())
            //     .then(data => {
            //         console.log("data ", data);
            //         if (data.insertedId) {
            //             Toast.fire({
            //                 icon: 'success',
            //                 title: 'Successfully Regsitered'
            //             })
            //             reset();
            //             history.push('/home')
            //         }
            //     });
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
                // (isLoadingRegularCourses | isLoadingBacklogCourses | isLoadingHall | isLoadingStudent)
                //     ?
                //     <div className='text-center my-5 py-5 '>
                //         <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                //             <span className="visually-hidden">Loading...</span>
                //         </Spinner>
                //     </div>
                //     :
                <>
                    {
                        regularCourseAppliedDone === false
                            ?
                            <div>
                                <div className='container-fluid shadow-lg rounded w-75 my-5 py-2'>
                                    <h4 className='text-center py-3 fw-bold'> Course Registration from</h4>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <h5>
                                            <input type='text' className="w-100 text-center border-0" value={`${semesterName} ${degree} Final Examination `} />
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
                                                <input type='text'  {...register("departmentName", { required: true })} className="w-100" value={departmentName} />
                                                <input type='text' hidden  {...register("department", { required: true })} className="w-100" value={department} />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className='text-primary'>Session: </Form.Label>
                                                <input type='text' {...register("session", { required: true })} className="w-100" value={session} />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label className='text-primary'>Hall: </Form.Label>
                                                <input type='text' {...register("hall_name")} readOnly className="w-100" value={hallName} />
                                                <input type='text' {...register("hall_id")} hidden className="w-100" value={hallId} />
                                            </Form.Group>
                                            <input type='text' hidden {...register("studentProfileId", { required: true })} className="w-100" value={studentProfileId} />
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
                                                            // console.log(x);
                                                            return (<tr key={`${x.courseCode}`} className='text-center' style={{ border: "1px solid black" }}>
                                                                <td style={{ border: "1px solid black" }}>{x?.courseCode}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.courseTitle}</td>
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
                                                            // if (x.isRunningCourse) {
                                                            return (<tr key={`${x.courseCode}`} className='text-center' style={{ border: "1px solid black" }}>
                                                                <td style={{ border: "1px solid black" }}>
                                                                    <input type='text' {...register(`${x?.courseCode}_code`)} className="w-100 border-0 text-center input-color-inherit" value={x?.courseCode} />
                                                                </td>
                                                                <td style={{ border: "1px solid black" }}>
                                                                    <input type='text' {...register(`${x?.courseCode}_title`)} className="w-100 border-0 text-center input-color-inherit" value={x?.courseTitle} />
                                                                </td>
                                                                <td style={{ border: "1px solid black" }}>
                                                                    <Form.Check
                                                                        inline
                                                                        size='lg'
                                                                        type='checkbox'
                                                                        label="Select"
                                                                        id={`${x?.course_code}_check`}
                                                                        {...register(`${x?.courseCode}_check`)}
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
                                                                    <input type='text' {...register(`${x?.courseCode}_credit`)} className="w-100 border-0 text-center input-color-inherit" value={x?.credit} />
                                                                </td>
                                                                <input type='text' hidden {...register(`${x?.courseCode}_courseMarksId`)} className="w-100 border-0 text-center input-color-inherit" value={x?._id} />
                                                            </tr>)
                                                            // }
                                                        })
                                                    }
                                                    <tr className='text-center' style={{ border: "1px solid black" }}>
                                                        <td></td>
                                                        <td></td>
                                                        <td style={{ border: "1px solid black" }} className='fw-bold'>Total Backlog Credit</td>
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