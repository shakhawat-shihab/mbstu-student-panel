import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useParams, useRouteMatch } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';
import useAuth from '../../../../Hooks/useAuth';
import './MarksSheet.css'
import MarksSheetModal from './MarksSheetModal';

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
                    // console.log('marks of a course = ', info?.data);
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
            if (marks.type === 'theory') {
                let cnt = 0;
                let sum = 0;
                const { theoryCT1, theoryCT2, theoryCT3, theoryAttendance, theoryFinal = 0, theorySecondExaminer = 0, theoryThirdExaminer = 0 } = marksOfSingleStudent;
                if (theoryCT1 || theoryCT1 === 0) {
                    sum += parseInt(theoryCT1);
                    cnt++;
                }
                if (theoryCT2 || theoryCT2 === 0) {
                    sum += parseInt(theoryCT2);
                    cnt++;
                }
                if (theoryCT3 || theoryCT3 == 0) {
                    sum += parseInt(theoryCT3);
                    cnt++;
                }
                let avg = 0;
                cnt && (avg = sum / cnt);
                //console.log('average ', avg);
                let thirtyPercent;
                theoryAttendance ? (thirtyPercent = Math.round((avg + parseInt(theoryAttendance)))) : (thirtyPercent = Math.round(avg))

                let theoryWritten;
                if (Math.abs(theorySecondExaminer - theoryThirdExaminer) > 15) {
                    theoryWritten = parseInt((theoryFinal + theorySecondExaminer + theoryThirdExaminer) / 3)
                }
                else {
                    theoryWritten = parseInt((theoryFinal + theorySecondExaminer) / 2)

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
                const { labAttendance = 0, labReport = 0, labQuiz = 0, labExperiment, labExperimentBy } = marksOfSingleStudent;
                // obj.labAttendance = labAttendance;
                // obj.labReport = labReport;
                // obj.labQuiz = labQuiz;
                obj.labClassMark = parseInt(labAttendance + labQuiz + labReport)
                obj.labExperiment = labExperiment;
                obj.labExperimentBy = labExperimentBy;
                array.push(obj);
            }
            else if (marks.type === 'project') {
                const { projectClassPerformance, projectPresentation, projectPresentationBy } = marksOfSingleStudent;
                obj.projectClassPerformance = projectClassPerformance;
                obj.projectPresentation = projectPresentation;
                obj.projectPresentationBy = projectPresentationBy;
                array.push(obj);
            }
        })
        supObj.marks = array;
        // console.log('supObj ====== ', supObj);
        console.log(semesterInfo);
        setProcessedMarks(supObj);
    }, [processNewMark]);


    // const onSubmit = (v) => {
    //     // setCourseCodeChanging(!courseCodeChanging);
    //     console.log(' on submit data == ', v);
    //     // courses?.map(c => {
    //     //     if (c.course_code === v) {
    //     //         setCourseName(c.course_title)
    //     //         console.log("yeee", c.credit);
    //     //         setCredit(c.credit);
    //     //     }
    //     // })
    //     // const courseObj = courses.find((obj) => {
    //     //     return obj.course_code === v;
    //     // });
    //     // console.log('courseObj ', courseObj)


    //     // const val = data.course_code;
    //     //console.log("val ", v);
    //     setCourseCode(v);
    //     const marksOfSelectedCourse = semesterAllMarks[`${v}_marks`];
    //     console.log('marksOfSelectedCourse ', marksOfSelectedCourse)
    //     setCourse(marksOfSelectedCourse);
    // }
    // const handleResult = () => {
    //     console.log("Handle result ", semesterAllMarks)
    //     console.log("semester ", semester)

    //     //console.log('students ', );
    //     const dropped = [];
    //     const students = [];
    //     semester?.regular_students?.map(x => {
    //         const student = {}
    //         student.s_id = x.s_id;
    //         const array = [];
    //         let credit_earned = 0;
    //         const obj = {}
    //         courses.map(c => {
    //             // if (c.type == 'theory') {
    //             let { ct1, ct2, ct3, attendance, course_teacher_marks, second_examiner_marks, third_examiner_marks, final_marks, lab_attendance, lab_report, lab_quiz, class_marks_lab, class_marks_project, supervisor, presentation_marks_project, presentation_marks_project_by, experiment_marks_lab, experiment_marks_lab_by } = x[`${c.course_code}`];
    //             let cnt = 0;
    //             // i wass working here
    //             const subObj = {}
    //             subObj.course_code = c.course_code;
    //             subObj.credit = c.credit;
    //             if (c.type === 'theory') {
    //                 let sum = 0;
    //                 if (ct1 || ct1 == 0) {
    //                     sum += parseInt(ct1);
    //                     cnt++;
    //                 }
    //                 if (ct2 || ct2 == 0) {
    //                     sum += parseInt(ct2);
    //                     cnt++;
    //                 }
    //                 if (ct3 || ct3 == 0) {
    //                     sum += parseInt(ct3);
    //                     cnt++;
    //                 }
    //                 let avg = 0;
    //                 cnt && (avg = sum / cnt);
    //                 let thirtyPercent;
    //                 attendance && (thirtyPercent = Math.round((avg + parseInt(attendance))));
    //                 (!final_marks) && (final_marks = 0);
    //                 (!thirtyPercent) && (thirtyPercent = 0);
    //                 subObj.thirtyPercent = thirtyPercent;
    //                 let total_marks = 0;
    //                 ((final_marks || final_marks == 0) && (thirtyPercent || thirtyPercent == 0)) && (total_marks = parseInt(thirtyPercent) + parseInt(final_marks));
    //                 subObj.final_marks = final_marks;
    //                 subObj.total_marks = total_marks;
    //                 if (total_marks > 40) {
    //                     credit_earned += c.credit;
    //                 }

    //             }
    //             //lab , sessional
    //             else if (c.type === 'lab') {
    //                 let total_marks = 0;
    //                 (!class_marks_lab) && (class_marks_lab = 0);
    //                 (!experiment_marks_lab) && (experiment_marks_lab = 0);
    //                 subObj.class_marks_lab = class_marks_lab;
    //                 subObj.experiment_marks_lab = experiment_marks_lab;
    //                 //subObj.experiment_marks_lab_by = experiment_marks_lab_by;
    //                 ((class_marks_lab || class_marks_lab == 0) && (experiment_marks_lab || experiment_marks_lab == 0)) && (total_marks = parseInt(class_marks_lab) + parseInt(experiment_marks_lab));
    //                 subObj.total_marks = total_marks;
    //                 if (total_marks > 40) {
    //                     credit_earned += c.credit;
    //                 }

    //             }
    //             //project
    //             else if (c.type === 'project') {
    //                 let total_marks = 0;
    //                 (!class_marks_project) && (class_marks_project = 0);
    //                 (!presentation_marks_project) && (presentation_marks_project = 0);
    //                 subObj.supervisor = supervisor;
    //                 subObj.class_marks_project = class_marks_project;
    //                 subObj.presentation_marks_project = presentation_marks_project;
    //                 // subObj.presentation_marks_project_by = presentation_marks_project_by;
    //                 ((class_marks_project || class_marks_project == 0) && (presentation_marks_project || presentation_marks_project == 0)) && (total_marks = parseInt(class_marks_project) + parseInt(presentation_marks_project));
    //                 subObj.total_marks = total_marks;
    //                 if (total_marks > 40) {
    //                     credit_earned += c.credit;
    //                 }
    //             }
    //             //console.log(` ${x.s_id} ${c.course_code} `, subObj)
    //             // }
    //             //array.push(subObj)
    //             obj[`${c.course_code}`] = subObj;
    //         })
    //         if (credit_earned < 2) {
    //             dropped.push(x?.s_id);
    //         }
    //         // else {
    //         console.log(' x.semester_code ', semester?.semester_code)
    //         //type ! = backlog hole,,,,,,,
    //         student.semester_code = parseInt(semester?.semester_code) + 1;
    //         student.marks = obj;
    //         students.push(student);
    //         // }
    //     })
    //     console.log('students ', students);

    //     fetch(`http://localhost:5000/publish-result-object`, {
    //         method: 'put',
    //         headers: {
    //             'content-type': 'application/json'
    //         },
    //         body: JSON.stringify(students)
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log("data ==", data);
    //             if (data.nModified) {
    //                 Toast.fire({
    //                     icon: 'success',
    //                     title: 'Successfully updated Result'
    //                 })
    //             }
    //         });

    // }

    // console.log('course ', course)
    // console.log('semmeester = ', semester);
    // console.log('credit = ', credit);

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
                {/* <div>
                    <MarksSheetModal
                        course={course} courseName={semesterAllMarks[`${courseCode}_title`]} courseCode={courseCode} credit={semesterAllMarks[`${courseCode}_credit`]} semesterAllMarks={semesterAllMarks} showModal={showModal} setShowModal={setShowModal}
                    />
                </div> */}
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
                                    processedMarks?.type === 'theory'
                                    &&
                                    <div className='container'>
                                        <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                            <div className='p-4 '>
                                                <div className='mb-5'>
                                                    <h3 className='text-center mb-5' >Result</h3>
                                                    <p><span className='fw-bold'>Course Name: </span>{processedMarks?.courseTitle}</p>
                                                    <p><span className='fw-bold'>Course Code: </span>{processedMarks?.courseCode}</p>
                                                    <p><span className='fw-bold'>Credit Hour: </span>{processedMarks?.credit}</p>
                                                </div>
                                                <Table responsive striped bordered hover className='text-center' style={{ border: "1px solid black" }}>
                                                    <thead>
                                                        <tr style={{ border: "1px solid black" }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>CT & Attendance (30%)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Course Teacher </th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Second Examiner </th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Third Examiner </th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Final Marks (70%)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Total Marks (100%)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            processedMarks?.marks?.map(x => <tr key={x?.id} style={{ border: "1px solid black" }}>
                                                                <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.id}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.name}</td>
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
                                                    <h3 className='text-center mb-5' >Result</h3>
                                                    <p><span className='fw-bold'>Course Name: </span>{processedMarks?.courseTitle}</p>
                                                    <p><span className='fw-bold'>Course Code: </span>{processedMarks?.courseCode}</p>
                                                    <p><span className='fw-bold'>Credit Hour: </span>{processedMarks?.credit}</p>
                                                </div>
                                                <Table responsive striped bordered hover className='text-center' style={{ border: "1px solid black" }}>
                                                    <thead>
                                                        <tr style={{ border: "1px solid black" }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Marks (60%)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Experiment Marks (40%)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            processedMarks?.marks?.map(x => <tr key={x?.id} style={{ border: "1px solid black" }}>
                                                                <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.id}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.name}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.labClassMark}</td>
                                                                <td title={'By ' + x?.labExperimentBy} style={{ border: "1px solid black" }}>{x?.labExperiment}</td>
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
                                                    <h3 className='text-center mb-5' >Result</h3>
                                                    <p><span className='fw-bold'>Course Name: </span>{processedMarks?.courseTitle}</p>
                                                    <p><span className='fw-bold'>Course Code: </span>{processedMarks?.courseCode}</p>
                                                    <p><span className='fw-bold'>Credit Hour: </span>{processedMarks?.credit}</p>
                                                </div>
                                                <Table responsive striped bordered hover className='text-center' style={{ border: "1px solid black" }}>
                                                    <thead>
                                                        <tr style={{ border: "1px solid black" }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Performance (70%)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Presentation and Viva (30%)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            processedMarks?.marks?.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                                <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.id}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.name}</td>
                                                                <td title={`By ${x?.class_marks_project_by}`} style={{ border: "1px solid black" }}>{x?.projectClassPerformance}</td>
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
                                    <Button variant='success' className='me-2' onClick={() => setShowModal(true)}> Generate PDF</Button>
                                    {/* <Button
                                        // onClick={() => { handleResult() }}
                                        variant='primary'>
                                        Publish Result</Button> */}
                                    <Link className='ms-2' to={`${url}/result-sheet`}>
                                        <Button onClick={() => { }} variant='success'>Generate Result Sheet</Button>
                                    </Link>
                                </div>
                            </>
                    }
                </div>
            </div>


        </div>
    );
};

export default MarksSheet;