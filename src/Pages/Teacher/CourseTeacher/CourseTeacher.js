import React, { useEffect, useState } from 'react';
import { Form, Nav, Table, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import Application from '../../Students/Application/Application';
import './CourseTeacher.css';

import CourseTeacherMarksModal from './CourseTeacherMarksModal';
import MarkModal from './MarkModal';
const CourseTeacher = () => {
    const [state, setState] = useState(1);
    const { courseId } = useParams();
    // console.log('cours-----id ==== ', courseId);
    //console.log("semester-ID = ", semesterId);
    const { user } = useAuth();
    const email = user?.email;
    const displayName = user?.displayName;
    const [marks, setMarks] = useState({});
    const [isLoadingMarks, setIsLoadingMarks] = useState(true);
    const [isSaving, setIsSaving] = useState(true);
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
    const [info, setInfo] = useState({})

    const [showMarkModal, setShowMarkModal] = useState(false);
    const [theoryAttendance, setTheoryAttendance] = useState(false);
    const [theoryCT1, setTheoryCT1] = useState(false);
    const [theoryCT2, setTheoryCT2] = useState(false);
    const [theoryCT3, setTheoryCT3] = useState(false);
    const [theoryFinal, setTheoryFinal] = useState(false);

    const [lbAttendance, setLbAttendance] = useState(false);
    const [lbReport, setLbReport] = useState(false);
    const [lbQuiz, setLbQuiz] = useState(false);

    const [projectClassPerformance, setProjectClassPerformance] = useState(false);




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
        setIsLoadingMarks(true);
        fetch(`http://localhost:5000/api/v1/marks/get-marks/course-teacher/${courseId}`, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        })
            .then(res => res.json())
            .then(info => {
                // console.log('info ', info)
                setMarks(info.data);
                setIsLoadingMarks(false);

            })
    }, [courseId, state, isSaving])

    // useEffect(() => {
    //     console.log('proposalChange ', proposalChange);
    //     fetch(`http://localhost:5000/proposal-view-teacher/${courseCode}/${email}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log("proposals ", data);
    //             setProposals(data);
    //         })
    // }, [courseCode, email, proposalChange, state])


    // const handleAccept = (proposal) => {
    //     proposal.status = 'accepted';
    //     console.log('a propodsal to add ', proposal);
    //     fetch(`http://localhost:5000/proposal-evaluate/${semesterId}/${courseCode}/${email}`, {
    //         method: 'put',
    //         headers: {
    //             'content-type': 'application/json'
    //         },
    //         body: JSON.stringify(proposal)
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log("data ", data);
    //             if (data.modifiedCount) {
    //                 setProposalChange(!proposalChange);
    //                 Toast.fire({
    //                     icon: 'success',
    //                     title: 'Successfully Added'
    //                 })
    //             }
    //         });
    // }

    useEffect(() => {
        if (marks?.type == 'project') {
            fetch(`http://localhost:5000/api/v1/project-application/proposal-for-teacher/${courseId}`, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
                },
            })
                .then(res => res.json())
                .then(proposal => {
                    console.log("proposal ", proposal);
                    setProposals(proposal.data);
                })
        }

    }, [courseId, state, marks])


    const submitAllMarksCourseTeacher = () => {

        Swal.fire({
            title: 'Do you want to Turn In the marks?',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            confirmButtonColor: 'green',
            icon: 'warning',
            cancelButtonText: 'No, cancel!',
            cancelButtonColor: 'red'

        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Saved!', '', 'success')
                fetch(`http://localhost:5000/api/v1/marks/turn-in/course-teacher/${courseId}`, {
                    method: 'put',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
                    },
                })
                    .then(res => res.json())
                    .then(info => {
                        console.log('info ', info)
                        // setMarks(info.data);
                        // setIsLoadingMarks(false);
                        if (info.status === 'success') {
                            Toast.fire({
                                icon: 'success',
                                title: info.message
                            })
                        }
                        else {
                            Toast.fire({
                                icon: 'error',
                                title: info.message
                            })
                        }
                    })
            }
        })
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

        // fetch(`http://localhost:5000/add-marks/course-teacher/${semesterId}/${courseCode}`, {
        //     method: 'put',
        //     headers: {
        //         'content-type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // })
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log("data ", data);
        //         if (data.modifiedCount) {
        //             Toast.fire({
        //                 icon: 'success',
        //                 title: 'Successfully updated marks'
        //             })
        //             history.push('/dashboard/courses-taken')
        //         }
        //         else if (data.matchedCount === 1) {
        //             Toast.fire({
        //                 icon: 'warning',
        //                 title: 'Give some data then click assign'
        //             })
        //         }
        //     });
    };




    const visibile = {
        visibility: 'visible'
    }
    const invisibile = {
        visibility: 'hidden'
    }

    // console.log("alllll inffooo ======= ", allInfo);
    // console.log("maaaarks ============ ", marks);
    return (
        <>
            {
                isLoadingMarks
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
                                marks={marks} showModal={showModal} setShowModal={setShowModal}
                                attendance={attendance} ct1={ct1} ct2={ct2} ct3={ct3} final={final}
                                labAttendance={labAttendance} labQuiz={labQuiz} labReport={labReport}
                                classPerformanceProject={classPerformanceProject}
                            />
                        </div>
                        <div>
                            <MarkModal
                                showMarkModal={showMarkModal} setShowMarkModal={setShowMarkModal} marks={marks}
                                theoryAttendance={theoryAttendance} setTheoryAttendance={setTheoryAttendance}
                                theoryCT1={theoryCT1} setTheoryCT1={setTheoryCT1}
                                theoryCT2={theoryCT2} setTheoryCT2={setTheoryCT2} theoryCT3={theoryCT3}
                                setTheoryCT3={setTheoryCT3} theoryFinal={theoryFinal} setTheoryFinal={setTheoryFinal}
                                lbAttendance={lbAttendance} setLbAttendance={setLbAttendance} lbReport={lbReport}
                                setLbReport={setLbReport} lbQuiz={lbQuiz} setLbQuiz={setLbQuiz} projectClassPerformance={projectClassPerformance}
                                setProjectClassPerformance={setProjectClassPerformance} courseId={courseId} setIsSaving={setIsSaving} isSaving={isSaving}
                            />

                        </div>

                        <div>
                            {
                                marks.type === 'theory'
                                &&
                                <div className='container'>
                                    <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                        <div className='p-4 '>
                                            <div className=' '>
                                                <h3 className='text-center mb-3' >Assign Marks</h3>
                                                <p><span className='fw-bold'>Course Title: </span>{marks?.courseTitle}</p>
                                                <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode}</p>
                                                <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p>
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
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setTheoryAttendance(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    CT-1 <br />(20 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setTheoryCT1(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    CT-2 <br />(20 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setTheoryCT2(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    CT-3 <br />(20 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setTheoryCT3(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Final Exam Mark <br />(70 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setTheoryFinal(true) }}>Edit</span>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                marks?.studentsMarks?.map(x => {
                                                                    // console.log(x?.studentProfileId?.firstName);
                                                                    return (
                                                                        <tr key={x?.id} style={{ border: "1px solid black" }}>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                                    readOnly />
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} defaultValue={x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName}
                                                                                    readOnly />
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {

                                                                                    <p>{x?.theoryAttendance}</p>
                                                                                }

                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {

                                                                                    <p>{x?.theoryCT1}</p>
                                                                                }

                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {

                                                                                    <p>{x?.theoryCT2}</p>
                                                                                }
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {

                                                                                    <p>{x?.theoryCT3}</p>
                                                                                }
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {

                                                                                    <p>{x?.theoryFinal}</p>
                                                                                }
                                                                            </td>
                                                                        </tr>

                                                                    )
                                                                })
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
                                                    <Button variant='primary' className='me-2' onClick={() => setShowModal(true)}>Generate PDF</Button>
                                                    {/* <input variant='primary' type="submit" value='Save' className='btn btn-primary' /> */}
                                                    <Button variant='success' className='me-2' onClick={() => submitAllMarksCourseTeacher()}>Submit Marks</Button>
                                                </div>
                                            </Form>

                                        </div>
                                    </div>
                                </div>
                            }


                            {
                                marks.type === 'lab'
                                &&
                                <div className='container'>
                                    <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                        <div className='p-4'>
                                            <div className=' '>
                                                <h3 className='text-center mb-3' >Assign Marks</h3>
                                                <p><span className='fw-bold'>Course Title: </span>{marks?.courseTitle}</p>
                                                <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode}</p>
                                                <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p>
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
                                                                    Lab Attendance<br />(15 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setLbAttendance(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Lab Report Marks<br /> (15 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setLbReport(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Lab Quiz Marks<br />(30 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setLbQuiz(true) }}>Edit</span>
                                                                </th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                marks.studentsMarks.map(x => {
                                                                    // console.log(x)
                                                                    return (
                                                                        <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                                    readOnly />
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} defaultValue={x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName}
                                                                                    readOnly />
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {

                                                                                    <p>{x?.labAttendance}</p>
                                                                                }

                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {

                                                                                    <p>{x?.labReport}</p>
                                                                                }

                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {

                                                                                    <p>{x?.labQuiz}</p>
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })
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
                                                    <Button variant='primary' className='me-2' onClick={() => setShowModal(true)}>Generate PDF</Button>
                                                    {/* <input variant='primary' type="submit" value='Save' className='btn btn-primary' /> */}
                                                    <Button variant='success' className='me-2' onClick={() => submitAllMarksCourseTeacher()}>Submit Marks</Button>
                                                </div>

                                            </Form>
                                        </div>

                                    </div>
                                </div>
                            }

                            {
                                marks.type === 'project'
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
                                                            <p><span className='fw-bold'>Course Title: </span>{marks?.courseTitle}</p>
                                                            <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode}</p>
                                                            <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p>
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
                                                                                Class Performance<br />(70 marks)
                                                                                <br />
                                                                                <span className='edit' onClick={() => { setShowMarkModal(true); setProjectClassPerformance(true) }}>Edit</span>
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            Object.keys(marks).length !== 0 &&
                                                                            marks?.studentsMarks?.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                                                <td style={{ border: "1px solid black" }}>
                                                                                    <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                                        readOnly />
                                                                                </td>
                                                                                <td style={{ border: "1px solid black" }}>
                                                                                    <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} defaultValue={x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName}
                                                                                        readOnly />
                                                                                </td>
                                                                                <td style={{ border: "1px solid black" }}>
                                                                                    {
                                                                                        <p>{x?.projectClassPerformance}</p>
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
                                                                <div className='text-center'>
                                                                    <Button variant='primary' className='me-2' onClick={() => setShowModal(true)}>Generate PDF</Button>
                                                                    {/* <input variant='primary' type="submit" value='Save' className='btn btn-primary' /> */}
                                                                    <Button variant='success' className='me-2' onClick={() => submitAllMarksCourseTeacher()}>Submit Marks</Button>
                                                                </div>
                                                            </div>
                                                        </Form>
                                                    </div>

                                                </div>
                                                :
                                                <div className='mt-4'>
                                                    <h3 className='my-5 text-center '>Students Applications</h3>
                                                    {
                                                        proposals?.length === 0 ?
                                                            <div className=' d-flex justify-content-center align-items-center half-height' >
                                                                <h5 className='text-center fs-2 text-danger my-4 fw-bold error-opacity' >You have no Student application</h5>
                                                            </div>
                                                            :
                                                            proposals?.map(x => <Application
                                                                // proposal={setProposalChange}
                                                                key={x._id} applicationDetais={x}
                                                            // handleAccept={handleAccept}
                                                            // handleReject={handleReject}
                                                            >
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