import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import { components } from "react-select";
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
            // console.log(x)
            const obj = {}
            obj.label = x?.profile?.['firstName'] + ' ' + x?.profile?.['lastName'] + '    (' + x.department + ')'
            obj.value = x?.profile?._id;
            arrOfTeachers.push(obj);
        })
        setTeachersOption(arrOfTeachers)
        // console.log('arrOfTeachers ==', arrOfTeachers)
    }, [teachers])
    //console.log("register ", register);
    //const department = 'cse';
    //console.log(" semester ", semester)
    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/user/teacher?fields=${department}`)
            .then(res => res.json())
            .then(info => {
                // console.log("teachers of current user's department ", info.data);
                setTeachers(info.data);
            })
    }, [])
    useEffect(() => {
        if (semester != '') {
            fetch(`http://localhost:5000/api/v1/course/${semester}`)
                .then(res => res.json())
                .then(info => {
                    // console.log("courses of selected semester ", info.data);
                    setCurrentCourses(info.data);
                })
        }
    }, [semester])

    const onSubmit = data => {
        data.name = checkSemesterName(data?.semesterCode);
        console.log("on Submit Data ", data);

        let semester = {
            session: data.session,
            semesterCode: parseInt(data.semesterCode),
            name: data.name,
            isRunning: true
        }
        const courses = []
        currentCourses?.map(x => {
            const key = x?.courseCode;
            const obj = {};
            obj.courseCode = key;
            obj.courseTitle = data[`${department}${data.semesterCode}_courseTitle`][key];
            obj.credit = parseFloat(data[`${department}${data.semesterCode}_course_credit`][key]);
            obj.type = data[`${department}${data.semesterCode}_course_type`][key];
            //obj.teacher = data[`${department}${data.semesterCode}_course_teacher`][key];
            //obj.secondExaminer = data[`${department}${data.semesterCode}_second_examiner`][key];
            //obj.thirdExaminer = data[`${department}${data.semesterCode}_third_examiner`][key];
            if (data[`${department}${data.semesterCode}_course_type`][key] == 'project') {
                // obj.teacher_student = [];
                // obj.course_teacher = [];
                // teacherList.map(x => {
                //     const supervisor = {}
                //     supervisor[`${x.value}`] = [];
                //     obj.teacher_student.push(supervisor);
                //     obj.course_teacher.push(x?.value);
                // })
                const arrayOfProjectTeacher = optionSelected?.map(x => {
                    return x.value;
                })
                obj.teacherList = arrayOfProjectTeacher;
            }
            else if (data[`${department}${data.semesterCode}_course_type`][key] == 'theory') {
                const courseTeacherValues = data[`${department}${data.semesterCode}_course_teacher`][key].split("=/=")
                const secondExaminerValues = data[`${department}${data.semesterCode}_second_examiner`][key].split("=/=")
                const thirdExaminerValues = data[`${department}${data.semesterCode}_third_examiner`][key].split("=/=")
                obj.teacher = { name: courseTeacherValues[1], teacherProfileId: courseTeacherValues[0] }
                obj.secondExaminer = { name: secondExaminerValues[1], teacherProfileId: secondExaminerValues[0] }
                obj.thirdExaminer = { name: thirdExaminerValues[1], teacherProfileId: thirdExaminerValues[0] }
            }
            else if (data[`${department}${data.semesterCode}_course_type`][key] == 'lab') {
                const courseTeacherValues = data[`${department}${data.semesterCode}_course_teacher`][key].split("=/=")
                // const secondExaminerValues = data[`${department}${data.semesterCode}_second_examiner`][key].split("=/=")
                // const thirdExaminerValues = data[`${department}${data.semesterCode}_third_examiner`][key].split("=/=")
                obj.teacher = { name: courseTeacherValues[1], teacherProfileId: courseTeacherValues[0] }
                // obj.secondExaminer = { name: secondExaminerValues[1], teacherProfileId: secondExaminerValues[0] }
                // obj.thirdExaminer = { name: thirdExaminerValues[1], teacherProfileId: thirdExaminerValues[0] }
            }
            courses.push(obj)
        })

        // console.log('courses ', courses)
        semester = { ...semester, courses: courses }
        semester.department = department;
        semester.degree = data.degree;
        semester.examCommitteeChairman = data.chairman;
        // semester.member1 = data.member1;
        // semester.member2 = data.member2;
        semester.examCommittee = [data.member1, data.member2]

        console.log("semesters to push ", semester);
        // console.log(" teacher List ", teacherList)
        fetch('http://localhost:5000/api/v1/semester', {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(semester)
        })
            .then(res => res.json())
            .then(info => {
                console.log("data ", info);
                Toast.fire({
                    icon: info.status,
                    title: info.message
                })
            });
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
                                return (<option key={x?.profile?.['_id']} value={x?.profile?.['_id']}>
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
                                return (<option key={x?.profile?.['_id']} value={x?.profile?.['_id']}>
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
                                return (<option key={x?.profile?.['_id']} value={x?.profile?.['_id']}>
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



                {
                    currentCourses.length != 0
                    &&
                    <div>
                        <Table className='py-5' striped bordered hover style={{ border: '1px solid black' }}>
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
                    </div>

                }



                <div className='text-center'>
                    <input type="submit" value='Add Semester' className='btn btn-primary my-3' />
                </div>
            </Form>


        </div>
    );
};

const Option = (props) => {
    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />{" "}
                <label>{props.label}</label>
            </components.Option>
        </div>
    );
};
export default CreateSemester;
