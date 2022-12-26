import React, { useEffect, useState } from 'react';
import { ListGroup, Offcanvas } from 'react-bootstrap';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import StudentRoute from '../../LogIn/LogIn/StudentRoute/StudentRoute';
import TeacherRoute from '../../LogIn/LogIn/TeacherRoute/TeacherRoute';
import DashboardHome from '../DashboardHome/DashboardHome';
import TakenCourses from '../../Teacher/CoursesTaken/CoursesTaken';
import DeptChairmanRoute from '../../LogIn/LogIn/DeptChairmanRoute/DeptChairmanRoute';
import CreateSemester from '../../DeptChairman/CreateSemster/CreateSemester';
import AddTeacher from '../../DeptChairman/AddTeacher/AddTeacher';
import CourseTeacher from '../../Teacher/CourseTeacher/CourseTeacher';
import DashboardNavigationBar from '../DashboardNaviagtionBar/DashboardNavigationBar';
import SecondExaminer from '../../Teacher/SecondExaminer/SecondExaminer';
import ThirdExaminer from '../../Teacher/ThirdExaminer/ThirdExaminer';
import CreateCourse from '../../DeptChairman/CreateCourse/CreateCourse';
import ExamCommittee from '../../Teacher/ExamCommittee/ExamCommittee';
import ApplyToSupervisor from '../../Students/ApplyToSupervisor/ApplyToSupervisor';
import Projects from '../../Students/Projects/Projects';
import Updateprofile from '../UpdateProfile/Updateprofile';
import ExamCommitteeChairman from '../../Teacher/ExamCommitteeChairman/ExamCommitteeChairman';
import MarksSheet from '../../Teacher/ExamCommitteeChairman/MarksSheet/MarksSheet';
import ResultSheet from '../../Teacher/ExamCommitteeChairman/ResultSheet/ResultSheet';
import MarksAssign from '../../Teacher/ExamCommittee/MarksAssign/MarksAssign';
import HallProvostRoute from '../../LogIn/LogIn/HallProvostRoute/HallProvostRoute';
import CourseRegistrationForm from '../../Students/CourseRegistrationForm/CourseRegistrationForm';
import ViewResult from '../../Students/ViewResult/ViewResult';
import HallProvostCourseRegistration from '../../HallProvost/HallProvostCourseRegistration/HallProvostCourseRegistration';
import AcademicCommitteeCourseRegistration from '../../AcademicCommittee/AcademicCommitteeCourseRegistration/AcademicCommitteeCourseRegistration';
import DeptChairmanCourseRegistration from '../../DeptChairman/DeptChairmanCourseRegistration/DeptChairmanCourseRegistration';
import StudentCourseRegistration from '../../Students/StudentCourseRegistration/StudentCourseRegistration';
import DeptChairmanCourseRegistrationDetails from '../../DeptChairman/DeptChairmanCourseRegistration/DeptChairmanCourseRegistrationDetails/DeptChairmanCourseRegistrationDetails';
import HallProvostCourseRegistrationDetails from '../../HallProvost/HallProvostCourseRegistration/HallProvostCourseRegistrationDetails.js/HallProvostCourseRegistrationDetails';
import AcademicCommitteeRoute from '../../LogIn/LogIn/AcadedmicCommitteeRoute/AcademicCommitteeRoute';
import AcademicCommitteeCourseRegistrationDetails from '../../AcademicCommittee/AcademicCommitteeCourseRegistration/AcademicCommitteeCourseRegistrationDetails/AcademicCommitteeCourseRegistrationDetails';
import StudentCourseRegistrationDetails from '../../Students/StudentCourseRegistration/StudentCourseRegistrationDetails/StudentCourseRegistrationDetails';
import SuperAdminRoute from '../../LogIn/LogIn/SuperAdminRoute/SuperAdminRoute';
import AddDeptChairman from '../../SuperAdmin/AddDeptChairman/AddDeptChairman';
import AddHallProvost from '../../SuperAdmin/AddHallProvost/AddHallProvost';
import AddAcademicCommittee from '../../SuperAdmin/AddAcademicCommittee/AddAcademicCommittee';
import CreateHall from '../../SuperAdmin/CreateHall/CreateHall';
import AddStudentToHall from '../../HallProvost/AddStudentToHall/AddStudentToHall';
import RemoveStudentFromHall from '../../HallProvost/RemoveStudentFromHall/RemoveStudentFromHall';
import ChangePassword from '../../LogIn/LogIn/Password/ChangePassword/ChangePassword';
import './Dashboard.css'
import academicCommitteePhoto from "../../../images/academicCommittee.png";
import chairmanPhoto from "../../../images/chairman.png";
import hallProvostPhoto from "../../../images/hallProvost.png";
import teacherPhoto from "../../../images/teacher.png";
import studentPhoto from "../../../images/student.png";
import userPhoto from "../../../images/user.png";

