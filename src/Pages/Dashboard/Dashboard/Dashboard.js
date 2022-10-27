import React, { useState } from 'react';
import { Button, ListGroup, Offcanvas } from 'react-bootstrap';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import CourseRegistration from '../../Students/CourseRegistration/CourseRegistration';
import StudentRoute from '../../LogIn/LogIn/StudentRoute/StudentRoute';
import TeacherRoute from '../../LogIn/LogIn/TeacherRoute/TeacherRoute';
import DashboardHome from '../DashboardHome/DashboardHome';
import TakenCourses from '../../Teacher/CoursesTaken/CoursesTaken';
import DeptChairmanRoute from '../../LogIn/LogIn/DeptChairmanRoute/DeptChairmanRoute';
import CreateSemester from '../../DeptChairman/CreateSemster/CreateSemester';
import AddTeacher from '../../DeptChairman/AddTeacher/AddTeacher';
import CourseTeacher from '../../Teacher/CourseTeacher/CourseTeacher';
import RunningSemesters from '../../DeptChairman/RunningSemesters/RunningSemesters';
import SemesterChairman from '../../DeptChairman/SemesterChairman/SemesterChairman';
import DashboardNavigationBar from '../DashboardNaviagtionBar/DashboardNavigationBar';
import SecondExaminer from '../../Teacher/SecondExaminer/SecondExaminer';
import ThirdExaminer from '../../Teacher/ThirdExaminer/ThirdExaminer';
import CreateCourse from '../../DeptChairman/CreateCourse/CreateCourse';
import ExamCommittee from '../../Teacher/ExamCommittee/ExamCommittee';
import MarkAssignCommittee from '../../Teacher/MarkAssignCommittee/MarkAssignCommittee';
import ApplyToSupervisor from '../../Students/ApplyToSupervisor/ApplyToSupervisor';
import Projects from '../../Students/Projects/Projects';
import ResultSheet from '../../DeptChairman/ResultSheet/ResultSheet';
import Updateprofile from '../UpdateProfile/Updateprofile';

const Dashboard = () => {
    const { user, student, teacher, deptChairman, isLoading, isLoadingRole } = useAuth();
    const [show, setShow] = useState(false);
    let { path, url } = useRouteMatch();
    console.log('url =', url, student);
    const stateChange = () => {
        setShow(true)
    }
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
                    <Offcanvas.Title>Dashboard of <br /> <span className='text-info'>{user.displayName}</span> </Offcanvas.Title>
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


                                        {/* the below portion is added here just for testing purpose */}
                                        {/* <ListGroup.Item action >
                                            <Link to={`${url}/create-course`}>Create Course (C) </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/create-semester`}> Create Semester (C) </Link>
                                        </ListGroup.Item> */}


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
                                    </>
                                }
                                {
                                    user?.isDeptChairman &&
                                    <>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/running-semesters`}> Current Semester (C) </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/create-semester`}> Create Semester (C) </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/add-teacher`}> Add Teacher (C) </Link>
                                        </ListGroup.Item>
                                        <ListGroup.Item action >
                                            <Link to={`${url}/create-course`}>Create Course (C) </Link>
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
                    <CourseRegistration></CourseRegistration>
                </StudentRoute>
                <StudentRoute path={`${path}/project/apply-supervisor/:courseId`}>
                    <ApplyToSupervisor></ApplyToSupervisor>
                </StudentRoute>
                <StudentRoute path={`${path}/project`}>
                    <Projects></Projects>
                </StudentRoute>

                {/* the below portion is added here just for testing purpose */}
                {/* <StudentRoute path={`${path}/create-course`}>
                    <CreateCourse></CreateCourse>
                </StudentRoute>
                <StudentRoute path={`${path}/create-semester`}>
                    <CreateSemester></CreateSemester>
                </StudentRoute> */}


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
                    <MarkAssignCommittee></MarkAssignCommittee>
                </TeacherRoute>
                <TeacherRoute path={`${path}/exam-committee`}>
                    <ExamCommittee></ExamCommittee>
                </TeacherRoute>

                {/* department chairman Routes */}
                <DeptChairmanRoute path={`${path}/running-semesters/:semesterId/result-sheet`}>
                    <ResultSheet></ResultSheet>
                </DeptChairmanRoute>
                <DeptChairmanRoute path={`${path}/running-semesters/:semesterId`}>
                    <SemesterChairman></SemesterChairman>
                </DeptChairmanRoute>
                <DeptChairmanRoute path={`${path}/running-semesters`}>
                    <RunningSemesters></RunningSemesters>
                </DeptChairmanRoute>
                <DeptChairmanRoute path={`${path}/create-course`}>
                    <CreateCourse></CreateCourse>
                </DeptChairmanRoute>
                <DeptChairmanRoute path={`${path}/create-semester`}>
                    <CreateSemester></CreateSemester>
                </DeptChairmanRoute>
                <DeptChairmanRoute path={`${path}/add-teacher`}>
                    <AddTeacher></AddTeacher>
                </DeptChairmanRoute>


            </Switch>
        </>

    );
};

export default Dashboard;