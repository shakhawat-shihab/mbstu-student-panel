import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import Swal from 'sweetalert2';
import checkDepartmentName from '../../../../Functions/DeptCodeToDeptName';
import findClosestTwoMarksAvg from '../../../../Functions/FindClosestTwo';
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

    const [semesterInfo, setSemesterInfo] = useState({});


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
                const { name, degree, department, session } = info.data;
                setSemesterInfo({ name, degree, department, session })
                // console.log('semester = ', info);
                const coursesExceptTheory = [];
                info?.data?.coursesMarks.map(x => {
                    // if (x.type !== 'theory')
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
                    console.log('course marks = ', info?.data);

                    //process mark
                    const supObj = {};
                    supObj.courseCode = info?.data?.courseCode;
                    supObj.courseTitle = info?.data?.courseTitle;
                    supObj.credit = info?.data?.credit;
                    supObj.type = info?.data?.type;
                    const array = []
                    info?.data?.studentsMarks?.map(marksOfSingleStudent => {
                        // console.log('marksOfSingleStudent ', marksOfSingleStudent)
                        const obj = {}
                        obj.id = marksOfSingleStudent.id;
                        obj.name = marksOfSingleStudent?.studentProfileId?.firstName + ' ' + marksOfSingleStudent?.studentProfileId?.lastName;
                        obj.isPaid = marksOfSingleStudent?.isPaid;
                        if (info?.data.type === 'theory') {
                            const { theoryFinal = 0, theorySecondExaminer = 0, theoryThirdExaminer = 0 } = marksOfSingleStudent;
                            let theoryWritten;
                            if (Math.abs(theoryFinal - theorySecondExaminer) > 14) {
                                theoryWritten = findClosestTwoMarksAvg(theoryFinal, theorySecondExaminer, theoryThirdExaminer);
                            }
                            else {
                                theoryWritten = Math.round((theoryFinal + theorySecondExaminer) / 2)
                            }
                            obj.theoryFinal = theoryFinal;
                            obj.theorySecondExaminer = theorySecondExaminer;
                            obj.theoryThirdExaminer = theoryThirdExaminer;
                            obj.theoryWritten = theoryWritten;
                            if (Math.abs(theoryFinal - theorySecondExaminer) > 14) {
                                obj.remarks = "Third Examiner";
                            }
                            array.push(obj);
                        }
                        else if (info?.data.type === 'lab') {
                            const { labExperiment = 0, labViva = 0 } = marksOfSingleStudent;
                            obj.labExperiment = labExperiment
                            obj.labViva = labViva
                            array.push(obj);
                        }
                        else if (info?.data.type === 'project') {
                            const { projectClassPerformance, projectClassPerformanceBy, projectClassPerformanceByProfileId, projectPresentation, projectPresentationBy } = marksOfSingleStudent;
                            obj.projectClassPerformance = projectClassPerformance;
                            obj.projectClassPerformanceBy = projectClassPerformanceBy;
                            obj.projectClassPerformanceByProfileId = projectClassPerformanceByProfileId;
                            obj.projectPresentation = projectPresentation;
                            obj.projectPresentationBy = projectPresentationBy;
                            array.push(obj);
                        }
                    })
                    // console.log('array  ==> ', array)
                    supObj.marks = array;
                    supObj.teacher = info?.data?.teacher;
                    supObj.isSubmittedByCourseTeacher = info?.data?.isSubmittedByCourseTeacher;
                    supObj.secondExaminer = info?.data?.secondExaminer;
                    supObj.isSubmittedBySecondExaminer = info?.data?.isSubmittedBySecondExaminer;
                    supObj.thirdExaminer = info?.data?.thirdExaminer;
                    supObj.isSubmittedByThirdExaminer = info?.data?.isSubmittedByThirdExaminer;
                    supObj.teacherList = info?.data?.teacherList;
                    supObj.isSubmittedByProjectTeacher = info?.data?.isSubmittedByProjectTeacher;
                    console.log('supObj  ==> ', supObj)
                    setMarks(supObj);
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
                        marks={marks} course={course} courseName={courseName} courseCode={courseCode} credit={credit} semesterAllMarks={semesterAllMarks} semesterInfo={semesterInfo} showModal={showModal} setShowModal={setShowModal}
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
                                    marks?.type === 'theory'
                                    &&
                                    <div className='container'>
                                        <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                            <div className='p-4 '>
                                                {/* <div className='mb-5'>
                                                    <h3 className='text-center mb-2' >Theory</h3>
                                                    <h5 className='text-center mb-5' >Average Number List</h5>
                                                    <p><span className='fw-bold'>Course Title: </span>{marks?.courseTitle}</p>
                                                    <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode.toUpperCase()}</p>
                                                    <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p>
                                                </div> */}
                                                <div className='mt-4'>
                                                    <h5 className='text-uppercase text-center mb-1 mt-2'>Mawlana Bhashani Science and Technology university</h5>
                                                    <h6 className='text-center'>Santosh,Tangail-1902</h6>
                                                    <h5 className='fw-bold text-center'>Average Number List</h5>
                                                </div>

                                                <div>
                                                    <h6 className='text-center'>{semesterInfo?.name} {semesterInfo?.degree} Final Examination</h6>
                                                </div>

                                                <div className='mt-1'>
                                                    <p className='text-center mb-1'>Department of {checkDepartmentName(user?.department)}</p>
                                                </div>
                                                <div className='mb-2'>
                                                    <div className='mt-4 d-flex justify-content-between'>
                                                        <div className='d-flex flex-column'>
                                                            <span className='fw-bold'>Course Code: {marks?.courseCode?.toUpperCase()}</span>
                                                            <span className='fw-bold'>Course Title: {marks?.courseTitle}</span>
                                                        </div>
                                                        <div className='d-flex flex-column'>
                                                            <span className='fw-bold'>Credit Hour: {marks?.credit}</span>
                                                            <span className='fw-bold'>Full Marks: 50</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p><span className='fw-bold'>Course Teacher: </span>
                                                    {marks?.teacher?.name}
                                                    {marks?.isSubmittedByCourseTeacher ?
                                                        <span> (Submitted)</span>
                                                        :
                                                        <span> (Not submitted)</span>
                                                    }
                                                </p>
                                                <p><span className='fw-bold'>Second Examiner: </span>
                                                    {marks?.secondExaminer?.name}
                                                    {marks?.isSubmittedBySecondExaminer ?
                                                        <span> (Submitted)</span>
                                                        :
                                                        <span> (Not submitted)</span>}
                                                </p>
                                                <p><span className='fw-bold'>Third Examiner: </span>
                                                    {marks?.thirdExaminer?.name}
                                                    {marks?.isSubmittedByThirdExaminer
                                                        ?
                                                        <span> (Submitted)</span>
                                                        :
                                                        <span> (Not submitted)</span>}
                                                </p>
                                                <Form
                                                // onSubmit={handleSubmit(onSubmitLabMarks)}
                                                >
                                                    <Table responsive striped bordered hover className='text-center' style={{ border: '1px solid black' }}>
                                                        <thead>
                                                            <tr style={{ border: '1px solid black', fontSize: "12px" }}>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} className="py-2">Student Id</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Internal Examiner
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    External Examiner
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Third Examiner
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Average
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Remarks
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {
                                                                marks?.marks?.map(x => <tr key={`${x?.id}_${courseCode}`} style={{ border: '1px solid black' }}>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                            readOnly />
                                                                    </td>
                                                                    <td style={{ border: '1px solid black' }}>{x?.name}</td>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        {x?.theoryFinal}
                                                                    </td>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        {x?.theorySecondExaminer}
                                                                    </td>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        {x?.theoryThirdExaminer}
                                                                    </td>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        {x?.theoryWritten}
                                                                    </td>
                                                                    <td style={{ border: '1px solid black', fontSize: "12px" }}>
                                                                        {x?.remarks && <span>3<sup>rd</sup> Examiner</span>}
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
                                    marks?.type === 'lab'
                                    &&
                                    <div className='container'>
                                        <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                            <div className='p-4 '>
                                                <div className='mt-4'>
                                                    <h5 className='text-uppercase text-center mb-1 mt-2'>Mawlana Bhashani Science and Technology university</h5>
                                                    <h6 className='text-center'>Santosh,Tangail-1902</h6>
                                                    <h5 className='fw-bold text-center'>Average Number List</h5>
                                                </div>

                                                <div>
                                                    <h6 className='text-center'>{semesterInfo?.name} {semesterInfo?.degree} Final Examination</h6>
                                                </div>

                                                <div className='mt-1'>
                                                    <p className='text-center mb-1'>Department of {checkDepartmentName(user?.department)}</p>
                                                </div>
                                                <div className='mb-2'>
                                                    <div className='mt-4 d-flex justify-content-between'>
                                                        <div className='d-flex flex-column'>
                                                            <span className='fw-bold'>Course Code: {marks?.courseCode?.toUpperCase()}</span>
                                                            <span className='fw-bold'>Course Title: {marks?.courseTitle}</span>
                                                        </div>
                                                        <div className='d-flex flex-column'>
                                                            <span className='fw-bold'>Credit Hour: {marks?.credit}</span>
                                                            <span className='fw-bold'>Full Marks: 50</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p>
                                                    <span className='fw-bold'>Course Teacher: </span>
                                                    {marks?.teacher?.name}
                                                    {marks?.isSubmittedByCourseTeacher ?
                                                        <span> (Submitted)</span>
                                                        :
                                                        <span> (Not submitted)</span>
                                                    }
                                                </p>

                                                <Form
                                                // onSubmit={handleSubmit(onSubmitLabMarks)}
                                                >
                                                    <Table responsive striped bordered hover className='text-center' style={{ border: '1px solid black' }}>
                                                        <thead>
                                                            <tr style={{ border: '1px solid black' }}>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Final Practical exam/Sessional Marks <br /> (40)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowCommitteeModal(true); setExamCommitteeLabExp(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Viva-voce Marks <br /> (10)
                                                                    <br />
                                                                    <span className='edit' onClick={() => { setShowCommitteeModal(true); setExamCommitteeLabViva(true) }}>Edit</span>
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Total <br /> (50)
                                                                    {/* <br />
                                                                    <span className='edit' onClick={() => { setShowCommitteeModal(true); setExamCommitteeLab(true) }}>Edit</span> */}
                                                                </th>
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Remarks
                                                                </th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>

                                                            {
                                                                marks?.marks?.map(x => <tr key={`${x?.id}_${courseCode}`} style={{ border: '1px solid black' }}>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                            readOnly />
                                                                    </td>
                                                                    <td style={{ border: '1px solid black' }}>{x?.name}</td>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        <span
                                                                            title={`By ${x?.labExperimentBy}`} >
                                                                            {x?.labExperiment}
                                                                        </span>
                                                                    </td>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        <span
                                                                            title={`By ${x?.labVivaBy}`} >
                                                                            {x?.labViva}
                                                                        </span>
                                                                    </td>
                                                                    <td style={{ border: '1px solid black' }}>

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
                                                                    </td>
                                                                    <td>{x?.remarks}</td>
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
                                                <div className='mt-4'>
                                                    <h5 className='text-uppercase text-center mb-1 mt-2'>Mawlana Bhashani Science and Technology university</h5>
                                                    <h6 className='text-center'>Santosh,Tangail-1902</h6>
                                                    <h5 className='fw-bold text-center'>Average Number List</h5>
                                                </div>

                                                <div>
                                                    <h6 className='text-center'>{semesterInfo?.name} {semesterInfo?.degree} Final Examination</h6>
                                                </div>

                                                <div className='mt-1'>
                                                    <p className='text-center mb-1'>Department of {checkDepartmentName(user?.department)}</p>
                                                </div>
                                                <div className='mb-2'>
                                                    <div className='mt-4 d-flex justify-content-between'>
                                                        <div className='d-flex flex-column'>
                                                            <span className='fw-bold'>Course Code: {marks?.courseCode?.toUpperCase()}</span>
                                                            <span className='fw-bold'>Course Title: {marks?.courseTitle}</span>
                                                        </div>
                                                        <div className='d-flex flex-column'>
                                                            <span className='fw-bold'>Credit Hour: {marks?.credit}</span>
                                                            <span className='fw-bold'>Full Marks: 50</span>
                                                        </div>
                                                    </div>
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
                                                                marks?.marks?.map(x => <tr key={x?.s_id}>
                                                                    <td style={{ border: '1px solid black' }}>
                                                                        <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                            readOnly />
                                                                    </td>
                                                                    <td style={{ border: '1px solid black' }}>{x?.name}</td>

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