const Dashboard = () => {
    const { user, isLoading, isLoadingRole } = useAuth();
    const [show, setShow] = useState(false);
    let { path, url } = useRouteMatch();
    // console.log('url =', url, student);

    const [profile, setProfile] = useState({});
    const stateChange = () => {
        setShow(true)
    }

    // console.log("path === ", path);

    console.log("useerre === ", user);

    useEffect(() => {
        //console.log('email ', email);
        fetch('http://localhost:5000/api/v1/profile', {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        })
            .then(res => res.json())
            .then(info => {
                setProfile(info?.data)
                // console.log('my-profile === ', info);
                // console.log('email', email);
                // seTakenCourses(data);
            })
    }, [])
    return (
        <>
            {/* <div className='text-center'>
                <h3>This is Dashboard</h3>
            </div> */}
            <DashboardNavigationBar func={stateChange}></DashboardNavigationBar>
            {/* <div className='text-center' >
                <Button onClick={() => { setShow(true) }} >
                    Dashboard Drawer
                </Button>
            </div> */}

            <Offcanvas show={show} onHide={() => { setShow(false) }} variant='dark' >
                <Offcanvas.Header closeButton className='bg-dark mb-0' >
                    {/* <img src={profile?.imageURL ? profile?.imageURL : userPhoto} alt="user_profile" style={{ width: "100px", height: "100px", borderRadius: "50%" }} /> */}
                    {
                        profile?.imageURL
                            ?
                            <img src={profile?.imageURL} alt="user_profile" style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
                            :
                            <>
                                {
                                    user?.isAcademicCommittee
                                        ?
                                        <img src={academicCommitteePhoto} alt="academic-committee" className='dashboard-img-style bg-white' />
                                        :
                                        <>
                                            {
                                                user?.isDeptChairman
                                                    ?
                                                    <img src={chairmanPhoto} alt="dept-chairman" className='dashboard-img-style bg-white ' />
                                                    :
                                                    <>
                                                        {
                                                            user?.isHallProvost
                                                                ?
                                                                <img src={hallProvostPhoto} alt="hall-provost" className='dashboard-img-style bg-white ' />
                                                                :
                                                                <>
                                                                    {

                                                                        user?.isTeacher
                                                                            ?
                                                                            <img src={teacherPhoto} alt="teacher" className='dashboard-img-style bg-white ' />
                                                                            :
                                                                            <>
                                                                                {
                                                                                    user?.isStudent
                                                                                        ?
                                                                                        <img src={studentPhoto} alt="student" className='dashboard-img-style bg-white ' />
                                                                                        :
                                                                                        <img src={userPhoto} alt="user" className='dashboard-img-style bg-white ' />
                                                                                }
                                                                            </>
                                                                    }
                                                                </>
                                                        }
                                                    </>
                                            }
                                        </>

                                }
                            </>

                    }
                    <Offcanvas.Title className='fs-4 text-white'>Dashboard of <br /> <span className='text-info'>{user?.fullName}</span> </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className='p-0 bg-own'>
                    <ListGroup defaultActiveKey="#link1" className='bg-own'>
                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/profile`}  >
                            <ListGroup.Item className="" action >
                                Update Profile (G)
                            </ListGroup.Item>
                        </Link>
                        {
                            !isLoadingRole && !isLoading &&
                            <>
                                {
                                    user?.isStudent &&
                                    <>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/course-registration`}>
                                            <ListGroup.Item className="" action >Course Registration (S)</ListGroup.Item>
                                        </Link>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/project`}>
                                            <ListGroup.Item className="" action >Apply to Supervisor (S)</ListGroup.Item>
                                        </Link>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/course-registration-view`}>
                                            <ListGroup.Item className="" action >Course Applications (S)</ListGroup.Item>
                                        </Link>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/view-result`}>
                                            <ListGroup.Item className="" action >My  Result (S)</ListGroup.Item>
                                        </Link>

                                    </>
                                }
                                {
                                    user?.isTeacher &&
                                    <>

                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/courses-taken`}>
                                            <ListGroup.Item className="" action >Taken Courses (T) </ListGroup.Item>
                                        </Link>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/exam-committee`}>
                                            <ListGroup.Item className="" action >Exam Committee (T) </ListGroup.Item>
                                        </Link>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/exam-committee-chairman`}>
                                            <ListGroup.Item className="" action >Exam Committee Chairman (T) </ListGroup.Item>
                                        </Link>

                                    </>
                                }
                                {
                                    user?.isDeptChairman &&
                                    <>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/create-semester`}>
                                            <ListGroup.Item className="" action > Create Semester (C) </ListGroup.Item>
                                        </Link>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/add-teacher`}>
                                            <ListGroup.Item className="" action > Add Teacher (C) </ListGroup.Item>
                                        </Link>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/create-course`}>
                                            <ListGroup.Item className="" action >Create Course (C)  </ListGroup.Item>
                                        </Link>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/approve-course-registration-dept`}>
                                            <ListGroup.Item className="" action >Approve Application (C) </ListGroup.Item>
                                        </Link>
                                    </>
                                }
                                {
                                    user?.isHallProvost &&
                                    <>

                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/approve-course-registration-hall`}>
                                            <ListGroup.Item className="" action > Approve Application (HP) </ListGroup.Item>
                                        </Link>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/add-student-to-hall`}>
                                            <ListGroup.Item className="" action >Add Student to Hall (HP) </ListGroup.Item>
                                        </Link>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/remove-student-from-hall`}>
                                            <ListGroup.Item className="" action > Remove Student from Hall (HP) </ListGroup.Item>
                                        </Link>

                                    </>
                                }
                                {
                                    user?.isAcademicCommittee &&
                                    <>

                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/approve-course-registration-academic`}>
                                            <ListGroup.Item className="" action > Approve Application (AC) </ListGroup.Item>
                                        </Link>

                                    </>
                                }
                                {
                                    user?.isSuperAdmin &&
                                    <>

                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/create-hall`}>
                                            <ListGroup.Item className="" action > Create Hall (SA) </ListGroup.Item>
                                        </Link>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/add-dept-chairman`}>
                                            <ListGroup.Item className="" action > Add Department Chairman (SA) </ListGroup.Item>
                                        </Link>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/add-hall-provost`}>
                                            <ListGroup.Item className="" action > Add Hall Provost (SA) </ListGroup.Item>
                                        </Link>
                                        <Link className='custom-link' onClick={() => { setShow(false) }} to={`${url}/add-academic-member`}>
                                            <ListGroup.Item className="" action > Add Academic Committee (SA) </ListGroup.Item>
                                        </Link>

                                    </>
                                }
                            </>
                        }
                    </ListGroup>

                </Offcanvas.Body>

            </Offcanvas>
            <Switch>

                {/* general route */}
                <Route exact path={path}>
                    <DashboardHome></DashboardHome>
                </Route>
                <Route exact path={`${path}/profile`}>
                    <Updateprofile></Updateprofile>
                </Route>
                <Route path={`${path}/profile/change-password`}>
                    <ChangePassword></ChangePassword>
                </Route>

                {/* student Routes */}
                <StudentRoute path={`${path}/course-registration`}>
                    <CourseRegistrationForm></CourseRegistrationForm>
                </StudentRoute>
                <StudentRoute path={`${path}/course-registration-view/:applicationId`}>
                    <StudentCourseRegistrationDetails></StudentCourseRegistrationDetails>
                </StudentRoute>
                <StudentRoute path={`${path}/course-registration-view`}>
                    <StudentCourseRegistration></StudentCourseRegistration>
                </StudentRoute>
                <StudentRoute path={`${path}/project/apply-supervisor/:courseId`}>
                    <ApplyToSupervisor></ApplyToSupervisor>
                </StudentRoute>
                <StudentRoute path={`${path}/project`}>
                    <Projects></Projects>
                </StudentRoute>
                <StudentRoute path={`${path}/view-result`}>
                    <ViewResult></ViewResult>
                </StudentRoute>


                {/* teacher Routes */}
                <TeacherRoute path={`${path}/courses-taken/second-examiner/:courseId`}>
                    <SecondExaminer></SecondExaminer>
                </TeacherRoute>
                <TeacherRoute path={`${path}/courses-taken/third-examiner/:courseId`}>
                    <ThirdExaminer></ThirdExaminer>
                </TeacherRoute>
                <TeacherRoute path={`${path}/courses-taken/:courseId`}>
                    <CourseTeacher></CourseTeacher>
                </TeacherRoute>
                <TeacherRoute path={`${path}/courses-taken`}>
                    <TakenCourses></TakenCourses>
                </TeacherRoute>
                <TeacherRoute path={`${path}/exam-committee/:semesterId`}>
                    <MarksAssign></MarksAssign>
                </TeacherRoute>
                <TeacherRoute path={`${path}/exam-committee`}>
                    <ExamCommittee></ExamCommittee>
                </TeacherRoute>
                <TeacherRoute path={`${path}/exam-committee-chairman/:semesterId/result-sheet`}>
                    <ResultSheet></ResultSheet>
                </TeacherRoute>
                <TeacherRoute path={`${path}/exam-committee-chairman/:semesterId`}>
                    <MarksSheet></MarksSheet>
                </TeacherRoute>
                <TeacherRoute path={`${path}/exam-committee-chairman`}>
                    <ExamCommitteeChairman></ExamCommitteeChairman>
                </TeacherRoute>


                {/* department chairman Routes */}
                <DeptChairmanRoute path={`${path}/create-course`}>
                    <CreateCourse></CreateCourse>
                </DeptChairmanRoute>
                <DeptChairmanRoute path={`${path}/create-semester`}>
                    <CreateSemester></CreateSemester>
                </DeptChairmanRoute>
                <DeptChairmanRoute path={`${path}/add-teacher`}>
                    <AddTeacher></AddTeacher>
                </DeptChairmanRoute>
                <DeptChairmanRoute path={`${path}/approve-course-registration-dept/:applicationId`}>
                    <DeptChairmanCourseRegistrationDetails></DeptChairmanCourseRegistrationDetails>
                </DeptChairmanRoute>
                <DeptChairmanRoute path={`${path}/approve-course-registration-dept`}>
                    <DeptChairmanCourseRegistration></DeptChairmanCourseRegistration>
                </DeptChairmanRoute>


                {/* hall provost Routes */}
                <HallProvostRoute path={`${path}/approve-course-registration-hall/:applicationId`}>
                    <HallProvostCourseRegistrationDetails></HallProvostCourseRegistrationDetails>
                </HallProvostRoute>
                <HallProvostRoute path={`${path}/approve-course-registration-hall`}>
                    <HallProvostCourseRegistration></HallProvostCourseRegistration>
                </HallProvostRoute>
                <HallProvostRoute path={`${path}/add-student-to-hall`}>
                    <AddStudentToHall></AddStudentToHall>
                </HallProvostRoute>
                <HallProvostRoute path={`${path}/remove-student-from-hall`}>
                    <RemoveStudentFromHall></RemoveStudentFromHall>
                </HallProvostRoute>


                {/* academic committee Routes */}
                <AcademicCommitteeRoute path={`${path}/approve-course-registration-academic/:applicationId`}>
                    <AcademicCommitteeCourseRegistrationDetails></AcademicCommitteeCourseRegistrationDetails>
                </AcademicCommitteeRoute>
                <AcademicCommitteeRoute path={`${path}/approve-course-registration-academic`}>
                    <AcademicCommitteeCourseRegistration></AcademicCommitteeCourseRegistration>
                </AcademicCommitteeRoute>


                {/* super admin Routes */}
                <SuperAdminRoute path={`${path}/create-hall`}>
                    <CreateHall></CreateHall>
                </SuperAdminRoute>
                <SuperAdminRoute path={`${path}/add-dept-chairman`}>
                    <AddDeptChairman></AddDeptChairman>
                </SuperAdminRoute>
                <SuperAdminRoute path={`${path}/add-hall-provost`}>
                    <AddHallProvost></AddHallProvost>
                </SuperAdminRoute>
                <SuperAdminRoute path={`${path}/add-academic-member`}>
                    <AddAcademicCommittee></AddAcademicCommittee>
                </SuperAdminRoute>


            </Switch>
        </>

    );
};

export default Dashboard;