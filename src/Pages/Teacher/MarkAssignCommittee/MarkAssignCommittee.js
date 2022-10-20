import React, { useEffect, useState } from 'react';
import { Button, Form, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import './MarkAssignCommittee.css';
import MarkAssignCommitteeModal from './MarkAssignCommitteeModal';

const MarkAssignCommittee = () => {
    const { semesterId } = useParams();
    const [semester, setSemester] = useState({});
    const [semesterAllMarks, setSemesterAllMarks] = useState({});
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState([]);
    const [courseCodeChanging, setCourseCodeChanging] = useState(false);
    const [courseCode, setCourseCode] = useState('');
    const [courseName, setCourseName] = useState('');
    const [credit, setCredit] = useState();
    const [showModal, setShowModal] = useState(false);
    const [editExperimentMarks, setEditExperimentMarks] = useState(false);
    const [editPresentationMarks, setEditPresentationMarks] = useState(false);
    //const [courseCode]
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
    useEffect(() => {
        // setSemester({});
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
                    console.log('setting semester again')
                    setSemester(data);
                }

            })
    }, [semesterId, email, courseCodeChanging]);

    useEffect(() => {
        console.log('semester ', semester);
        if (semester && Object.keys(semester).length !== 0) {
            const allMarks = {};
            console.log("Semester value ", semester)
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
                    const { ct1, ct2, ct3, attendance, course_teacher_marks, second_examiner_marks, third_examiner_marks, final_marks, lab_attendance, lab_report, lab_quiz, class_marks_lab, class_marks_project, presentation_marks_project, presentation_marks_project_by, experiment_marks_lab_by, experiment_marks_lab } = student[`${x.course_code}`];
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
                        // console.log('average ', avg);
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
                        subObj.presentation_marks_project = presentation_marks_project;
                        subObj.presentation_marks_project_by = presentation_marks_project_by;
                    }

                    subObj.displayName = student?.displayName;
                    subObj.s_id = student?.s_id;

                    //console.log(subObj);
                    arr.push(subObj);
                })
                //console.log('arr ', arr);
                //const obj
                allMarks[`${x.course_code}_title`] = x.course_title;
                allMarks[`${x.course_code}_marks`] = arr;
                allMarks[`${x.course_code}_type`] = x.type;
            })
            //console.log('allMarks ', allMarks);
            setSemesterAllMarks(allMarks);
            setCourses(coursesArray);
            //set first course as selected course before chosing any code
            if (courseCode == '') {
                setCourseCode(coursesArray[0]['course_code'])
                setCourseName(coursesArray[0]['course_title'])
                setCourse(allMarks[`${coursesArray[0].course_code}_marks`]);
            }
            //console.log('coursesArray ', coursesArray)
            //console.log('allMarks ', allMarks);
        }
    }, [semester]);
    //console.log("semesterAllMarks ", semesterAllMarks);

    //search clicked
    const onSubmit = (v) => {
        // setCourseCodeChanging(!courseCodeChanging);
        setEditExperimentMarks(false);
        setEditPresentationMarks(false);
        console.log(' on submit data == ', v);
        courses?.map(c => {
            if (c.course_code === v) {
                setCourseName(c.course_title)
                setCredit(c.credit);
            }
        })
        // const val = data.course_code;
        console.log("val ", v);
        setCourseCode(v);
        const marksOfSelectedCourse = semesterAllMarks[`${v}_marks`];
        console.log('marksOfSelectedCourse ', marksOfSelectedCourse)
        setCourse(marksOfSelectedCourse);
    }
    const onSubmitPresentationMarks = data => {
        // setEditPresentationMarks(false);
        console.log('onSubmitPresentationMarks  ', data);
        fetch(`http://localhost:5000/add-marks/exam-committee/${semesterId}/${courseCode}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log("data ==", data);
                //setCourseCodeChanging(!courseCodeChanging);
                //setCourseCode(data?.course_code);
                if (data.modifiedCount) {
                    setCourseCodeChanging(!courseCodeChanging);
                    //setEditPresentationMarks(false);
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully updated marks'
                    })
                    //history.push('/dashboard/courses-taken')
                }
                else if (data.matchedCount === 1) {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Give some data then click assign'
                    })
                    //history.push('/dashboard/courses-taken')
                }
            });

    }
    const onSubmitLabMarks = data => {
        //setCourseCodeChanging(!courseCodeChanging);
        //setEditExperimentMarks(false);
        console.log('onSubmitLabMarks  ', data);
        fetch(`http://localhost:5000/add-marks/exam-committee/${semesterId}/${courseCode}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log("data ==", data);
                if (data.modifiedCount) {
                    setCourseCodeChanging(!courseCodeChanging);
                    //setEditExperimentMarks(false);
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully updated marks'
                    })
                    //history.push('/dashboard/courses-taken')
                }
                else if (data.matchedCount === 1) {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Give some data then click assign'
                    })
                    //history.push('/dashboard/courses-taken')
                }
            });
    }

    console.log('course ', course)
    console.log("semistry = ", semester);
    return (
        <div className='px-2 py-4 shadow-lg w-75 mx-auto rounded'>
            {/* <h3 className='text-center' >Results</h3> */}
            <div className=' my-4'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-1 w-100 mx-auto">
                        <Form.Label className='text-primary'>Select a Course:</Form.Label>
                        <br></br>
                        <Form.Select
                            // {...register("course_code", { required: true })}
                            onChange={(e) => {
                                console.log("course changing", e.target.value);
                                // setCourseCode(e.target.value);
                                onSubmit(e.target.value);
                            }}
                        >
                            {
                                courses?.map(c => <option key={c.course_code} value={c.course_code}>{c.course_title} ({c.course_code})</option>
                                )
                            }
                        </Form.Select>
                    </Form.Group>
                    {/* <div className='text-center'>
                        <input type="submit" value='Search Marks' />
                    </div> */}
                </Form>
            </div>

            <div>
                <div>
                    <MarkAssignCommitteeModal
                        course={course} courseName={courseName} courseCode={courseCode} credit={credit} semesterAllMarks={semesterAllMarks} showModal={showModal} setShowModal={setShowModal}
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
                                        <p><span className='fw-bold'>Course Name: </span>{courseName}</p>
                                        <p><span className='fw-bold'>Course Code: </span>{courseCode}</p>
                                        <p><span className='fw-bold'>Credit Hour: </span>{credit}</p>
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
                                <div className='text-center my-4'>
                                    <Button variant='success' className='me-2 mb-5' onClick={() => setShowModal(true)}> Generate PDF</Button>
                                    {/* <input as Button variant='primary' type="submit" value='Save' className='btn btn-primary' /> */}
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
                                        <p><span className='fw-bold'>Course Name: </span>{courseName}</p>
                                        <p><span className='fw-bold'>Course Code: </span>{courseCode}</p>
                                        <p><span className='fw-bold'>Credit Hour: </span>{credit}</p>
                                    </div>
                                    <Form onSubmit={handleSubmit(onSubmitLabMarks)}>
                                        <Table responsive striped bordered hover className='text-center' style={{ border: '1px solid black' }}>
                                            <thead>
                                                <tr style={{ border: '1px solid black' }}>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Marks (60%)</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Experiment Marks (40%)
                                                        <br />
                                                        <span className='edit' onClick={() => { setEditExperimentMarks(true) }}>Edit</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {
                                                    course.map(x => <tr key={`${x?.s_id}_${courseCode}`} style={{ border: '1px solid black' }}>
                                                        <td style={{ border: '1px solid black' }}>
                                                            <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.s_id}
                                                                {...register(`${x?.s_id}_id`, { required: true })}
                                                                readOnly />
                                                        </td>
                                                        <td style={{ border: '1px solid black' }}>{x?.displayName}</td>
                                                        <td style={{ border: '1px solid black' }}>{x?.class_marks_lab}</td>
                                                        <td style={{ border: '1px solid black' }}>
                                                            {/* {x?.experiment_marks_lab} */}
                                                            {/* {
                                                editExperimentMarks
                                                    ?
                                                    <>
                                                        <input type='number' className=' w-50 text-center' defaultValue={x?.experiment_marks_lab}
                                                            {...register(`${x?.s_id}_experiment_marks_lab`)}
                                                        />
                                                        <input type='text' hidden className=' w-50 text-center'
                                                            value={displayName}
                                                            {...register(`${x?.s_id}_experiment_marks_lab_by`)}
                                                        />
                                                    </>
                                                    :
                                                    <p title={`By ${x?.experiment_marks_lab_by}`} >{x?.experiment_marks_lab}</p>
                                            } */}
                                                            {/* {
                                                editExperimentMarks
                                                    ? */}
                                                            <div className={!editExperimentMarks ? 'd-none' : ''}>
                                                                <input type='number' className=' w-50 text-center' defaultValue={x?.experiment_marks_lab}
                                                                    {...register(`${x?.s_id}_${courseCode}_experiment_marks_lab`)}
                                                                />
                                                                <input type='text' hidden className=' w-50 text-center'
                                                                    value={displayName}
                                                                    {...register(`${x?.s_id}_${courseCode}_experiment_marks_lab_by`)}
                                                                />
                                                            </div>
                                                            {/* : */}
                                                            <p className={editExperimentMarks ? 'd-none' : ''} title={`By ${x?.experiment_marks_lab_by}`} >{x?.experiment_marks_lab}</p>
                                                            {/* } */}
                                                        </td>
                                                    </tr>)
                                                }

                                            </tbody>
                                        </Table>
                                        <div className='text-center my-4'>
                                            <Button variant='success' className='me-2' onClick={() => setShowModal(true)}> Generate PDF</Button>
                                            <input as Button variant='primary' type="submit" value='Save' className='btn btn-primary' />
                                        </div>
                                    </Form>
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
                                        <p><span className='fw-bold'>Course Name: </span>{courseName}</p>
                                        <p><span className='fw-bold'>Course Code: </span>{courseCode}</p>
                                        <p><span className='fw-bold'>Credit Hour: </span>{credit}</p>
                                    </div>
                                    <Form onSubmit={handleSubmit(onSubmitPresentationMarks)}>
                                        <Table responsive bordered hover className='text-center' style={{ border: '1px solid black' }}>
                                            <thead>
                                                <tr style={{ border: '1px solid black' }}>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Performance (70%)</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Presentation and Viva (30%)
                                                        <br />
                                                        <span className='edit' onClick={() => { setEditPresentationMarks(true) }}>Edit</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {
                                                    course.map(x => <tr key={x?.s_id}>
                                                        <td style={{ border: '1px solid black' }}>
                                                            <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.s_id}
                                                                {...register(`${x?.s_id}_id`, { required: true })}
                                                                readOnly />
                                                        </td>
                                                        <td style={{ border: '1px solid black' }}>{x?.displayName}</td>
                                                        <td style={{ border: '1px solid black' }}>{x?.class_marks_project}</td>
                                                        <td style={{ border: '1px solid black' }}>
                                                            {/* {
                                                editPresentationMarks
                                                    ?
                                                    <>
                                                        <input type='number' className=' w-50 text-center' defaultValue={x?.presentation_marks_project}
                                                            {...register(`${x?.s_id}_presentation_marks_project`)}
                                                        />
                                                        <input type='text' hidden className=' w-50 text-center'
                                                            value={displayName}
                                                            {...register(`${x?.s_id}_presentation_marks_project_by`)}
                                                        />
                                                    </>
                                                    :
                                                    <p  title={`By ${x?.presentation_marks_project_by}`} >{x?.presentation_marks_project}</p>
                                            } */}
                                                            {/* {
                                                editPresentationMarks
                                                    ? */}
                                                            <div className={!editPresentationMarks ? 'd-none' : ''} >
                                                                <input type='number' className=' w-50 text-center' defaultValue={x?.presentation_marks_project}
                                                                    {...register(`${x?.s_id}_${courseCode}_presentation_marks_project`)}
                                                                />
                                                                <input type='text' hidden className=' w-50 text-center'
                                                                    value={displayName}
                                                                    {...register(`${x?.s_id}_${courseCode}_presentation_marks_project_by`)}
                                                                />
                                                            </div>
                                                            {/* : */}
                                                            <p className={editPresentationMarks ? 'd-none' : ''} title={`By ${x?.presentation_marks_project_by}`} >{x?.presentation_marks_project}</p>
                                                            {/* } */}
                                                        </td>
                                                    </tr>)
                                                }
                                            </tbody>
                                        </Table>
                                        <div className='text-center my-4'>
                                            <Button variant='success' className='me-2' onClick={() => setShowModal(true)}> Generate PDF</Button>
                                            <input as Button variant='primary' type="submit" value='Save' className='btn btn-primary' />
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </div>

                    }
                </div>
            </div>

        </div >
    );
};

export default MarkAssignCommittee;