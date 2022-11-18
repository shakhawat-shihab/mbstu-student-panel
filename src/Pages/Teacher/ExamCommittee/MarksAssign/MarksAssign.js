import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../../../Hooks/useAuth';
import './MarksAssign.css';
import MarksAssignCommitteeModal from './MarksAssignCommitteeModal';
import MarksAssignModal from './MarksAssignModal';


const MarksAssign = () => {
    const { semesterId } = useParams();
    const [courseId, setCourseId] = useState('');
    const [marks, setMarks] = useState({});
    const [isLoadingMarks, setIsLoadingMarks] = useState(true);
    const [semester, setSemester] = useState({});
    const [semesterAllMarks, setSemesterAllMarks] = useState({});
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState([]);
    const [courseCodeChanging, setCourseCodeChanging] = useState(false);
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [credit, setCredit] = useState();
    const [showModal, setShowModal] = useState(false);
    // const [editExperimentMarks, setEditExperimentMarks] = useState(false);
    const [editPresentationMarks, setEditPresentationMarks] = useState(false);
    //const [courseCode]

    const [showCommitteeModal, setShowCommitteeModal] = useState(false);
    const [examCommitteeLabExp, setExamCommitteeLabExp] = useState(false);
    const [examCommitteeLabViva, setExamCommitteeLabViva] = useState(false);
    const [examCommitteeProject, setExamCommitteeProject] = useState(false);
    const [isSaving, setIsSaving] = useState(true);


    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
    const { dept, user } = useAuth();
    const email = user?.email;
    const displayName = user?.displayName;
    const history = useHistory();
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

    //for loading courses of a semester
    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/semester/courses/${semesterId}`, {
            method: 'get',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
        })
            .then(res => res.json())
            .then(info => {
                // console.log('semester = ', info);
                const coursesExceptTheory = [];
                info?.data?.coursesMarks.map(x => {
                    if (x.type !== 'theory')
                        coursesExceptTheory.push(x)
                });
                //console.log('coursesExceptTheory = ', coursesExceptTheory);
                setCourses(coursesExceptTheory)
                // console.log('info?.data?.coursesMarks = ', info?.data?.coursesMarks);
                setCourseId(coursesExceptTheory?.[0]?._id)
            })
    }, [semesterId]);


    //for loading marks of a course
    useEffect(() => {
        if (courseId !== '') {
            setIsLoadingMarks(true);
            fetch(`http://localhost:5000/api/v1/marks/get-marks/exam-committe/${courseId}`, {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
                },
            })
                .then(res => res.json())
                .then(info => {
                    // console.log('course marks = ', info?.data);
                    setMarks(info?.data);
                    setIsLoadingMarks(false);
                })
        }

    }, [courseId, isSaving])




    return (
        <div className='px-2 py-4 shadow-lg w-75 mx-auto rounded my-3'>
            <div className=' my-4'>
                <Form >
                    <Form.Group className="mb-1 w-100 mx-auto">
                        <Form.Label className='text-primary'>Select a Course:</Form.Label>
                        <br></br>
                        <Form.Select
                            onChange={(e) => {
                                setCourseId(e.target.value);
                            }}>
                            {
                                courses?.map(c => <option key={c?._id} value={c?._id}>{c.courseTitle} ({c.courseCode})</option>)
                            }
                        </Form.Select>
                    </Form.Group>
                </Form>
            </div>

            <div>
                <div>
                    <MarksAssignModal
                        marks={marks} course={course} courseName={courseName} courseCode={courseCode} credit={credit} semesterAllMarks={semesterAllMarks} showModal={showModal} setShowModal={setShowModal}
                    />
                </div>
                <div>
                    <MarksAssignCommitteeModal
                        marks={marks} showCommitteeModal={showCommitteeModal} setShowCommitteeModal={setShowCommitteeModal} courseId={courseId}
                        examCommitteeLabExp={examCommitteeLabExp} setExamCommitteeLabExp={setExamCommitteeLabExp}
                        examCommitteeLabViva={examCommitteeLabViva} setExamCommitteeLabViva={setExamCommitteeLabViva}
                        examCommitteeProject={examCommitteeProject} setExamCommitteeProject={setExamCommitteeProject} isSaving={isSaving} setIsSaving={setIsSaving}
                    />
                </div>
                <div>
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

                                {
                                    marks?.type === 'lab'
                                    &&
                                    <div className='container'>
                                        <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                            <div className='p-4 '>
                                                <div className='mb-5'>
                                                    <h3 className='text-center mb-5' >Lab Experiment</h3>
                                                    <p><span className='fw-bold'>Course Title: </span>{marks?.courseTitle}</p>
                                                    <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode.toUpperCase()}</p>
                                                    <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p>
                                                </div>
                                                <Form
                                                // onSubmit={handleSubmit(onSubmitLabMarks)}
                                                >
                                                    <Table responsive striped bordered hover className='text-center' style={{ border: '1px solid black' }}>
                                                        <thead>
                                                            <tr style={{ border: '1px solid black' }}>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Lab Experiment Marks <br /> (40 )
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowCommitteeModal(true); setExamCommitteeLabExp(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Viva-voce marks <br /> (10 )
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowCommitteeModal(true); setExamCommitteeLabViva(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Total <br /> (50 )
                                                                    {/* <br />
                                                                    <span className='edit' onClick={() => { setShowCommitteeModal(true); setExamCommitteeLab(true) }}>Edit</span> */}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {
                                                                marks?.studentsMarks?.map(x => <tr key={`${x?.id}_${courseCode}`} style={{ border: '1px solid black' }}>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                            readOnly />
                                                                    </td>
                                                                    <td style={{ border: '1px solid black' }}>{x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName}</td>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        <p
                                                                            title={`By ${x?.labExperimentBy}`} >
                                                                            {x?.labExperiment}
                                                                        </p>
                                                                    </td>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        <p
                                                                            title={`By ${x?.labVivaBy}`} >
                                                                            {x?.labViva}
                                                                        </p>
                                                                    </td>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        <p >
                                                                            {
                                                                                x?.labExperiment && x?.labViva
                                                                                    ?
                                                                                    x?.labExperiment + x?.labViva
                                                                                    :
                                                                                    <>
                                                                                        {
                                                                                            x?.labViva ? x?.labViva : x?.labExperiment
                                                                                        }
                                                                                    </>
                                                                            }
                                                                        </p>
                                                                    </td>
                                                                </tr>)
                                                            }

                                                        </tbody>
                                                    </Table>
                                                    <div className='text-center'>
                                                        <Button variant='primary' className='me-2' onClick={() => setShowModal(true)}>Generate PDF</Button>
                                                        {/* <input variant='primary' type="submit" value='Save' className='btn btn-primary' /> */}
                                                        {/* <Button variant='success' className='me-2' onClick={() => submitAllMarksExamCommittee()}>Submit Marks</Button> */}
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    marks?.type === 'project'
                                    &&
                                    <div className='container'>
                                        <div className='container-fluid shadow-lg rounded  my-5 ' >
                                            <div className='p-4 '>
                                                <div className='mb-5'>
                                                    <h3 className='text-center mb-5' >Project Presentation</h3>
                                                    <p><span className='fw-bold'>Course Title: </span>{marks?.courseTitle}</p>
                                                    <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode.toUpperCase()}</p>
                                                    <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p>
                                                </div>
                                                <Form>
                                                    <Table responsive bordered hover className='text-center' style={{ border: '1px solid black' }}>
                                                        <thead>
                                                            <tr style={{ border: '1px solid black' }}>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Presentation and Viva <br />(30 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowCommitteeModal(true); setExamCommitteeProject(true) }}>Edit</span>
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                marks?.studentsMarks?.map(x => <tr key={x?.s_id}>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}

                                                                            readOnly />
                                                                    </td>
                                                                    <td style={{ border: '1px solid black' }}>{x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName}</td>

                                                                    <td style={{ border: '1px solid black' }}>
                                                                        <p className={editPresentationMarks ? 'd-none' : ''} title={`By ${x?.projectPresentationBy}`} >{x?.projectPresentation}</p>
                                                                    </td>
                                                                </tr>)
                                                            }
                                                        </tbody>
                                                    </Table>
                                                    <div className='text-center'>
                                                        <Button variant='primary' className='me-2' onClick={() => setShowModal(true)}>Generate PDF</Button>
                                                        {/* <input variant='primary' type="submit" value='Save' className='btn btn-primary' /> */}
                                                        {/* <Button variant='success' className='me-2' onClick={() => submitAllMarksExamCommittee()}>Submit Marks</Button> */}
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </>
                    }
                </div>
            </div>
        </div >
    );
};

export default MarksAssign;