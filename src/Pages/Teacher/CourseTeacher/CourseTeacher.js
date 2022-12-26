import React, { useEffect, useState } from 'react';
import { Form, Nav, Table, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import checkDepartmentName from '../../../Functions/DeptCodeToDeptName';
// import checkSemesterName from '../../../Functions/SemesterCodeToSemesterName';
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

    const [projectInternalMarks, setProjectInternalMarks] = useState(true)
    const [projectPerformance, setProjectPerformance] = useState(true);


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
    const [projectInternal, setProjectInternal] = useState(false);

    const [remarks, setRemarks] = useState(true);
    const [total, setTotal] = useState(true);

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
        fetch(`https://mbstu-panel-server.onrender.com/api/v1/marks/get-marks/course-teacher/${courseId}`, {
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
            fetch(`https://mbstu-panel-server.onrender.com/api/v1/project-application/proposal-for-teacher/${courseId}`, {
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
                const { projectClassPerformance, projectInternalMarks } = x;
                obj.projectClassPerformance = projectClassPerformance;
                obj.projectInternalMarks = projectInternalMarks;
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
                fetch(`https://mbstu-panel-server.onrender.com/api/v1/marks/turn-in/course-teacher/${courseId}`, {
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
    console.log("maaaarks ============ ", marks);
    // console.log("Viewww== === ", marksToView)
    // console.log("my marks == ", marks);
    // console.log("user ===> ", user);

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
                                labAttendance={labAttendance} labQuiz={labQuiz} labReport={labReport} total={total}
                                classPerformanceProject={classPerformanceProject} remarks={remarks}
                                projectInternalMarks={projectInternalMarks} projectPerformance={projectPerformance}
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
                                setLbReport={setLbReport} lbQuiz={lbQuiz} setLbQuiz={setLbQuiz}
                                projectClassPerformance={projectClassPerformance} setProjectClassPerformance={setProjectClassPerformance}
                                projectInternal={projectInternal} setProjectInternal={setProjectInternal}
                                courseId={courseId} setIsSaving={setIsSaving} isSaving={isSaving}
                            />

                        </div>

                        <div>
                            {
                                marks.type === 'theory'
                                &&
                                <div className='container'>
                                    <div className='container shadow-lg  rounded  my-5 ' >
                                        <div className='p-4 '>
                                            <div className=' '>
                                                <div className='mt-4'>
                                                    <h5 className='text-uppercase text-center fw-bold mb-1 mt-2'>Mawlana Bhashani Science and Technology university</h5>
                                                    <h6 className='text-center'>Santosh,Tangail-1902</h6>
                                                    <h6 className='text-center'>Marks-sheet</h6>
                                                    <h6 className='text-center'>Class Test/Home Work/Assignment/Quiz/Tutorial/Presentation</h6>
                                                </div>

                                                <div>
                                                    {
                                                        console.log(marks?.semesterId?.name, marks?.semesterId?.degree)
                                                    }
                                                    <h6 className='text-center'>{marks?.semesterId?.name} {marks?.semesterId?.degree} Final Examination</h6>

                                                </div>

                                                <div className='mt-1'>
                                                    <p className='text-center mb-1'>Department of {checkDepartmentName(user?.department)}</p>
                                                </div>

                                                <div className='mb-2'>
                                                    <div className='mt-4 d-flex justify-content-between'>
                                                        <div className='d-flex flex-column'>
                                                            <span className='fw-bold'>Course Code: {marks?.courseCode?.toUpperCase()}</span>
                                                            <span className='fw-bold'>Course Title: {marks?.courseTitle}</span>
                                                            <span className='fw-bold'>Name of the Examiner: {marks?.teacher?.name}</span>
                                                        </div>
                                                        <div className='d-flex flex-column align-items-end'>
                                                            <span className='fw-bold'>Credit Hour: {marks?.credit}</span>
                                                            <span className='fw-bold'>Full Marks: 100</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* <p><span className='fw-bold'>Course Title: </span>{marks?.courseTitle}</p>
                                                <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode?.toUpperCase()}</p>
                                                <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p> */}
                                            </div>
                                            <Form onSubmit={handleSubmit(onSubmit)}>
                                                <Form.Group className='mb-2'>
                                                    <Table responsive striped bordered hover className='text-center' >
                                                        <col width="7%" />
                                                        <col width="21%" />
                                                        <col width="9%" />
                                                        <col width="9%" />
                                                        <col width="9%" />
                                                        <col width="9%" />
                                                        <col width="9%" />
                                                        <col width="9%" />
                                                        <col width="9%" />
                                                        <col width="9%" />


                                                        {/* <col width="30%" /> */}
                                                        {/* <col width="12%" /> */}
                                                        {/* <col width="12%" /> */}
                                                        {/* <col width="12%" /> */}
                                                        {/* <col width="12%" /> */}
                                                        <thead>
                                                            <tr  >
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name of the Candidates</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Class Participation <br />(10%)
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
                                                                    Class Test/ Home Work/ Assignment<br />(20%)

                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Total (30%)

                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Final Exam Mark <br />(70%)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setTheoryFinal(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Remarks
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                marksToView?.map(x => {
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
                                                                                {x?.theoryAttendance}
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {x?.theoryCT1}
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {x?.theoryCT2}
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {x?.theoryCT3}
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {x?.ctAvg && x?.ctAvg}
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {x?.ctAvg && x?.thirtyPercent}
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {x?.theoryFinal}
                                                                            </td>
                                                                            <td>
                                                                                {x?.remarks}
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
                                                <Form.Check
                                                    inline
                                                    type='checkbox'
                                                    label="Remarks"
                                                    // name="FinalExamMark"
                                                    id="remarks"
                                                    checked={remarks}
                                                    onChange={() => setRemarks(!remarks)}
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
                                    <div className='container shadow-lg  rounded  my-5 ' >
                                        <div className='p-4'>
                                            <div className=' '>
                                                <div className='mt-4'>
                                                    <h5 className='text-uppercase text-center fw-bold mb-1 mt-2'>Mawlana Bhashani Science and Technology university</h5>
                                                    <h6 className='text-center'>Santosh,Tangail-1902</h6>
                                                    <h6 className='text-center'>Marks-sheet</h6>
                                                    <h6 className='text-center'>Class Test/Home Work/Assignment/Quiz/Tutorial/Presentation</h6>
                                                </div>

                                                <div>
                                                    <h6 className='text-center'>{marks?.semesterId?.name} {marks?.semesterId?.degree} Final Examination</h6>
                                                </div>

                                                <div className='mt-1'>
                                                    <p className='text-center mb-1'>Department of {checkDepartmentName(user?.department)}</p>
                                                </div>

                                                <div className='mb-2'>
                                                    <div className='mt-4 d-flex justify-content-between'>
                                                        <div className='d-flex flex-column'>
                                                            <span className='fw-bold'>Course Code: {marks?.courseCode?.toUpperCase()}</span>
                                                            <span className='fw-bold'>Course Title: {marks?.courseTitle}</span>
                                                            <span className='fw-bold'>Name of the Examiner: {marks?.teacher?.name}</span>
                                                        </div>
                                                        <div className='d-flex flex-column align-items-end'>
                                                            <span className='fw-bold'>Credit Hour: {marks?.credit}</span>
                                                            <span className='fw-bold'>Full Marks: 50</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Form onSubmit={handleSubmit(onSubmit)}>
                                                <Form.Group className='mb-2'>
                                                    <Table responsive striped bordered hover className='text-center'  >
                                                        <col width="15%" />
                                                        <col width="30%" />
                                                        <col width="15%" />
                                                        <col width="15%" />
                                                        <col width="15%" />
                                                        <col width="15%" />
                                                        <thead>
                                                            <tr style={{ border: "1px solid black" }}>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Lab Report Marks<br /> (20%)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setLbReport(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Lab Attendance Marks<br />(10%)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setLbAttendance(true) }}>Edit</span>
                                                                </th>

                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Lab Quiz Marks<br />(20%)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowMarkModal(true); setLbQuiz(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Total (50%)<br />

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
                                                                                {x?.labReport}
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {x?.labAttendance}
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {x?.labQuiz}
                                                                            </td>
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                {x?.labClass}
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
                                                    label="Lab Report"
                                                    id="labReport"
                                                    checked={labReport}
                                                    onChange={() => setLabReport(!labReport)}
                                                />
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
                                                    label="Lab Quiz"
                                                    id="labQuiz"
                                                    checked={labQuiz}
                                                    onChange={() => setLabQuiz(!labQuiz)}
                                                />
                                                <Form.Check
                                                    inline
                                                    type='checkbox'
                                                    label="Total"
                                                    id="total"
                                                    checked={total}
                                                    onChange={() => setTotal(!total)}
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
                                                            <div className='mt-4'>
                                                                <h5 className='text-uppercase text-center fw-bold mb-1 mt-2'>Mawlana Bhashani Science and Technology university</h5>
                                                                <h6 className='text-center'>Santosh,Tangail-1902</h6>
                                                                <h6 className='text-center'>Marks-sheet</h6>
                                                                <h6 className='text-center'>Class Test/Home Work/Assignment/Quiz/Tutorial/Presentation</h6>
                                                            </div>

                                                            <div>
                                                                <h6 className='text-center'>{marks?.semesterId?.name} {marks?.semesterId?.degree} Final Examination</h6>
                                                            </div>

                                                            <div className='mt-1'>
                                                                <p className='text-center mb-1'>Department of {checkDepartmentName(user?.department)}</p>
                                                            </div>

                                                            <div className='mb-2'>
                                                                <div className='mt-4 d-flex justify-content-between'>
                                                                    <div className='d-flex flex-column'>
                                                                        <span className='fw-bold'>Course Code: {marks?.courseCode?.toUpperCase()}</span>
                                                                        <span className='fw-bold'>Course Title: {marks?.courseTitle}</span>
                                                                        <span className='fw-bold'>Name of the Examiner: {user?.fullName}</span>
                                                                    </div>
                                                                    <div className='d-flex flex-column align-items-end'>
                                                                        <span className='fw-bold'>Credit Hour: {marks?.credit}</span>
                                                                        <span className='fw-bold'>Full Marks: 70</span>
                                                                    </div>
                                                                </div>
                                                            </div>
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
                                                                                Internal Examiner Mark<br />(50%)
                                                                                <br />
                                                                                <span className='edit' onClick={() => { setShowMarkModal(true); setProjectInternal(true) }}>Edit</span>
                                                                            </th>
                                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                                Project Performance<br />(20%)
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
                                                                                        <p>{x?.projectInternalMarks}</p>
                                                                                    }
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
                                                                type='checkbox'
                                                                label="Internal Examiner Mark"
                                                                id="projectInternalMarks"
                                                                checked={projectInternalMarks}
                                                                onChange={() => setProjectInternalMarks(!projectInternalMarks)}
                                                            />

                                                            <Form.Check
                                                                inline
                                                                type='checkbox'
                                                                label="Project Performance"
                                                                id="projectPerformance"
                                                                checked={projectPerformance}
                                                                onChange={() => setProjectPerformance(!projectPerformance)}
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