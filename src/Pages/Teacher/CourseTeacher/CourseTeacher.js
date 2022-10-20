import React, { useEffect, useState } from 'react';
import { Form, Nav, Table, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import Application from '../../Students/Application/Application';
import './CourseTeacher.css';

import CourseTeacherMarksModal from './CourseTeacherMarksModal';
const CourseTeacher = () => {
    const [state, setState] = useState(1);
    const { semesterId, courseCode } = useParams();
    //console.log("semester-ID = ", semesterId);
    const { user } = useAuth();
    const email = user?.email;
    const displayName = user?.displayName;
    const [proposalChange, setProposalChange] = useState(false);
    const [allInfo, setAllInfo] = useState({});
    const [proposals, setProposals] = useState([]);
    const [editAttendance, setEditAttendance] = useState(false);
    const [editCt1, setEditCt1] = useState(false);
    const [editCt2, setEditCt2] = useState(false);
    const [editCt3, setEditCt3] = useState(false);
    const [editFinalMarks, setEditFinalMarks] = useState(false);
    const [editLabAttendance, setEditLabAttendance] = useState(false);
    const [editLabQuiz, setEditLabQuiz] = useState(false);
    const [editLabReport, setEditLabReport] = useState(false);
    const [editClassPerformance, setEditClassPerformance] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [attendance, setAttendance] = useState(true);
    const [ct1, setCt1] = useState(true);
    const [ct2, setCt2] = useState(true);
    const [ct3, setCt3] = useState(true);
    const [final, setFinal] = useState(true);
    const [labAttendance, setLabAttendance] = useState(true);
    const [labReport, setLabReport] = useState(true);
    const [labQuiz, setLabQuiz] = useState(true);
    const [classPerformanceProject, setClassPerformanceProject] = useState(true);

    const history = useHistory();
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
        fetch(`http://localhost:5000/get-marks/course-teacher/${semesterId}/${courseCode.toUpperCase()}/${email}`)
            .then(res => res.json())
            .then(data => {
                console.log('allInfo ', data)
                if (data?.code === "403") {
                    Toast.fire({
                        icon: 'error',
                        title: data?.message
                    })
                    history.push('/home');
                }
                else {
                    setAllInfo(data);
                }

            })
    }, [email, semesterId, courseCode, state])

    useEffect(() => {
        console.log('proposalChange ', proposalChange);
        fetch(`http://localhost:5000/proposal-view-teacher/${courseCode}/${email}`)
            .then(res => res.json())
            .then(data => {
                console.log("proposals ", data);
                setProposals(data);
            })
    }, [courseCode, email, proposalChange, state])


    const handleAccept = (proposal) => {
        proposal.status = 'accepted';
        console.log('a propodsal to add ', proposal);
        fetch(`http://localhost:5000/proposal-evaluate/${semesterId}/${courseCode}/${email}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(proposal)
        })
            .then(res => res.json())
            .then(data => {
                console.log("data ", data);
                if (data.modifiedCount) {
                    setProposalChange(!proposalChange);
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully Added'
                    })

                }
            });
    }

    const handleReject = (proposal) => {
        proposal.status = 'rejected';
        console.log('a propodsal to add ', proposal);
        fetch(`http://localhost:5000/proposal-evaluate/${semesterId}/${courseCode}/${email}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(proposal)
        })
            .then(res => res.json())
            .then(data => {
                setProposalChange(!proposalChange);
                console.log("data ", data);
                if (data?.code === "200") {
                    Toast.fire({
                        icon: 'success',
                        title: data?.message
                    })
                }
            });
    }



    const onSubmit = data => {
        //setSubmitClick(!submitClick);
        // trimming all properties of data
        for (var key in data) {
            if (data[key].trim)
                data[key] = data[key].trim();
            if (data[key].length === 0) {
                //errors.newError = 'error'
                Toast.fire({
                    icon: 'error',
                    title: "Don't put a feild empty, you can assign 0"
                })
                return;
            }
        }
        console.log('submit ', data);
        console.log("Hello")
        fetch(`http://localhost:5000/add-marks/course-teacher/${semesterId}/${courseCode}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log("data ", data);
                if (data.modifiedCount) {
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully updated marks'
                    })
                    history.push('/dashboard/courses-taken')
                }
                else if (data.matchedCount === 1) {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Give some data then click assign'
                    })

                }
            });
    };




    const visibile = {
        visibility: 'visible'
    }
    const invisibile = {
        visibility: 'hidden'
    }
    return (
        <>
            {
                Object.keys(allInfo).length === 0
                    ?
                    <div className='text-center my-5 py-5 '>
                        <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>

                    :

                    <>
                        <div>
                            <CourseTeacherMarksModal
                                allInfo={allInfo} showModal={showModal} setShowModal={setShowModal}
                                attendance={attendance} ct1={ct1} ct2={ct2} ct3={ct3} final={final}
                                labAttendance={labAttendance} labQuiz={labQuiz} labReport={labReport}
                                classPerformanceProject={classPerformanceProject}
                            />

                        </div>

                        <div>
                            {
                                allInfo.type === 'theory'
                                &&
                                <div className='container'>
                                    <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                        <div className='p-4 '>
                                            <div className=' '>
                                                <h3 className='text-center mb-3' >Assign Marks</h3>
                                                <p><span className='fw-bold'>Course Name: </span>{allInfo?.course_title}</p>
                                                <p><span className='fw-bold'>Course Code: </span>{allInfo?.course_code}</p>
                                                <p><span className='fw-bold'>Credit Hour: </span>{allInfo?.credit}</p>
                                            </div>
                                            <Form onSubmit={handleSubmit(onSubmit)}>
                                                <Form.Group className='mb-2'>
                                                    <Table responsive striped bordered hover className='text-center' >
                                                        <col width="11%" />
                                                        <col width="30%" />
                                                        <col width="12%" />
                                                        <col width="12%" />
                                                        <col width="12%" />
                                                        <col width="12%" />
                                                        <thead>
                                                            <tr  >
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Attendance <br />(10 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setEditAttendance(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    CT-1 <br />(20 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setEditCt1(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    CT-2 <br />(20 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setEditCt2(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    CT-3 <br />(20 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setEditCt3(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Final Exam Mark <br />(70 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setEditFinalMarks(true) }}>Edit</span>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                Object.keys(allInfo).length !== 0 &&
                                                                allInfo?.marks.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                                    <td style={{ border: "1px solid black" }}>
                                                                        <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.s_id}
                                                                            {...register(`${x?.s_id}_id`, { required: true })}
                                                                            readOnly />
                                                                    </td>
                                                                    <td style={{ border: "1px solid black" }}>
                                                                        <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} value={x?.displayName}
                                                                            {...register(`${x?.s_id}_name`, { required: true })}
                                                                            readOnly />
                                                                    </td>
                                                                    <td style={{ border: "1px solid black" }}>
                                                                        {
                                                                            editAttendance
                                                                                ?
                                                                                <>
                                                                                    <input type='number' className=' w-50 text-center' defaultValue={x?.attendance}
                                                                                        {...register(`${x?.s_id}_attendance`, { required: true })}
                                                                                    />
                                                                                    {/* <span style={errors[`${x?.s_id}_attendance`] ? setFromError(true) : setFromError(false)} className='text-danger ps-2' ></span> */}
                                                                                </>
                                                                                :
                                                                                <p>{x?.attendance}</p>
                                                                        }

                                                                    </td>
                                                                    <td style={{ border: "1px solid black" }}>
                                                                        {
                                                                            editCt1
                                                                                ?
                                                                                <input type='number'
                                                                                    className='w-50 text-center '
                                                                                    defaultValue={x?.ct1}
                                                                                    {...register(`${x?.s_id}_ct1`, { required: true })}
                                                                                />
                                                                                :
                                                                                <p>{x?.ct1}</p>
                                                                        }

                                                                    </td>
                                                                    <td style={{ border: "1px solid black" }}>
                                                                        {
                                                                            editCt2
                                                                                ?
                                                                                <input type='number' className=' w-50 text-center' defaultValue={x?.ct2}
                                                                                    {...register(`${x?.s_id}_ct2`, { required: true })}
                                                                                />
                                                                                :
                                                                                <p>{x?.ct2}</p>
                                                                        }
                                                                    </td>
                                                                    <td style={{ border: "1px solid black" }}>
                                                                        {
                                                                            editCt3
                                                                                ?
                                                                                <input type='number' className=' w-50 text-center' defaultValue={x?.ct3}
                                                                                    {...register(`${x?.s_id}_ct3`, { required: true })}
                                                                                />
                                                                                :
                                                                                <p>{x?.ct3}</p>
                                                                        }
                                                                    </td>
                                                                    <td style={{ border: "1px solid black" }}>
                                                                        {
                                                                            editFinalMarks
                                                                                ?
                                                                                <input type='number' className=' w-50 text-center' defaultValue={x?.course_teacher_marks}
                                                                                    {...register(`${x?.s_id}_course_teacher_marks`, { required: true })}
                                                                                />
                                                                                :
                                                                                <p>{x?.course_teacher_marks}</p>
                                                                        }
                                                                    </td>
                                                                </tr>)
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </Form.Group>
                                                <Form.Check
                                                    inline
                                                    type='checkbox'
                                                    label="Attendance"
                                                    // name='Attendance'
                                                    id='Attendance'
                                                    checked={attendance}
                                                    onChange={() => setAttendance(!attendance)}
                                                />
                                                <Form.Check
                                                    inline
                                                    type='checkbox'
                                                    label="Ct-1"
                                                    // name="Ct1"
                                                    id="Ct1"
                                                    checked={ct1}
                                                    onChange={() => setCt1(!ct1)}
                                                />
                                                <Form.Check
                                                    inline
                                                    type='checkbox'
                                                    label="Ct-2"
                                                    // name="Ct2"
                                                    id="Ct2"
                                                    checked={ct2}
                                                    onChange={() => setCt2(!ct2)}
                                                />
                                                <Form.Check
                                                    inline
                                                    type='checkbox'
                                                    label="Ct-3"
                                                    // name="Ct3"
                                                    id="Ct3"
                                                    checked={ct3}
                                                    onChange={() => setCt3(!ct3)}
                                                />

                                                <Form.Check
                                                    inline
                                                    type='checkbox'
                                                    label="Final Exam Mark"
                                                    // name="FinalExamMark"
                                                    id="FinalExamMark"
                                                    checked={final}
                                                    onChange={() => setFinal(!final)}
                                                />
                                                <div className='text-center'>
                                                    <Button variant='success' className='me-2' onClick={() => setShowModal(true)}> Generate PDF</Button>
                                                    <input as Button variant='primary' type="submit" value='Save' className='btn btn-primary' />
                                                </div>
                                            </Form>

                                        </div>
                                    </div>
                                </div>
                            }
                            {
                                allInfo.type === 'lab'
                                &&
                                <div className='container'>
                                    <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                        <div className='p-4'>
                                            <div className=' '>
                                                <h3 className='text-center mb-3' >Assign Marks</h3>
                                                <p><span className='fw-bold'>Course Name: </span>{allInfo?.course_title}</p>
                                                <p><span className='fw-bold'>Course Code: </span>{allInfo?.course_code}</p>
                                                <p><span className='fw-bold'>Credit Hour: </span>{allInfo?.credit}</p>
                                            </div>
                                            <Form onSubmit={handleSubmit(onSubmit)}>
                                                <Form.Group className='mb-2'>
                                                    <Table responsive striped bordered hover className='text-center'  >
                                                        <col width="15%" />
                                                        <col width="30%" />
                                                        <col width="15%" />
                                                        <col width="15%" />
                                                        <col width="15%" />
                                                        <thead>
                                                            <tr style={{ border: "1px solid black" }}>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Lab Attendance (15%)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setEditLabAttendance(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Lab Report Marks (15%)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setEditLabReport(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Lab Quiz Marks (30%)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setEditLabQuiz(true) }}>Edit</span>
                                                                </th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                Object.keys(allInfo).length !== 0 &&
                                                                allInfo?.marks.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                                    <td style={{ border: "1px solid black" }}>
                                                                        <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.s_id}
                                                                            {...register(`${x?.s_id}_id`, { required: true })}
                                                                            readOnly />
                                                                    </td>
                                                                    <td style={{ border: "1px solid black" }}>
                                                                        <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} value={x?.displayName}
                                                                            {...register(`${x?.s_id}_name`, { required: true })}
                                                                            readOnly />
                                                                    </td>
                                                                    <td style={{ border: "1px solid black" }}>
                                                                        {
                                                                            editLabAttendance
                                                                                ?
                                                                                <>
                                                                                    <input type='number' className=' w-50 text-center' defaultValue={x?.lab_attendance}
                                                                                        {...register(`${x?.s_id}_lab_attendance`, { required: true })}
                                                                                    />

                                                                                </>
                                                                                :
                                                                                <p>{x?.lab_attendance}</p>
                                                                        }

                                                                    </td>
                                                                    <td style={{ border: "1px solid black" }}>
                                                                        {
                                                                            editLabReport
                                                                                ?
                                                                                <input type='number'
                                                                                    className='w-50 text-center '
                                                                                    defaultValue={x?.lab_report}
                                                                                    {...register(`${x?.s_id}_lab_report`, { required: true })}
                                                                                />
                                                                                :
                                                                                <p>{x?.lab_report}</p>
                                                                        }

                                                                    </td>
                                                                    <td style={{ border: "1px solid black" }}>
                                                                        {
                                                                            editLabQuiz
                                                                                ?
                                                                                <input type='number' className=' w-50 text-center' defaultValue={x?.lab_quiz}
                                                                                    {...register(`${x?.s_id}_lab_quiz`, { required: true })}
                                                                                />
                                                                                :
                                                                                <p>{x?.lab_quiz}</p>
                                                                        }
                                                                    </td>

                                                                </tr>)
                                                            }
                                                        </tbody>
                                                    </Table>
                                                </Form.Group>
                                                <Form.Check
                                                    inline
                                                    type='checkbox'
                                                    label="Lab Attendance"
                                                    id="labAttendance"
                                                    checked={labAttendance}
                                                    onChange={() => setLabAttendance(!labAttendance)}
                                                />
                                                <Form.Check
                                                    inline
                                                    type='checkbox'
                                                    label="Lab Report"
                                                    id="labReport"
                                                    checked={labReport}
                                                    onChange={() => setLabReport(!labReport)}
                                                />
                                                <Form.Check
                                                    inline
                                                    type='checkbox'
                                                    label="Lab Quiz"
                                                    id="labQuiz"
                                                    checked={labQuiz}
                                                    onChange={() => setLabQuiz(!labQuiz)}
                                                />
                                                <div className='text-center'>
                                                    <Button variant='success' className='me-2' onClick={() => setShowModal(true)}> Generate PDF</Button>
                                                    <input as Button variant='primary' type="submit" value='Save' className='btn btn-primary' />
                                                </div>

                                            </Form>
                                        </div>

                                    </div>
                                </div>
                            }

                            {
                                allInfo.type === 'project'
                                &&
                                <div className='container'>
                                    <div className='mt-4' >
                                        <Nav justify variant="pills" defaultActiveKey="1" >
                                            <Nav.Item>
                                                <Nav.Link onClick={() => { setState(1) }} eventKey="1" >Marks Assign</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link onClick={() => { setState(2) }} eventKey="link-1" >Student Application</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </div>

                                    <div className=' ' >

                                        {
                                            state === 1
                                                ?
                                                <div className='container-fluid shadow-lg  rounded  my-5'>
                                                    <div className='p-4'>
                                                        <div className=' '>
                                                            <h3 className='text-center mb-3' >Assign Marks</h3>
                                                            <p><span className='fw-bold'>Course Name: </span>{allInfo?.course_title}</p>
                                                            <p><span className='fw-bold'>Course Code: </span>{allInfo?.course_code}</p>
                                                            <p><span className='fw-bold'>Credit Hour: </span>{allInfo?.credit}</p>
                                                        </div>

                                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                                            <Form.Group className='mb-2'>
                                                                <Table responsive bordered striped hover className='text-center'  >
                                                                    <col width="15%" />
                                                                    <col width="40%" />
                                                                    <col width="25%" />
                                                                    <thead>
                                                                        <tr style={{ border: "1px solid black" }}>
                                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                                Class Performance (70%)
                                                                                <br />
                                                                                <span className='edit' onClick={() => { setEditClassPerformance(true) }}>Edit</span>
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            Object.keys(allInfo).length !== 0 &&
                                                                            allInfo?.marks?.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                                                <td style={{ border: "1px solid black" }}>
                                                                                    <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.s_id}
                                                                                        {...register(`${x?.s_id}_id`, { required: true })}
                                                                                        readOnly />
                                                                                </td>
                                                                                <td style={{ border: "1px solid black" }}>
                                                                                    <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} value={x?.displayName}
                                                                                        {...register(`${x?.s_id}_name`, { required: true })}
                                                                                        readOnly />
                                                                                </td>
                                                                                <td style={{ border: "1px solid black" }}>
                                                                                    {
                                                                                        editClassPerformance
                                                                                            ?
                                                                                            <>
                                                                                                <input type='number' className=' w-50 text-center' defaultValue={x?.class_marks_project}
                                                                                                    {...register(`${x?.s_id}_class_marks_project`, { required: true })}
                                                                                                />
                                                                                                <input type='text' hidden className=' w-50 text-center'
                                                                                                    value={displayName}
                                                                                                    {...register(`${x?.s_id}_class_marks_project_by`)}
                                                                                                />
                                                                                            </>
                                                                                            :
                                                                                            <p>{x?.class_marks_project}</p>
                                                                                    }
                                                                                </td>
                                                                            </tr>)
                                                                        }
                                                                    </tbody>
                                                                </Table>
                                                            </Form.Group>
                                                            <Form.Check
                                                                inline
                                                                // disabled
                                                                type='checkbox'
                                                                label="Class Performance"
                                                                id="labQuiz"
                                                                // checked={classPerformanceProject}
                                                                // onChange={() => setClassPerformanceProject(!classPerformanceProject)}
                                                                checked
                                                            />
                                                            <div className='text-center'>
                                                                <Button variant='success' className='me-2' onClick={() => setShowModal(true)}> Generate PDF</Button>
                                                                <input as Button variant='primary' type="submit" value='Save' className='btn btn-primary' />
                                                            </div>
                                                        </Form>
                                                    </div>

                                                </div>
                                                :
                                                <div className='mt-4'>
                                                    <h3 className='my-5 text-center '>Applications</h3>
                                                    {
                                                        proposals?.map(x => <Application
                                                            // proposal={setProposalChange}
                                                            key={x._id} details={x}
                                                            handleAccept={handleAccept}
                                                            handleReject={handleReject}>
                                                        </Application >)
                                                    }
                                                </div>
                                        }

                                    </div>
                                </div>
                            }

                            {
                                Object.keys(errors).length ? <p style={visibile} className='text-danger ps-2 text-center' >*Don't put a feild empty, you can assign 0</p> : <p></p>
                            }

                        </div >
                    </>
            }
        </>


    );
};

export default CourseTeacher;