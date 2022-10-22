import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import checkSemesterName from '../../../Functions/SemesterCodeToSemesterName';
import useAuth from '../../../Hooks/useAuth';
import CourseTeacherMap from './CourseTeacherMap';


const CreateSemester = () => {
    const [semester, setSemester] = useState(0);
    const [teachers, setTeachers] = useState([]);
    const [currentCourses, setCurrentCourses] = useState([]);
    const [optionSelected, setOptionSelected] = useState(null);
    const [teacherList, setTeacherList] = useState([]);
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();
    const { user } = useAuth();
    const department = user?.department;
    const email = user?.email;
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
    const [teachersOption, setTeachersOption] = useState([]);
    useEffect(() => {
        const arrOfTeachers = []
        teachers?.map(x => {
            const obj = {}
            obj.label = x?.displayName;
            obj.value = x?.email;
            arrOfTeachers.push(obj);
        })
        setTeachersOption(arrOfTeachers)
        console.log('arrOfTeachers ==', arrOfTeachers)
    }, [teachers])
    //console.log("register ", register);
    //const department = 'cse';
    //console.log(" semester ", semester)
    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/user/teacher?fields=${department}`)
            .then(res => res.json())
            .then(info => {
                console.log("teachers of current user's department ", info.data);
                setTeachers(info.data);
            })
    }, [])
    useEffect(() => {
        if (semester != '') {
            fetch(`http://localhost:5000/api/v1/course/${semester}`)
                .then(res => res.json())
                .then(info => {
                    console.log("courses of selected semester ", info.data);
                    setCurrentCourses(info.data);
                })
        }
    }, [semester])

    const onSubmit = data => {
        // if (data)

        data.name = checkSemesterName(data?.semesterCode);
        console.log("on Submit Data ", data);
        const l = "CSE2107"
        console.log("on Submit Data ", data[`${department}${data.semesterCode}_courseTitle`][l]);
        let semester = {
            session: data.session,
            semesterCode: parseInt(data.semester),
            isRunning: true
        }
        // const courses = {};
        // for (const key in data[`${department}${data.semester}`]) {
        //     courses[key] = { teacher: data[`${department}${data.semester}`][key] };
        // }
        const courses = []
        //for (const key in data[`${department}${data.semester}_course_teacher`]) {
        // for (const key in currentCourses?.course_code) {
        currentCourses?.map(x => {
            const key = x?.courseCode;
            console.log(key);
            const obj = {};
            obj.courseCode = key;
            obj.courseTitle = data[`${department}${data.semesterCode}_courseTitle`][key];
            obj.credit = parseFloat(data[`${department}${data.semesterCode}_course_credit`][key]);
            obj.type = data[`${department}${data.semesterCode}_course_type`][key];
            obj.teacher = data[`${department}${data.semesterCode}_course_teacher`][key];
            obj.secondExaminer = data[`${department}${data.semesterCode}_second_examiner`][key];
            obj.thirdExaminer = data[`${department}${data.semesterCode}_third_examiner`][key];
            if (data[`${department}${data.semesterCode}_course_type`][key] == 'project') {
                obj.teacher_student = [];
                obj.course_teacher = [];
                teacherList.map(x => {
                    const supervisor = {}
                    supervisor[`${x.value}`] = [];
                    obj.teacher_student.push(supervisor);
                    obj.course_teacher.push(x?.value);
                })
            }
            //console.log('obj ', obj);
            courses.push(obj)
        })
        console.log('courses ', courses)
        semester = { ...semester, courses: courses }
        semester.department = department;
        semester.degree = data.degree;
        semester.chairman = data.chairman;
        semester.member1 = data.member1;
        semester.member2 = data.member2;

        console.log("semesters to push ", semester);
        console.log(" teacher List ", teacherList)
        // fetch('http://localhost:5000/create-semester', {
        //     method: 'put',
        //     headers: {
        //         'content-type': 'application/json'
        //     },
        //     body: JSON.stringify(semester)
        // })
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log("data ", data);
        //         if (data?.code === "200") {
        //             Toast.fire({
        //                 icon: 'error',
        //                 title: data?.message
        //             })
        //         }
        //         else {
        //             if (data.modifiedCount) {
        //                 Toast.fire({
        //                     icon: 'success',
        //                     title: 'Successfully updated Semester'
        //                 })
        //                 // reset();
        //             }
        //             else if (data.upsertedCount) {
        //                 Toast.fire({
        //                     icon: 'success',
        //                     title: 'Successfully added Semester'
        //                 })
        //                 // reset();
        //             }
        //             else if (data.matchedCount) {
        //                 Toast.fire({
        //                     icon: 'warning',
        //                     title: 'This semester already exists!'
        //                 })
        //             }
        //         }


        //     });
    }

    const visibile = {
        visibility: 'visible'
    }
    const invisibile = {
        visibility: 'hidden'
    }

    return (
        <div className='container-fluid shadow-lg w-75 my-5 py-2'>

            <h4 className='text-center py-4'>Create Semester</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className="mb-1 w-100 mx-auto">
                    <Form.Label className='text-primary'>Semester Name:</Form.Label>
                    <br></br>
                    <Form.Select {...register("semesterCode", { required: true })} onChange={(e) => {
                        setSemester(e.target.value)
                        console.log("semester changing");
                    }}>
                        <option value="">Select the semester</option>
                        <option value="1">1st Year 1st Semester</option>
                        <option value="2">1st Year 2nd Semester</option>
                        <option value="3">2nd Year 1st Semester</option>
                        <option value="4">2nd Year 2nd Semester</option>
                        <option value="5">3rd Year 1st Semester</option>
                        <option value="6">3rd Year 2nd Semester</option>
                        <option value="7">4th Year 1st Semester</option>
                        <option value="8">4th Year 2nd Semester</option>
                    </Form.Select>
                    <span style={errors.semester ? visibile : invisibile} className='text-danger ps-2 ' >* Chose Semester</span>
                </Form.Group>
                <Form.Group className="mb-1 w-100 mx-auto">
                    <Form.Label className='text-primary'>Session:</Form.Label>
                    <br></br>
                    <Form.Select {...register("session", { required: true })}>
                        <option value="">Select the session</option>
                        <option value="2015-16">2015-16</option>
                        <option value="2016-17">2016-17</option>
                        <option value="2017-18">2017-18</option>
                        <option value="2018-19">2018-19</option>
                        <option value="2019-20">2019-20</option>
                        <option value="2020-21">2020-21</option>
                        <option value="2021-22">2021-22</option>
                    </Form.Select>
                    <span style={errors.session ? visibile : invisibile} className='text-danger ps-2' >* Chose Session</span>
                </Form.Group>
                <Form.Group className="mb-1 w-100 mx-auto">
                    <Form.Label className='text-primary'>Degree: </Form.Label>
                    <br></br>
                    <Form.Select {...register("degree", { required: true })}>
                        <option value="">Select the type</option>
                        <option value="bsc-engg">Bachelor of Science (Engg.)</option>
                        <option value="bsc-hons">Bachelor of Science (Hons.)</option>
                        <option value="bba">Bachelor of Business Administration</option>
                        <option value="b-pharm">Bachelor of Pharmacy</option>
                        <option value="msc">Master of Science</option>
                        <option value="msc-engg">Master of Science (Engg.)</option>
                        <option value="m-engg">Master of Engineering</option>
                        <option value="m-pharm">Master of Science (Pharmacy)</option>
                    </Form.Select>
                    <span style={errors.session ? visibile : invisibile} className='text-danger ps-2' >* Chose Degree</span>
                </Form.Group>

                <Form.Group className="mb-1 w-100 mx-auto">
                    <Form.Label className='text-primary'>Chairman of exam comittee :</Form.Label>
                    <br></br>
                    <Form.Select {...register("chairman", { required: true })}>
                        <option value="">Select Chairman for Exam Comitte</option>
                        {
                            teachers.map(x => {
                                return (<option value={x?.profile?.['_id']}>
                                    {
                                        x?.profile?.['firstName']
                                            ?
                                            x?.profile?.['firstName'] + ' ' + x?.profile?.['lastName'] + '    (' + x.department + ')'
                                            :
                                            x?.email + '    (' + x.department + ')'
                                    }
                                </option>)
                            })
                        }
                    </Form.Select>
                    <span style={errors.chairman ? visibile : invisibile} className='text-danger ps-2' >* Chose Chairman</span>
                </Form.Group>
                <Form.Group className="mb-1 w-100 mx-auto">
                    <Form.Label className='text-primary'>Member of exam Comittee:</Form.Label>
                    <br></br>
                    <Form.Select {...register("member1", { required: true })}>
                        <option value="">Select Member for Exam Comitte</option>
                        {
                            teachers.map(x => {
                                return (<option value={x?.profile?.['_id']}>
                                    {
                                        x?.profile?.['firstName']
                                            ?
                                            x?.profile?.['firstName'] + ' ' + x?.profile?.['lastName'] + '    (' + x.department + ')'
                                            :
                                            x?.email + '    (' + x.department + ')'
                                    }
                                </option>)
                            })
                        }
                    </Form.Select>
                    <span style={errors.member1 ? visibile : invisibile} className='text-danger ps-2' >* Chose member</span>
                </Form.Group>
                <Form.Group className="mb-1 w-100 mx-auto">
                    <Form.Label className='text-primary'>Member of exam Comittee:</Form.Label>
                    <br></br>
                    <Form.Select {...register("member2", { required: true })}>
                        <option value="">Select Member for Exam Comitte</option>
                        {
                            teachers.map(x => {
                                return (<option value={x?.profile?.['_id']}>
                                    {
                                        x?.profile?.['firstName']
                                            ?
                                            x?.profile?.['firstName'] + ' ' + x?.profile?.['lastName'] + '    (' + x.department + ')'
                                            :
                                            x?.email + '    (' + x.department + ')'
                                    }
                                </option>)
                            })
                        }
                    </Form.Select>
                    <span style={errors.member2 ? visibile : invisibile} className='text-danger ps-2' >* Chose Memeber</span>
                </Form.Group>


                <Table responsive striped bordered hover style={{ border: '1px solid black' }}>
                    <col width="10%" />
                    <col width="20%" />
                    <col width="8%" />
                    <col width="5%" />
                    <col width="12%" />
                    <col width="12%" />
                    <col width="12%" />
                    <thead>
                        <tr style={{ border: '1px solid black' }}>
                            <th style={{ border: '1px solid black' }}>Course Code</th>
                            <th style={{ border: '1px solid black' }}>Course Title</th>
                            <th style={{ border: '1px solid black' }}>Type</th>
                            <th style={{ border: '1px solid black' }}>Credit</th>
                            <th style={{ border: '1px solid black' }}>Course Teacher</th>
                            <th style={{ border: '1px solid black' }}>Second Examiner</th>
                            <th style={{ border: '1px solid black' }}>Third Examiner</th>
                        </tr>
                    </thead>
                    <tbody>

                        {
                            currentCourses.map(x => <CourseTeacherMap key={x.courseCode} course={x} teachers={teachers} register={register} errors={errors}
                                optionSelected={optionSelected}
                                setOptionSelected={setOptionSelected}
                                setTeacherList={setTeacherList}
                                teachersOption={teachersOption}
                            ></CourseTeacherMap>)
                        }

                    </tbody>
                </Table>


                <div className='text-center'>
                    <input type="submit" value='Add Semester' className='btn btn-primary my-3' />
                </div>
            </Form>


        </div>
    );
};

export default CreateSemester;
