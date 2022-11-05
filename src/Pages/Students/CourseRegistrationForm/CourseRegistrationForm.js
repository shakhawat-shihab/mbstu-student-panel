import React, { useEffect, useState } from 'react';
import { Form, Spinner, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import checkDepartmentNameFromIdCode from '../../../Functions/IdCodeToDeptName';
import checkSemesterName from '../../../Functions/SemesterCodeToSemesterName';
import useAuth from '../../../Hooks/useAuth';
import './CourseRegistrationForm.css'
const CourseRegistrationForm = () => {
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

    const [regularCourses, setRegularCourses] = useState([]);
    const [isLoadingRegularCourses, setIsLoadingRegularCourse] = useState(true);
    const [backlogCourses, setBacklogCourses] = useState([]);
    const [isLoadingBacklogCourses, setIsLoadingBacklogCourse] = useState(true);
    const [previousApplicationCredit, setPreviousApplicationCredit] = useState(0);
    const [credit, setCredit] = useState(0);
    const [backlogCredit, setBacklogCredit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [semesterName, setSemesterName] = useState('');
    const [degree, setDegree] = useState('');
    const [semesterCode, setSemesterCode] = useState(-1);
    const [creditError, setCreditError] = useState('');
    const [regularCourseNotApplied, setRegularCourseNotApplied] = useState(true);

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
        fetch(`http://localhost:5000/api/v1/student-result/get-semester-code`, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            }
        })
            .then(res => res.json())
            .then(result => {
                fetch(`http://localhost:5000/api/v1/course-application/total-credit-taken`, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
                    }
                })
                    .then(res => res.json())
                    .then(info => {

                        console.log('regular course appplied ', info)
                        setPreviousApplicationCredit(info?.data?.totalCreditTaken)
                        setRegularCourseNotApplied(info?.data?.foundRegularCourse)
                        setSemesterCode(result?.data?.semesterCode)

                        // console.log(result?.data?.semesterCode)
                        // setCredit(info?.data)
                    })
            })
    }, [user])

    useEffect(() => {
        // if()
        // console.log("fgsgd ", regularCourseNotApplied, semesterCode)
        if (semesterCode !== -1 && regularCourseNotApplied === false) {
            fetch(`http://localhost:5000/api/v1/semester/courses-running/${semesterCode + 1}`, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
                }
            })
                .then(res => res.json())
                .then(info => {
                    console.log('info ========== ', info)
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
        else {
            setIsLoadingRegularCourse(false)
        }
    }, [semesterCode, previousApplicationCredit])

    useEffect(() => {
        if (semesterCode !== -1) {
            fetch(`http://localhost:5000/api/v1/semester/courses-previous/${semesterCode}`, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
                }
            })
                .then(res => res.json())
                .then(info => {
                    console.log('Backlog course ======== ', info);
                    // const arr = []
                    // info?.data?.map(c => {
                    //     arr.push(c?.course)
                    // })
                    setBacklogCourses(info?.data);
                    setIsLoadingBacklogCourse(false)
                })
        }
    }, [semesterCode])


    const onSubmit = data => {
        console.log('form data ', data);
        const backlog = [];
        for (const key in data) {
            if (key.endsWith('_check') && data[`${key}`] === true) {
                //console.log(key)
                // const obj = {}
                // obj.courseCode = data[`${key.split("_")[0]}_code`];
                // obj.course_title = data[`${key.split("_")[0]}_title`];
                // obj.credit = data[`${key.split("_")[0]}_credit`];
                backlog.push(data[`${key.split("_")[0]}_id`])
            }
        }
        const regular = [];
        regularCourses.map(x => {
            regular.push(x?._id)
        })

        const application = {}

        // data.name ? (application.name = data.name) : (application.name = "Backlog Exam")

        if (previousApplicationCredit > 0) {
            application.name = "Backlog Exam"
        }
        else {
            application.name = semesterName;
            application.semesterCode = semesterCode + 1;
        }

        application.department = data.department;
        application.departmentName = data.departmentName;
        application.degree = data.degree;

        application.applicantName = data.applicantName;
        application.applicantId = data.applicantId;
        application.applicantProfileId = data.applicantProfileId;
        application.applicantSession = data.applicantSession;
        application.applicantHallName = data.applicantHallName;
        application.applicantHallId = data.applicantHallId;

        application.regularCourses = regular;
        application.backlogCourses = backlog;

        if (regular?.length === 0 && backlog?.length === 0) {
            Toast.fire({
                icon: 'error',
                title: 'Select some course!'
            })
            return;
        }


        data.regularCourses = regularCourses.map(c => c._id)
        console.log('form to push ', application);
        // console.log('credit ', totalCredit)
        if (backlogCredit + credit + previousApplicationCredit < 27) {
            fetch('http://localhost:5000/api/v1/course-application/create', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
                },
                body: JSON.stringify(application)
            })
                .then(res => res.json())
                .then(info => {
                    console.log("info  ", info);
                    if (info?.status === 'success') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Registration successful.'
                        })
                        reset();
                        history.push('/home');
                    }
                    else {
                        Toast.fire({
                            icon: 'error',
                            title: 'Registration failed.'
                        })
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
    // console.log(totalCredit);
    // console.log(creditError);
    return (
        <>
            {
                // (isLoadingRegularCourses | isLoadingBacklogCourses | isLoadingHall | isLoadingStudent)
                (isLoadingRegularCourses || isLoadingBacklogCourses)
                    ?
                    <div className='text-center my-5 py-5 '>
                        <Spinner className='align-items-center justify-content-start mx-auto text-danger' animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <>
                        {
                            (regularCourses == null && backlogCourses?.length == 0)
                                ?
                                <div className=' d-flex justify-content-center align-items-center half-height' >
                                    <h5 className='text-center fs-2 text-secondary fw-bold error-opacity' >Sorry, There is no running semester for you</h5>
                                </div>
                                :
                                <>
                                    {

                                        // regularCourseAppliedDone === false
                                        //     ?
                                        <div>

                                            <div className='container-fluid shadow-lg rounded w-75 my-5 py-2'>
                                                <h4 className='text-center py-3 fw-bold'> Course Registration Form</h4>
                                                <Form onSubmit={handleSubmit(onSubmit)}>
                                                    <h5>
                                                        {
                                                            !semesterName ?
                                                                <p className='text-center'>Backlog Exam</p>
                                                                :
                                                                <p className='text-center'>{semesterName + ' Final Examination'}</p>
                                                        }
                                                        {/* <input type='text' hidden  {...register("name")} className="w-100 text-center border-0" defaultValue={`${semesterName}`} /> */}
                                                        <input type='text' hidden  {...register("degree")} className="w-100 text-center border-0" value={`${degree}`} />
                                                    </h5>

                                                    <div className="row row-cols-lg-2 row-cols-md-2 row-cols-sm-1">
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className='text-primary'>Name: </Form.Label>
                                                            <Form.Control type='text' {...register("applicantName")} className="w-100" defaultValue={name} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className='text-primary'>ID: </Form.Label>
                                                            <Form.Control type='text' {...register("applicantId", { required: true })} className="w-100 text-uppercase" value={id} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className='text-primary'>Department: </Form.Label>
                                                            <Form.Control type='text'  {...register("departmentName", { required: true })} className="w-100" value={departmentName} />
                                                            <Form.Control type='text' hidden  {...register("department", { required: true })} className="w-100" value={department} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className='text-primary'>Session: </Form.Label>
                                                            <Form.Control type='text' {...register("applicantSession", { required: true })} className="w-100" value={session} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className='text-primary'>Hall: </Form.Label>
                                                            <Form.Control type='text' {...register("applicantHallName")} readOnly className="w-100" value={hallName} />
                                                            <Form.Control type='text' {...register("applicantHallId")} hidden className="w-100" value={hallId} />
                                                        </Form.Group>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label className='text-primary'>Email: </Form.Label>
                                                            <Form.Control type='text' {...register("email", { required: true })} className="w-100" value={email} />
                                                        </Form.Group>
                                                        <Form.Control type='text' hidden {...register("applicantProfileId", { required: true })} className="w-100" value={studentProfileId} />
                                                    </div>


                                                    <br />
                                                    <Form.Group className='mb-3'>
                                                        {
                                                            (regularCourses?.length !== 0 && regularCourses != null) &&
                                                            <>
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
                                                                            <td style={{ border: "1px solid black" }} className='fw-bold'>Regular Courses Credit</td>
                                                                            <td style={{ border: "1px solid black" }} className='fw-bold'>{credit}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                            </>
                                                        }
                                                        <br />
                                                    </Form.Group>

                                                    <Form.Group className='mb-3'>
                                                        {
                                                            (backlogCourses.length !== 0) &&
                                                            <>
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
                                                                                return (<tr key={`${x.courseCode}`} className='text-center' style={{ border: "1px solid black" }}>
                                                                                    <td style={{ border: "1px solid black" }}>
                                                                                        <input type='text' {...register(`${x?.courseCode}_code`)} className="w-100 border-0 text-center input-color-inherit" value={x?.courseCode} />
                                                                                    </td>
                                                                                    <td style={{ border: "1px solid black" }}>
                                                                                        <input type='text' {...register(`${x?.courseCode}_title`)} className="w-100 border-0 text-center input-color-inherit" value={x?.courseTitle} />
                                                                                        <input type='text' hidden {...register(`${x?.courseCode}_id`)} className="w-100 border-0 text-center input-color-inherit" value={x?._id} />
                                                                                    </td>
                                                                                    <td style={{ border: "1px solid black" }}>
                                                                                        <Form.Check
                                                                                            inline
                                                                                            size='lg'
                                                                                            type='checkbox'
                                                                                            label="Select"
                                                                                            id={`${x?.courseCode}_check`}
                                                                                            {...register(`${x?.courseCode}_check`)}
                                                                                            onChange={(e) => {
                                                                                                //console.log(`${x?.courseCode}_check`, e.target.checked)
                                                                                                if (e.target.checked) {
                                                                                                    //critical
                                                                                                    setBacklogCredit(backlogCredit + parseFloat(x?.credit))


                                                                                                    const sum = credit + parseFloat(x?.credit) + previousApplicationCredit
                                                                                                    setTotalCredit(sum)
                                                                                                    if (sum > 27)
                                                                                                        setCreditError("You can't take more than 27 credit")
                                                                                                }
                                                                                                else {
                                                                                                    //critical
                                                                                                    setBacklogCredit(backlogCredit - parseFloat(x?.credit))

                                                                                                    const sum = credit - parseFloat(x?.credit) + previousApplicationCredit
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
                                                                        {/* backlog credit sum */}
                                                                        <tr className='text-center' style={{ border: "1px solid black" }}>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ border: "1px solid black" }} className='fw-bold'>Total Backlog Credit</td>
                                                                            <td className='fw-bold'>{backlogCredit}</td>
                                                                        </tr>

                                                                        {/* Previous application credit sum */}
                                                                        <tr className='text-center' style={{ border: "1px solid black" }}>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td style={{ border: "1px solid black" }} className='fw-bold'>Already Taken Credit</td>
                                                                            <td className='fw-bold'>{previousApplicationCredit}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </Table>
                                                                {
                                                                    creditError
                                                                    &&
                                                                    <p className='text-danger me-2' style={{ 'textAlign': 'right' }}>  *{creditError} </p>
                                                                }
                                                            </>
                                                        }
                                                    </Form.Group>

                                                    <h4 className='text-center'>Total Credits taken {backlogCredit + credit + previousApplicationCredit}</h4>
                                                    <div className='text-center my-4'>
                                                        <input type="submit" value='Register' className='btn btn-primary' />
                                                    </div>
                                                </Form>

                                            </div>
                                        </div>
                                        // :
                                        // <div>
                                        //     <BacklogCourseRegistration
                                        //         backlogCourses={backlogCourses}
                                        //         applications={applications}
                                        //         name={name}
                                        //         id={id}
                                        //         department={department}
                                        //         session={session}
                                        //         hall_code={hall?.hall_code}
                                        //         hall_name={hall?.hall_name}
                                        //     />
                                        // </div>
                                    }
                                </>
                        }



                    </>




            }

        </>

    );
};

export default CourseRegistrationForm;