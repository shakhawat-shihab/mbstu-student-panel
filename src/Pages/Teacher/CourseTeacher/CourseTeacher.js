import React, { useEffect, useState } from 'react';
import { Form, Nav, Table, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import TeacherProjectApplication from '../TeacherProjectApplication/TeacherProjectApplication';
import './CourseTeacher.css';
import CourseTeacherMarksModal from './CourseTeacherMarksModal';
import MarkModal from './MarkModal';

const CourseTeacher = () => {
    const [state, setState] = useState('1');
    const { courseId } = useParams();
    // console.log('cours-----id ==== ', courseId);
    //console.log("semester-ID = ", semesterId);
    const { user } = useAuth();

    const [marks, setMarks] = useState({});
    const [marksToView, setMarksToView] = useState([]);
    const [isLoadingMarks, setIsLoadingMarks] = useState(true);
    const [isSaving, setIsSaving] = useState(true);
    const [proposals, setProposals] = useState([]);
    const [proposalState, setProposalState] = useState(true);
    const [isLoadingProposals, setIsLoadingProposals] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [attendance, setAttendance] = useState(true);
    const [ct1, setCt1] = useState(true);
    const [ct2, setCt2] = useState(true);
    const [ct3, setCt3] = useState(true);
    const [ctAvg, setCtAvg] = useState(true);
    const [classThirty, setClassThirty] = useState(true);
    const [final, setFinal] = useState(true);
    const [labAttendance, setLabAttendance] = useState(true);
    const [labReport, setLabReport] = useState(true);
    const [labQuiz, setLabQuiz] = useState(true);
    const [classPerformanceProject, setClassPerformanceProject] = useState(true);


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
                console.log('info ===> ', info)
                setMarks(info.data);
                setIsLoadingMarks(false);

            })
    }, [courseId, state, isSaving])



    useEffect(() => {
        console.log(courseId, marks, proposalState)
        if (marks?.type === 'project') {
            setIsLoadingProposals(true)
            console.log('state ', state);
            fetch(`http://localhost:5000/api/v1/project-application/proposal-for-teacher/${courseId}`, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
                },
            })
                .then(res => res.json())
                .then(proposal => {
                    console.log("proposal =====> ", proposal);
                    setProposals(proposal.data);
                    setIsLoadingProposals(false)
                })
        }

    }, [courseId, marks, proposalState])


    useEffect(() => {
        const array = []
        marks?.studentsMarks?.forEach(x => {
            const obj = {}
            obj.id = x.id;
            obj.name = x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName;
            if (marks?.type === 'theory') {
                let cnt = 0;
                let sum = 0;
                const { theoryCT1, theoryCT2, theoryCT3, theoryAttendance, theoryFinal } = x;
                if (theoryCT1 || theoryCT1 === 0) {
                    obj.theoryCT1 = theoryCT1;
                    sum += parseInt(theoryCT1);
                    cnt++;
                }
                if (theoryCT2 || theoryCT2 === 0) {
                    obj.theoryCT2 = theoryCT2;
                    sum += parseInt(theoryCT2);
                    cnt++;
                }
                if (theoryCT3 || theoryCT3 === 0) {
                    obj.theoryCT3 = theoryCT3;
                    sum += parseInt(theoryCT3);
                    cnt++;
                }
                let avg = 0;
                cnt && (avg = Math.round(sum / cnt));
                //console.log('average ', avg);
                let thirtyPercent;
                theoryAttendance ? (thirtyPercent = Math.round((avg + Math.round(theoryAttendance)))) : (thirtyPercent = Math.round(avg))
                obj.theoryAttendance = theoryAttendance;
                obj.ctAvg = avg;
                obj.thirtyPercent = thirtyPercent;
                obj.theoryFinal = theoryFinal;
                array.push(obj);
            }
            else if (marks.type === 'lab') {
                const { labAttendance, labReport, labQuiz } = x;
                obj.labAttendance = labAttendance
                obj.labReport = labReport
                obj.labQuiz = labQuiz
                let totalMarks = 0;
                totalMarks = Math.round(labAttendance + labQuiz + labReport);
                obj.labClass = totalMarks;
                array.push(obj);
            }
            else if (marks?.type === 'project') {
                const { projectClassPerformance } = x;
                obj.projectClassPerformance = projectClassPerformance;
                array.push(obj);
            }
        });
        console.log('array  ', array);
        setMarksToView(array);
    }, [marks])


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




    // console.log('state ', state)
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
                            {/* CourseTeacherMarksModal is for generate pdf */}
                            <CourseTeacherMarksModal
                                marksToView={marksToView} marks={marks} showModal={showModal} setShowModal={setShowModal}
                                attendance={attendance} ct1={ct1} ct2={ct2} ct3={ct3} final={final} ctAvg={ctAvg} classThirty={classThirty}
                                labAttendance={labAttendance} labQuiz={labQuiz} labReport={labReport}
                                classPerformanceProject={classPerformanceProject}
                            />
                        </div>
                        <div>
                            {/* mark modall is for giving marks */}
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
                                                <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode?.toUpperCase()}</p>
                                                <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p>
                                            </div>
                                            <Form onSubmit={handleSubmit(onSubmit)}>
                                                <Form.Group className='mb-2'>
                                                    <Table responsive striped bordered hover className='text-center' >
                                                        {/* <col width="11%" />
                                                        <col width="30%" />
                                                        <col width="12%" />
                                                        <col width="12%" />
                                                        <col width="12%" />
                                                        <col width="12%" /> */}
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
                                                                    CT Average<br />(20 marks)

                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Total<br />(30%)

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
                                                                marksToView?.map(x => {
                                                                    // console.log(x?.studentProfileId?.firstName);
                                                                    return (
                                                                        <tr key={x?.id} style={{ border: "1px solid black" }}>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                                    readOnly />
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} defaultValue={x?.name}
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

                                                                                    <p>{x?.ctAvg && x?.ctAvg}</p>
                                                                                }
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {

                                                                                    <p>{x?.ctAvg && x?.thirtyPercent}</p>
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
                                                    label="Ct Average"
                                                    // name="Ct Average"
                                                    id="CtAverage"
                                                    checked={ctAvg}
                                                    onChange={() => setCtAvg(!ctAvg)}
                                                />
                                                <Form.Check
                                                    inline
                                                    type='checkbox'
                                                    label="Thirty"
                                                    // name="thirty"
                                                    id="thirty"
                                                    checked={classThirty}
                                                    onChange={() => setClassThirty(!classThirty)}
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
                                                <div className='text-center mt-3'>
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
                                                <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode?.toUpperCase()}</p>
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
                                                                    Lab Attendance<br />(10 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setLbAttendance(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Lab Report Marks<br /> (20 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setLbReport(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Lab Quiz Marks<br />(20 marks)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setLbQuiz(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Total<br />

                                                                </th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                marksToView.map(x => {
                                                                    // console.log(x)
                                                                    return (
                                                                        <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                                    readOnly />
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} defaultValue={x?.name}
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
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {

                                                                                    <p>{x?.labClass}</p>
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
                                                <div className='text-center mt-3'>
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
                                <div>
                                    {
                                        (isLoadingProposals || isLoadingMarks)
                                            ?
                                            <div className='text-center my-5 py-5 '>
                                                <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </Spinner>
                                            </div>
                                            :
                                            <div className='container'>
                                                <div className='mt-4' >
                                                    <Nav justify variant="pills" defaultActiveKey="1">
                                                        <Nav.Item>
                                                            <Nav.Link onClick={() => { setState('1') }} eventKey="1" >Marks Assign</Nav.Link>
                                                        </Nav.Item>
                                                        <Nav.Item>
                                                            <Nav.Link onClick={() => { setState('2') }} eventKey="2" >Student Application</Nav.Link>
                                                        </Nav.Item>
                                                    </Nav>
                                                </div>
                                            </div>
                                    }


                                    {
                                        state == '1'
                                            ?
                                            <div className='container'>
                                                <div className='container-fluid shadow-lg  rounded  my-5 mx-4'>
                                                    <div className='p-4'>
                                                        <div className=' '>
                                                            <h3 className='text-center mb-3' >Assign Marks</h3>
                                                            <p><span className='fw-bold'>Course Title: </span>{marks?.courseTitle}</p>
                                                            <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode?.toUpperCase()}</p>
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
                                                                            marksToView.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                                                <td style={{ border: "1px solid black" }}>
                                                                                    <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                                        readOnly />
                                                                                </td>
                                                                                <td style={{ border: "1px solid black" }}>
                                                                                    <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} defaultValue={x?.name}
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
                                                            <div className='text-center '>
                                                                <div className='text-center mt-3'>
                                                                    <Button variant='primary' className='me-2' onClick={() => setShowModal(true)}>Generate PDF</Button>
                                                                    {/* <input variant='primary' type="submit" value='Save' className='btn btn-primary' /> */}
                                                                    <Button variant='success' className='me-2' onClick={() => submitAllMarksCourseTeacher()}>Submit Marks</Button>
                                                                </div>
                                                            </div>
                                                        </Form>
                                                    </div>
                                                </div>
                                            </div>
                                            :


                                            < div >

                                                {
                                                    proposals?.length === 0
                                                        ?
                                                        <div className=' d-flex justify-content-center align-items-center half-height' >
                                                            <h5 className='text-center fs-2 text-secondary my-4 fw-bold error-opacity' >You have no Student application</h5>
                                                        </div>
                                                        :
                                                        <div className='container my-5 py-3' style={{ borderRight: "0.2px solid gray", borderLeft: "0.2px solid gray" }}>
                                                            <h3 className='mb-5 pb-5 text-center '>Students Applications</h3>
                                                            {
                                                                proposals?.map(x => <TeacherProjectApplication setProposalState={setProposalState} proposalState={proposalState} key={x._id} applicationDetails={x}>
                                                                </TeacherProjectApplication >)
                                                            }
                                                        </div>
                                                }
                                            </div>

                                    }
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