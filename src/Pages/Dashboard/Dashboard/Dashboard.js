import React, { useState } from 'react';
import { Button, ListGroup, Offcanvas } from 'react-bootstrap';
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
import ApplicationDetails from '../../DeptChairman/CourseAppliaction/ApplicationDetails/ApplicationDetails';
import HallProvostRoute from '../../LogIn/LogIn/HallProvostRoute/HallProvostRoute';
import AcademicCommitteeCourseRegistration from '../../AcademicCommittee/AcademicCommitteeCourseRegistration';
import StudentCourseRegistration from '../../Students/StudentCourseRegistration/StudentCourseRegistration';
import ChairmanCourseRegistration from '../../DeptChairman/CourseAppliaction/ChairmanCourseRegistration';
import HallProvostCourseRegistration from '../../HallProvost/HallProvostCourseRegistration';
import CourseRegistrationForm from '../../Students/CourseRegistrationForm/CourseRegistrationForm';
import ViewResult from '../../Students/ViewResult/ViewResult';


const Dashboard = () => {
    const { user, isLoading, isLoadingRole } = useAuth();
    const [show, setShow] = useState(false);
    let { path, url } = useRouteMatch();
    // console.log('url =', url, student);
    const stateChange = () => {
        setShow(true)
    }

    // console.log("path === ", path);
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

            <Offcanvas show={show} onHide={() => { setShow(false) }} >
                <Offcanvas.Header closeButton className='bg-secondary'>
                    <Offcanvas.Title>Dashboard of <br /> <span className='text-info'>{user?.fullName}</span> </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className='p-0'>
                    <ListGroup defaultActiveKey="#link1">
                        <ListGroup.Item action >
                            <Link to={`${url}/profile`}> Update Profile (G) </Link>
                        </ListGroup.Item>
                        {
                            !isLoadingRole && !isLoading &&
                            <>
                                {
                                    user?.isStudent &&
                                    <>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/course-registration`}> Course Registration (S)</Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/project`}> Apply to Supervisor (S)</Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/course-registration-view`}>Course Applications (S)</Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/view-result`}>My  Result (S)</Link>
                                        </ListGroup.Item>

                                    </>
                                }
                                {
                                    user?.isTeacher &&
                                    <>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/courses-taken`}>Taken Courses (T) </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/exam-committee`}>Exam Committee (T) </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/exam-committee-chairman`}>Exam Committee Chairman (T) </Link>
                                        </ListGroup.Item>
                                    </>
                                }
                                {
                                    user?.isDeptChairman &&
                                    <>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/create-semester`}> Create Semester (C) </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/add-teacher`}> Add Teacher (C) </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/create-course`}>Create Course (C) </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/approve-course-registration-dept`}>Approve Application (C) </Link>
                                        </ListGroup.Item>
                                    </>
                                }
                                {
                                    user?.isHallProvost &&
                                    <>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/approve-course-registration-hall`}> Approve Application (HP) </Link>
                                        </ListGroup.Item>
                                    </>
                                }
                                {
                                    user?.isAcademicCommittee &&
                                    <>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/approve-course-registration-academic`}> Approve Application (AC) </Link>
                                        </ListGroup.Item>
                                    </>
                                }
                            </>
                        }
                    </ListGroup>
                </Offcanvas.Body>
            </Offcanvas>
            <Switch>
                <Route exact path={path}>
                    <DashboardHome></DashboardHome>
                </Route>
                <Route exact path={`${path}/profile`}>
                    <Updateprofile></Updateprofile>
                </Route>

                {/* student Routes */}
                <StudentRoute path={`${path}/course-registration`}>
                    <CourseRegistrationForm></CourseRegistrationForm>
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
                    <ApplicationDetails></ApplicationDetails>
                </DeptChairmanRoute>
                <DeptChairmanRoute path={`${path}/approve-course-registration-dept`}>
                    <ChairmanCourseRegistration></ChairmanCourseRegistration>
                </DeptChairmanRoute>


                {/* hall provost Routes */}

                <HallProvostRoute path={`${path}/approve-course-registration-hall`}>
                    <HallProvostCourseRegistration></HallProvostCourseRegistration>
                </HallProvostRoute>


                {/* academic committee Routes */}

                <HallProvostRoute path={`${path}/approve-course-registration-academic`}>
                    <AcademicCommitteeCourseRegistration></AcademicCommitteeCourseRegistration>
                </HallProvostRoute>


            </Switch>
        </>

    );
};

export default Dashboard;