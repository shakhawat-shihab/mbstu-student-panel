import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useParams, useRouteMatch } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';
import useAuth from '../../../../Hooks/useAuth';
import './MarksSheet.css'
import MarksSheetModal from './MarksSheetModal';

import { AiFillCheckCircle } from "react-icons/ai";
import findClosestTwoMarksAvg from '../../../../Functions/FindClosestTwo';

const MarksSheet = () => {
    const { semesterId } = useParams();
    const [semesterInfo, setSemesterInfo] = useState({});
    const [courseId, setCourseId] = useState('');
    const [marks, setMarks] = useState({});
    const [processedMarks, setProcessedMarks] = useState({});
    const [isLoadingMarks, setIsLoadingMarks] = useState(true);
    const [processNewMark, setProcessNewMarks] = useState(true);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const { url } = useRouteMatch();
    const history = useHistory();

    const { isSubmittedByProjectTeacher, teacherList } = marks;
    const { courseTitle, courseCode, credit } = processedMarks

    let teacherCount = 0;
    const total = teacherList?.length;

    if (isSubmittedByProjectTeacher?.length !== 0) {
        isSubmittedByProjectTeacher?.map(x => {
            if (x in teacherList)
                teacherCount++;
        })
    }




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
                // console.log('semester info = ', info);
                // console.log('courses = ', info?.data?.coursesMarks);
                const { name, degree, department, session } = info.data;
                setSemesterInfo({ name, degree, department, session })
                setCourses(info?.data?.coursesMarks)
                setCourseId(info?.data?.coursesMarks?.[0]?._id)
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
                    console.log('marks of a course = ', info?.data);
                    setMarks(info?.data);
                    setIsLoadingMarks(false);
                    setProcessNewMarks(!processNewMark)
                })
        }
    }, [courseId])


    //process marks 
    useEffect(() => {
        // console.log('process marks', marks)
        const supObj = {};
        supObj.courseCode = marks?.courseCode;
        supObj.courseTitle = marks?.courseTitle;
        supObj.credit = marks?.credit;
        supObj.type = marks?.type;
        const array = []
        marks?.studentsMarks?.map(marksOfSingleStudent => {
            // console.log('marksOfSingleStudent ', marksOfSingleStudent)
            const obj = {}
            obj.id = marksOfSingleStudent.id;
            obj.name = marksOfSingleStudent?.studentProfileId?.firstName + ' ' + marksOfSingleStudent?.studentProfileId?.lastName;
            obj.isPaid = marksOfSingleStudent?.isPaid;
            if (marks.type === 'theory') {
                let cnt = 0;
                let sum = 0;
                const { theoryCT1, theoryCT2, theoryCT3, theoryAttendance = 0, theoryFinal = 0, theorySecondExaminer = 0, theoryThirdExaminer = 0 } = marksOfSingleStudent;
                if (theoryCT1 || theoryCT1 === 0) {
                    sum += parseInt(theoryCT1);
                    cnt++;
                }
                if (theoryCT2 || theoryCT2 === 0) {
                    sum += parseInt(theoryCT2);
                    cnt++;
                }
                if (theoryCT3 || theoryCT3 === 0) {
                    sum += parseInt(theoryCT3);
                    cnt++;
                }
                let avg = 0;
                cnt && (avg = sum / cnt);
                //console.log('average ', avg);
                let thirtyPercent;
                theoryAttendance ? (thirtyPercent = Math.round((avg + parseInt(theoryAttendance)))) : (thirtyPercent = Math.round(avg))

                let theoryWritten;
                if (Math.abs(theoryFinal - theorySecondExaminer) > 14) {
                    theoryWritten = findClosestTwoMarksAvg(theoryFinal, theorySecondExaminer, theoryThirdExaminer);
                }
                else {
                    theoryWritten = Math.round((theoryFinal + theorySecondExaminer) / 2)

                }
                let totalMarks = thirtyPercent + theoryWritten
                obj.thirtyPercent = thirtyPercent;

                obj.theoryFinal = theoryFinal;
                obj.theorySecondExaminer = theorySecondExaminer;
                obj.theoryThirdExaminer = theoryThirdExaminer;
                obj.theoryWritten = theoryWritten;
                obj.totalMarks = totalMarks;
                array.push(obj);
            }
            else if (marks.type === 'lab') {
                const { labAttendance = 0, labReport = 0, labQuiz = 0, labExperiment = 0, labViva = 0 } = marksOfSingleStudent;
                // obj.labAttendance = labAttendance;
                // obj.labReport = labReport;
                // obj.labQuiz = labQuiz;
                obj.labClassMark = Math.round(labAttendance + labQuiz + labReport)
                obj.labExamMark = Math.round(labExperiment + labViva)
                array.push(obj);
            }
            else if (marks.type === 'project') {
                const { projectClassPerformance, projectClassPerformanceBy, projectClassPerformanceByProfileId, projectPresentation, projectPresentationBy } = marksOfSingleStudent;
                obj.projectClassPerformance = projectClassPerformance;
                obj.projectClassPerformanceBy = projectClassPerformanceBy;
                obj.projectClassPerformanceByProfileId = projectClassPerformanceByProfileId;
                obj.projectPresentation = projectPresentation;
                obj.projectPresentationBy = projectPresentationBy;
                array.push(obj);
            }
        })
        supObj.marks = array;
        // console.log('supObj ====== ', supObj);
        //console.log(semesterInfo);
        setProcessedMarks(supObj);
    }, [processNewMark]);


    // console.log("semesterInfo === ", semesterInfo);


    const finishExam = () => {
        fetch(`http://localhost:5000/api/v1/semester/exam-taken-done/${semesterId}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
        })
            .then(res => res.json())
            .then(info => {
                console.log('exam taken = ', info);
                if (info?.status === 'success') {
                    Toast.fire({
                        icon: 'success',
                        title: info?.message
                    })
                    // history.push('/dashboard/exam-committee-chairman')
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: info?.message
                    })
                }
            })
    }


    return (
        <div className='px-2 py-4 my-3 shadow-lg w-75 mx-auto rounded'>
            {/* <h3 className='text-center' >Results</h3> */}
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

            <div >
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
                                <div>
                                    <MarksSheetModal showModal={showModal} setShowModal={setShowModal} courses={courses}
                                        courseTitle={courseTitle} courseCode={courseCode} courseId={courseId} credit={credit}
                                        processedMarks={processedMarks} semesterInfo={semesterInfo}
                                    />
                                </div>
                                {
                                    processedMarks?.type === 'theory'
                                    &&
                                    <div className='container'>
                                        <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                            <div className='p-4 '>
                                                <div className='mb-5'>
                                                    <h5 className='text-center mb-5 mt-3 fw-bold'>{semesterInfo?.department?.toUpperCase()} {semesterInfo?.name} {semesterInfo?.degree} Final Examination Result</h5>
                                                    <p><span className='fw-bold'>Course Name: </span>{processedMarks?.courseTitle}</p>
                                                    <p><span className='fw-bold'>Course Code: </span>{processedMarks?.courseCode.toUpperCase()}</p>
                                                    <p><span className='fw-bold'>Credit Hour: </span>{processedMarks?.credit}</p>
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

                                                </div>
                                                <Table responsive striped bordered hover className='text-center' style={{ border: "1px solid black" }}>
                                                    <thead>
                                                        <tr style={{ border: "1px solid black" }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Status</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>CT & Attendance <br /> (30 marks)</th>



                                                            <th className='p-0' style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>

                                                                Course Teacher
                                                                {/* <tr className='display-tr'>
                                                                    <td className='display-td' style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>fd</td>
                                                                    <td className='display-td' style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>fd</td>
                                                                
                                                                </tr> */}

                                                            </th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Second Examiner </th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Third Examiner </th>



                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Final Marks <br /> (70 marks)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Total Marks <br /> (100 marks)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            processedMarks?.marks?.map(x => <tr key={x?._id} style={{ border: "1px solid black" }}>
                                                                <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.id}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.name}</td>
                                                                <td style={{ border: "1px solid black" }}> <i>{x?.isPaid ? 'Paid' : 'Unpaid'}</i> </td>
                                                                <td style={{ border: "1px solid black" }}>{x?.thirtyPercent}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.theoryFinal}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.theorySecondExaminer}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.theoryThirdExaminer}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.theoryWritten}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.totalMarks}</td>
                                                            </tr>)
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {
                                    processedMarks?.type === 'lab'
                                    &&
                                    <div className='container'>
                                        <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                            <div className='p-4 '>
                                                <div className='mb-5'>
                                                    <h5 className='text-center mb-5 mt-3 fw-bold'>{semesterInfo?.department?.toUpperCase()} {semesterInfo?.name} {semesterInfo?.degree} Final Examination Result</h5>
                                                    <p><span className='fw-bold'>Course Name: </span>{processedMarks?.courseTitle}</p>
                                                    <p><span className='fw-bold'>Course Code: </span>{processedMarks?.courseCode}</p>
                                                    <p><span className='fw-bold'>Credit Hour: </span>{processedMarks?.credit}</p>
                                                    <p><span className='fw-bold'>Course Teacher: </span>
                                                        {marks?.teacher?.name}
                                                        {marks?.isSubmittedByCourseTeacher ?
                                                            <span> (Submitted)</span>
                                                            :
                                                            <span> (Not submitted)</span>}
                                                    </p>
                                                </div>
                                                <Table responsive striped bordered hover className='text-center' style={{ border: "1px solid black" }}>
                                                    <thead>
                                                        <tr style={{ border: "1px solid black" }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Status</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Marks <br /> (50 marks)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Experiment Marks <br /> (50 marks)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Total</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>LG</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>GP</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            processedMarks?.marks?.map(x => <tr key={x?._id} style={{ border: "1px solid black" }}>
                                                                <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.id}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.name}</td>
                                                                <td style={{ border: "1px solid black" }}>  <i>{x?.isPaid ? 'Paid' : 'Unpaid'}</i>  </td>
                                                                <td style={{ border: "1px solid black" }}>{x?.labClassMark}</td>
                                                                <td title={'By ' + x?.labExperimentBy} style={{ border: "1px solid black" }}>{x?.labExamMark}</td>

                                                            </tr>)
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {
                                    processedMarks?.type === 'project'
                                    &&
                                    <div className='container'>
                                        <div className='container-fluid shadow-lg rounded  my-5 ' >
                                            <div className='p-4 '>
                                                <div className='mb-5'>
                                                    <h5 className='text-center mb-5 mt-3 fw-bold'>{semesterInfo?.department?.toUpperCase()} {semesterInfo?.name} {semesterInfo?.degree} Final Examination Result</h5>
                                                    <p><span className='fw-bold'>Course Name: </span>{processedMarks?.courseTitle}</p>
                                                    <p><span className='fw-bold'>Course Code: </span>{processedMarks?.courseCode}</p>
                                                    <p><span className='fw-bold'>Credit Hour: </span>{processedMarks?.credit}</p>
                                                    <p><span className='fw-bold'>Project Teachers: </span>
                                                        {
                                                            (isSubmittedByProjectTeacher.length === teacherList.length)
                                                                ?
                                                                <span>All teachers submitted their marks</span>
                                                                :
                                                                <span>Submitted {isSubmittedByProjectTeacher.length} of {teacherList.length} teachers</span>

                                                        }
                                                    </p>

                                                </div>
                                                <Table responsive striped bordered hover className='text-center' style={{ border: "1px solid black" }}>
                                                    <thead>
                                                        <tr style={{ border: "1px solid black" }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Status</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Performance <br /> (70 marks)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Presentation and Viva<br /> (30 marks)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            processedMarks?.marks?.map(x => <tr key={x?._id} style={{ border: "1px solid black" }}>
                                                                <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.id}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.name}</td>
                                                                <td style={{ border: "1px solid black" }}>  <i>{x?.isPaid ? 'Paid' : 'Unpaid'}</i>  </td>
                                                                <td title={'By ' + x?.projectClassPerformanceBy} style={{ border: "1px solid black" }}>{x?.projectClassPerformance}</td>
                                                                <td title={'By ' + x?.projectPresentationBy} style={{ border: "1px solid black" }}>{x?.projectPresentation}</td>
                                                            </tr>)
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>

                                }

                                <div className='text-center'>
                                    <Button variant='primary' className='me-2' onClick={() => setShowModal(true)}> Generate PDF</Button>
                                    {/* <Button
                                        // onClick={() => { handleResult() }}
                                        variant='primary'>
                                        Publish Result</Button> */}
                                    <Link className='ms-2' to={`${url}/result-sheet`}>
                                        <Button onClick={() => { }} variant='success'>Generate Result Sheet</Button>
                                    </Link>
                                    <Button variant='primary' className='ms-2' onClick={() => finishExam()}> Exam Finished</Button>
                                </div>
                            </>
                    }
                </div>
            </div>


        </div>
    );
};

export default MarksSheet;