import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Link, useParams, useRouteMatch } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import './SemesterChairman.css'
import SemesterChairmanModal from './SemesterChairmanModal';
const SemesterChairman = () => {
    const { semesterId } = useParams();
    const [semester, setSemester] = useState({});
    const [semesterAllMarks, setSemesterAllMarks] = useState({});
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState([]);
    // const [courseInfo, setCourseInfo] = useState([]);
    const [courseCode, setCourseCode] = useState('');
    // const [courseName, setCourseName] = useState('');
    // const [credit, setCredit] = useState(0);
    const [showModal, setShowModal] = useState(false);

    //const [courseCode]
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
    const { dept, user } = useAuth();
    const email = user?.email;
    const history = useHistory();
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
    useEffect(() => {
        fetch(`http://localhost:5000/semester/${semesterId}/${email}`)
            .then(res => res.json())
            .then(data => {
                console.log('semester = ', data);
                if (data?.code === "403") {
                    Toast.fire({
                        icon: 'error',
                        title: data?.message
                    })
                    history.push('/home');
                }
                else {
                    setSemester(data);
                }
            })
    }, [semesterId, email]);

    // console.log('semester ', semester);
    useEffect(() => {
        if (semester && Object.keys(semester).length !== 0) {
            const allMarks = {};
            //console.log("Semester value ", semester)
            const coursesArray = []
            semester?.courses.map(x => {
                const objj = {};
                objj.course_code = x.course_code
                objj.course_title = x.course_title
                objj.credit = x.credit
                objj.type = x.type
                coursesArray.push(objj);
            })
            const { s_id, displayName, ...onlyCourses } = semester?.regular_students?.[0];
            //console.log("onlyCourses ", onlyCourses);
            semester?.courses.map(x => {
                const arr = []
                //console.log('code ', x.course_code);
                semester.regular_students.map(student => {
                    const subObj = {}
                    const { ct1, ct2, ct3, attendance, course_teacher_marks, second_examiner_marks, third_examiner_marks, final_marks, lab_attendance, lab_report, lab_quiz, class_marks_lab, class_marks_project, class_marks_project_by, supervisor, presentation_marks_project, presentation_marks_project_by, experiment_marks_lab, experiment_marks_lab_by } = student[`${x.course_code}`];
                    //console.log(ct1, ct2, ct3, attendance);
                    //theory
                    let cnt = 0;
                    if (x.type === 'theory') {
                        let sum = 0;
                        if (ct1 || ct1 == 0) {
                            sum += parseInt(ct1);
                            cnt++;
                        }
                        if (ct2 || ct2 == 0) {
                            sum += parseInt(ct2);
                            cnt++;
                        }
                        if (ct3 || ct3 == 0) {
                            sum += parseInt(ct3);
                            cnt++;
                        }
                        let avg = 0;
                        cnt && (avg = sum / cnt);
                        //console.log('average ', avg);
                        let thirtyPercent;
                        attendance && (thirtyPercent = Math.round((avg + parseInt(attendance))));
                        let total_marks;
                        ((final_marks || final_marks == 0) && (thirtyPercent || thirtyPercent == 0)) && (total_marks = parseInt(thirtyPercent) + parseInt(final_marks));
                        subObj.thirtyPercent = thirtyPercent;
                        subObj.course_teacher_marks = course_teacher_marks;
                        subObj.second_examiner_marks = second_examiner_marks;
                        subObj.third_examiner_marks = third_examiner_marks;
                        subObj.final_marks = final_marks;
                        total_marks && (subObj.total_marks = total_marks);
                    }
                    //lab , sessional
                    else if (x.type === 'lab') {
                        subObj.class_marks_lab = class_marks_lab;
                        subObj.experiment_marks_lab = experiment_marks_lab;
                        subObj.experiment_marks_lab_by = experiment_marks_lab_by;
                    }
                    //project
                    else if (x.type === 'project') {
                        subObj.class_marks_project = class_marks_project;
                        subObj.class_marks_project_by = class_marks_project_by;
                        subObj.presentation_marks_project = presentation_marks_project;
                        subObj.presentation_marks_project_by = presentation_marks_project_by;
                    }

                    subObj.displayName = student?.displayName;
                    subObj.s_id = student?.s_id;

                    // console.log('subObj =====', subObj);
                    arr.push(subObj);
                })
                //console.log('arr ', arr);
                //const obj
                allMarks[`${x.course_code}_title`] = x.course_title;
                allMarks[`${x.course_code}_marks`] = arr;
                allMarks[`${x.course_code}_type`] = x.type;
                allMarks[`${x.course_code}_credit`] = x.credit;
            })
            console.log('allMarks ', allMarks);
            setSemesterAllMarks(allMarks);
            setCourses(coursesArray);
            //set first course as selected course before chosing any code
            if (courseCode == '') {
                setCourse(allMarks[`${coursesArray[0].course_code}_marks`]);
                // const obj = {}
                // obj.courseCode = coursesArray[0]['course_code'];
                // obj.courseTitle = coursesArray[0]['course_title']
                // obj.credit = coursesArray[0]['credit']
                // setCourseInfo(obj)
                setCourseCode(coursesArray[0]['course_code'])
                // setCredit(coursesArray[0]['course_title'])
                // setCourseName(coursesArray[0]['credit'])
            }
            //console.log('coursesArray ', coursesArray)
            //console.log('allMarks ', allMarks);
        }
    }, [semester]);
    //console.log("semesterAllMarks ", semesterAllMarks);

    const onSubmit = (v) => {
        // setCourseCodeChanging(!courseCodeChanging);
        console.log(' on submit data == ', v);
        // courses?.map(c => {
        //     if (c.course_code === v) {
        //         setCourseName(c.course_title)
        //         console.log("yeee", c.credit);
        //         setCredit(c.credit);
        //     }
        // })
        // const courseObj = courses.find((obj) => {
        //     return obj.course_code === v;
        // });
        // console.log('courseObj ', courseObj)


        // const val = data.course_code;
        //console.log("val ", v);
        setCourseCode(v);
        const marksOfSelectedCourse = semesterAllMarks[`${v}_marks`];
        console.log('marksOfSelectedCourse ', marksOfSelectedCourse)
        setCourse(marksOfSelectedCourse);
    }
    const handleResult = () => {
        console.log("Handle result ", semesterAllMarks)
        console.log("semester ", semester)

        //console.log('students ', );
        const dropped = [];
        const students = [];
        semester?.regular_students?.map(x => {
            const student = {}
            student.s_id = x.s_id;
            const array = [];
            let credit_earned = 0;
            const obj = {}
            courses.map(c => {
                // if (c.type == 'theory') {
                let { ct1, ct2, ct3, attendance, course_teacher_marks, second_examiner_marks, third_examiner_marks, final_marks, lab_attendance, lab_report, lab_quiz, class_marks_lab, class_marks_project, supervisor, presentation_marks_project, presentation_marks_project_by, experiment_marks_lab, experiment_marks_lab_by } = x[`${c.course_code}`];
                let cnt = 0;
                // i wass working here
                const subObj = {}
                subObj.course_code = c.course_code;
                subObj.credit = c.credit;
                if (c.type === 'theory') {
                    let sum = 0;
                    if (ct1 || ct1 == 0) {
                        sum += parseInt(ct1);
                        cnt++;
                    }
                    if (ct2 || ct2 == 0) {
                        sum += parseInt(ct2);
                        cnt++;
                    }
                    if (ct3 || ct3 == 0) {
                        sum += parseInt(ct3);
                        cnt++;
                    }
                    let avg = 0;
                    cnt && (avg = sum / cnt);
                    let thirtyPercent;
                    attendance && (thirtyPercent = Math.round((avg + parseInt(attendance))));
                    (!final_marks) && (final_marks = 0);
                    (!thirtyPercent) && (thirtyPercent = 0);
                    subObj.thirtyPercent = thirtyPercent;
                    let total_marks = 0;
                    ((final_marks || final_marks == 0) && (thirtyPercent || thirtyPercent == 0)) && (total_marks = parseInt(thirtyPercent) + parseInt(final_marks));
                    subObj.final_marks = final_marks;
                    subObj.total_marks = total_marks;
                    if (total_marks > 40) {
                        credit_earned += c.credit;
                    }

                }
                //lab , sessional
                else if (c.type === 'lab') {
                    let total_marks = 0;
                    (!class_marks_lab) && (class_marks_lab = 0);
                    (!experiment_marks_lab) && (experiment_marks_lab = 0);
                    subObj.class_marks_lab = class_marks_lab;
                    subObj.experiment_marks_lab = experiment_marks_lab;
                    //subObj.experiment_marks_lab_by = experiment_marks_lab_by;
                    ((class_marks_lab || class_marks_lab == 0) && (experiment_marks_lab || experiment_marks_lab == 0)) && (total_marks = parseInt(class_marks_lab) + parseInt(experiment_marks_lab));
                    subObj.total_marks = total_marks;
                    if (total_marks > 40) {
                        credit_earned += c.credit;
                    }

                }
                //project
                else if (c.type === 'project') {
                    let total_marks = 0;
                    (!class_marks_project) && (class_marks_project = 0);
                    (!presentation_marks_project) && (presentation_marks_project = 0);
                    subObj.supervisor = supervisor;
                    subObj.class_marks_project = class_marks_project;
                    subObj.presentation_marks_project = presentation_marks_project;
                    // subObj.presentation_marks_project_by = presentation_marks_project_by;
                    ((class_marks_project || class_marks_project == 0) && (presentation_marks_project || presentation_marks_project == 0)) && (total_marks = parseInt(class_marks_project) + parseInt(presentation_marks_project));
                    subObj.total_marks = total_marks;
                    if (total_marks > 40) {
                        credit_earned += c.credit;
                    }
                }
                //console.log(` ${x.s_id} ${c.course_code} `, subObj)
                // }
                //array.push(subObj)
                obj[`${c.course_code}`] = subObj;
            })
            if (credit_earned < 2) {
                dropped.push(x?.s_id);
            }
            // else {
            console.log(' x.semester_code ', semester?.semester_code)
            //type ! = backlog hole,,,,,,,
            student.semester_code = parseInt(semester?.semester_code) + 1;
            student.marks = obj;
            students.push(student);
            // }
        })
        console.log('students ', students);

        fetch(`http://localhost:5000/publish-result-object`, {
            method: 'put',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(students)
        })
            .then(res => res.json())
            .then(data => {
                console.log("data ==", data);
                if (data.nModified) {
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully updated Result'
                    })
                }
            });

    }

    // console.log('course ', course)
    // console.log('semmeester = ', semester);
    // console.log('credit = ', credit);

    return (
        <div className='px-2 py-4 my-3 shadow-lg w-75 mx-auto rounded'>
            {/* <h3 className='text-center' >Results</h3> */}
            <div className=' my-3 px-3 '>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-1 w-100 mx-auto">
                        <Form.Label className='text-primary'>Select a Course:</Form.Label>
                        <br></br>
                        <Form.Select onChange={(e) => {
                            //console.log("course changing", e.target.value);
                            // setCourseCode(e.target.value);

                            onSubmit(e.target.value);
                        }}>
                            {
                                courses?.map(c => <option key={c.course_code} value={c.course_code} label={c?.course_title}>{c.course_title} ({c.course_code})</option>
                                )
                            }
                        </Form.Select>
                    </Form.Group>
                    {/* <div className='text-center'>
                        <input type="submit" value='Search Marks' />
                    </div> */}
                </Form>
            </div>

            <div >
                <div>
                    <SemesterChairmanModal
                        course={course} courseName={semesterAllMarks[`${courseCode}_title`]} courseCode={courseCode} credit={semesterAllMarks[`${courseCode}_credit`]} semesterAllMarks={semesterAllMarks} showModal={showModal} setShowModal={setShowModal}
                    />
                </div>
                <div>
                    {
                        courseCode &&
                        semesterAllMarks[`${courseCode}_type`] === 'theory'
                        &&
                        <div className='container'>
                            <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                <div className='p-4 '>
                                    <div className='mb-5'>
                                        <h3 className='text-center mb-5' >Result</h3>
                                        <p><span className='fw-bold'>Course Name: </span>{semesterAllMarks[`${courseCode}_title`]}</p>
                                        <p><span className='fw-bold'>Course Code: </span>{courseCode}</p>
                                        <p><span className='fw-bold'>Credit Hour: </span>{semesterAllMarks[`${courseCode}_credit`]}</p>
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
                                                course.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                    <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.s_id}</td>
                                                    <td style={{ border: "1px solid black" }}>{x?.displayName}</td>
                                                    <td style={{ border: "1px solid black" }}>{x?.thirtyPercent}</td>
                                                    <td style={{ border: "1px solid black" }}>{x?.course_teacher_marks}</td>
                                                    <td style={{ border: "1px solid black" }}>{x?.second_examiner_marks}</td>
                                                    <td style={{ border: "1px solid black" }}>{x?.third_examiner_marks}</td>
                                                    <td style={{ border: "1px solid black" }}>{x?.final_marks}</td>
                                                    <td style={{ border: "1px solid black" }}>{x?.total_marks}</td>
                                                </tr>)
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        courseCode &&
                        semesterAllMarks[`${courseCode}_type`] === 'lab'
                        &&
                        <div className='container'>
                            <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                <div className='p-4 '>
                                    <div className='mb-5'>
                                        <h3 className='text-center mb-5' >Result</h3>
                                        <p><span className='fw-bold'>Course Name: </span>{semesterAllMarks[`${courseCode}_title`]}</p>
                                        <p><span className='fw-bold'>Course Code: </span>{courseCode}</p>
                                        <p><span className='fw-bold'>Credit Hour: </span>{semesterAllMarks[`${courseCode}_credit`]}</p>
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
                                                course.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                    <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.s_id}</td>
                                                    <td style={{ border: "1px solid black" }}>{x?.displayName}</td>
                                                    <td style={{ border: "1px solid black" }}>{x?.class_marks_lab}</td>
                                                    <td title={x?.experiment_marks_lab_by} style={{ border: "1px solid black" }}>{x?.experiment_marks_lab}</td>
                                                </tr>)
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        courseCode &&
                        semesterAllMarks[`${courseCode}_type`] === 'project'
                        &&
                        <div className='container'>
                            <div className='container-fluid shadow-lg rounded  my-5 ' >
                                <div className='p-4 '>
                                    <div className='mb-5'>
                                        <h3 className='text-center mb-5' >Result</h3>
                                        <p><span className='fw-bold'>Course Name: </span>{semesterAllMarks[`${courseCode}_title`]}</p>
                                        <p><span className='fw-bold'>Course Code: </span>{courseCode}</p>
                                        <p><span className='fw-bold'>Credit Hour: </span>{semesterAllMarks[`${courseCode}_credit`]}</p>
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
                                                course.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                    <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.s_id}</td>
                                                    <td style={{ border: "1px solid black" }}>{x?.displayName}</td>
                                                    <td title={`By ${x?.class_marks_project_by}`} style={{ border: "1px solid black" }}>{x?.class_marks_project}</td>
                                                    <td title={x?.presentation_marks_project_by} style={{ border: "1px solid black" }}>{x?.presentation_marks_project}</td>
                                                </tr>)
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                            </div>
                        </div>

                    }

                </div>
            </div>
            <div className='text-center'>
                <Button variant='success' className='me-2' onClick={() => setShowModal(true)}> Generate PDF</Button>
                <Button onClick={() => { handleResult() }} variant='primary'>Publish Result</Button>
                <Link className='ms-2' to={`${url}/result-sheet`}>
                    <Button onClick={() => { }} variant='danger'>Generate Result Sheet</Button>
                </Link>

            </div>

        </div>
    );
};

export default SemesterChairman;