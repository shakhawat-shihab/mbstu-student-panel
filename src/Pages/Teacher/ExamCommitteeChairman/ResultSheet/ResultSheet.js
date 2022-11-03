import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../../../Hooks/useAuth';
import ResultSheetModal from './ResultSheetModal';

const ResultSheet = () => {
    const { semesterId } = useParams();
    const [semesterInfo, setSemesterInfo] = useState({});
    // const [courseId, setCourseId] = useState('');
    const [marks, setMarks] = useState([]);
    const [processedResult, setProcessedResult] = useState([]);
    const [processNewMark, setProcessNewMarks] = useState(true);
    const [offeredCredit, setOfferedCredit] = useState(0);
    const [publishResultData, setPublishResultData] = useState({});
    const [studentsProfilesIds, setStudentsProfilesIds] = useState([]);
    // const [courses, setCourses] = useState([]);
    // const { history } = useHistory();
    // const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    // const email = user?.email;
    // const [semester, setSemester] = useState({});

    // const [totalCredit, setTotalCredit] = useState(0);
    // const [studentResult, setStudentResult] = useState([]);
    // console.log('semesterId ', semesterId);

    // const [info, setInfo] = useState();
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
        fetch(`http://localhost:5000/api/v1/semester/marks-of-all-course/${semesterId}`, {
            method: 'get',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
        })
            .then(res => res.json())
            .then(info => {
                console.log('semester and marks = ', info);
                // setInfo(info);
                setSemesterInfo(info?.data?.semester)
                setMarks(info?.data?.marks)
                setProcessNewMarks(!processNewMark)
                setOfferedCredit(info?.data?.totalCreditOffered)
            })
    }, [semesterId]);

    //need to claculate total credit


    const checkMarks = (marks) => {
        let grade_point, letter_grade;
        let obj = {};
        if (marks >= 80 && marks <= 100) {
            grade_point = 4.00;
            letter_grade = 'A+';
        }
        else if (marks >= 75 && marks < 80) {
            grade_point = 3.75;
            letter_grade = 'A';
        }
        else if (marks >= 70 && marks < 75) {
            grade_point = 3.50;
            letter_grade = 'A-';
        }
        else if (marks >= 65 && marks < 70) {
            grade_point = 3.25;
            letter_grade = 'B+';
        }
        else if (marks >= 60 && marks < 65) {
            grade_point = 3.00;
            letter_grade = 'B';
        }
        else if (marks >= 55 && marks < 60) {
            grade_point = 2.75;
            letter_grade = 'B-';
        }
        else if (marks >= 50 && marks < 55) {
            grade_point = 2.50;
            letter_grade = 'C+';
        }
        else if (marks >= 45 && marks < 50) {
            grade_point = 2.25;
            letter_grade = 'C';
        }
        else if (marks >= 40 && marks < 45) {
            grade_point = 2.00;
            letter_grade = 'D';
        }
        else {
            grade_point = 0.00;
            letter_grade = 'F';
        }
        obj.gp = grade_point;
        obj.lg = letter_grade;
        return obj;
    }


    const checkGpa = (gpa) => {
        let letter_grade = '';
        if (gpa == 4.00) {
            letter_grade = 'A+';
        }
        else if (gpa >= 3.75 && gpa < 4.00) {
            letter_grade = 'A';
        }
        else if (gpa >= 3.50 && gpa < 3.75) {
            letter_grade = 'A-';
        }
        else if (gpa >= 3.25 && gpa < 3.50) {
            letter_grade = 'B+';
        }
        else if (gpa >= 3.00 && gpa < 3.25) {
            letter_grade = 'B';
        }
        else if (gpa >= 2.75 && gpa < 3.00) {
            letter_grade = 'B-';
        }
        else if (gpa >= 2.50 && gpa < 2.75) {
            letter_grade = 'C+';
        }
        else if (gpa >= 2.25 && gpa < 2.50) {
            letter_grade = 'C';
        }
        else if (gpa >= 2.00 && gpa < 2.25) {
            letter_grade = 'D';
        }
        else {
            letter_grade = 'F';
        }
        return letter_grade;
    }

    useEffect(() => {
        const ArrayOfStudentsResult = []
        // console.log('process marks', marks)
        const objForResultStudents = {}
        const arrayOfStudentsProfile = []
        marks?.map(marksOfSingleStudent => {
            const supObj = {};
            console.log('marksOfSingleStudent ', marksOfSingleStudent)
            arrayOfStudentsProfile.push(marksOfSingleStudent?._id?.profile);
            supObj.id = marksOfSingleStudent?._id?.id;
            supObj.name = marksOfSingleStudent?.studentInfo?.[0]?.firstName + ' ' + marksOfSingleStudent?.studentInfo?.[0]?.lastName;
            let totalCreditTaken = 0;
            let creditEarned = 0;
            let creditLost = 0;
            let sumOfGPA = 0;
            const failedCourse = []
            const objForResultCourses = {}
            marksOfSingleStudent?.marksArray.map(x => {

                //unpaid course means the result will not inlude that course
                // if (x?.isPaid === false) {
                //     return;
                // }


                //for publish result
                const objForResultCourse = {}
                objForResultCourse.courseCode = x?.courseCode;
                objForResultCourse.courseTitle = x?.courseTitle;
                objForResultCourse.credit = x?.credit;
                objForResultCourse.courseId = x?.courseId;
                objForResultCourse.type = x?.type;
                objForResultCourse.semesterCode = semesterInfo?.semesterCode;

                let totalMarks = 0;
                if (x?.type === 'theory') {
                    let cnt = 0;
                    let sum = 0;
                    const { theoryCT1, theoryCT2, theoryCT3, theoryAttendance, theoryFinal = 0, theorySecondExaminer = 0, theoryThirdExaminer = 0 } = x;
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
                    if (Math.abs(theorySecondExaminer - theoryThirdExaminer) > 15) {
                        theoryWritten = parseInt((theoryFinal + theorySecondExaminer + theoryThirdExaminer) / 3)
                    }
                    else {
                        theoryWritten = parseInt((theoryFinal + theorySecondExaminer) / 2)
                    }
                    totalMarks = thirtyPercent + theoryWritten;
                    objForResultCourse.theorySeventy = theoryWritten;
                    objForResultCourse.theoryThirty = thirtyPercent;
                }
                else if (x?.type === 'lab') {
                    const { labAttendance = 0, labReport = 0, labQuiz = 0, labExperiment = 0 } = x;
                    totalMarks = parseInt(labAttendance + labQuiz + labReport + labExperiment)
                    objForResultCourse.labSixty = parseInt(labAttendance + labQuiz + labReport);
                    objForResultCourse.labFourty = labExperiment;
                }
                else if (x?.type === 'project') {
                    const { projectClassPerformance, projectPresentation } = x;
                    totalMarks = parseInt(projectClassPerformance + projectPresentation);
                    objForResultCourse.projectSeventy = projectClassPerformance;
                    objForResultCourse.projectThirty = projectPresentation;
                }

                totalCreditTaken += x?.credit;
                if (totalMarks >= 40) {
                    creditEarned += x?.credit;
                }
                else {
                    creditLost += x?.credit;
                    failedCourse.push(x?.courseCode)
                }
                const gradeAndLetter = checkMarks(totalMarks);
                // console.log('totalMarks ', totalMarks)
                // console.log('gradeAndLetter ', gradeAndLetter)
                sumOfGPA += gradeAndLetter.gp * x?.credit;

                // console.log(' objForResultCourse   ', objForResultCourse)
                objForResultCourses[`${x?.courseCode}`] = objForResultCourse;

            })
            objForResultCourses[`creditEarned`] = creditEarned;
            objForResultStudents[`${marksOfSingleStudent?._id?.id}`] = objForResultCourses;

            let CGPA = 0;
            creditEarned && (CGPA = sumOfGPA / creditEarned);

            if (creditEarned == 0) {
                supObj.remarks = 'Not Promoted'
            }
            else {
                supObj.remarks = 'Promoted'
            }
            supObj.totalCreditTaken = totalCreditTaken
            supObj.creditEarned = creditEarned;
            supObj.creditLost = creditLost;
            supObj.cgpa = CGPA.toFixed(2);
            supObj.failedCourses = failedCourse;
            // console.log(supObj);
            ArrayOfStudentsResult.push(supObj);

        })
        console.log('objForResultStudents == ', objForResultStudents);
        console.log('arrayOfStudentsProfile == ', arrayOfStudentsProfile);
        console.log(' ArrayOfStudentsResult == ', ArrayOfStudentsResult);
        setPublishResultData(objForResultStudents);
        setStudentsProfilesIds(arrayOfStudentsProfile);
        setProcessedResult(ArrayOfStudentsResult);
    }, [processNewMark]);


    const handleResultPublish = () => {
        // console.log('marks ==  ', marks)
        // console.log('publishResultData ==  ', publishResultData);
        const resultToPublish = {}
        resultToPublish.semesterId = semesterId;
        resultToPublish.semesterCode = semesterInfo.semesterCode;
        resultToPublish.students = publishResultData;
        resultToPublish.profileIdarray = studentsProfilesIds;

        console.log('Result To Publish ==  ', resultToPublish);
        fetch(`http://localhost:5000/api/v1/student-result/publish-result`, {
            method: 'put',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
            body: JSON.stringify(resultToPublish)
        })
            .then(res => res.json())
            .then(info => {
                console.log("info after result publish ", info);
                if (info.status === 'success') {
                    Toast.fire({
                        icon: 'success',
                        title: info.message
                    })
                }
            });
    }


    return (
        <div>
            <div className='container shadow-lg w-75 my-5 py-2'>
                <ResultSheetModal
                    showModal={showModal} setShowModal={setShowModal}
                    processedResult={processedResult} offeredCredit={offeredCredit} info={semesterInfo} checkGpa={checkGpa}
                />
                <h5 className='text-center mb-5 mt-4 fw-bold'>{semesterInfo.department?.toUpperCase()} {semesterInfo?.name} {semesterInfo.degree} Final Examination Result</h5>
                {/* <h4>{semesterInfo.semesterCode}</h4> */}
                <Table responsive striped bordered hover>
                    <col width="11%" />
                    <col width="30%" />
                    <col width="12%" />
                    <col width="30%" />
                    <col width="8%" />
                    <col width="8%" />
                    <col width="8%" />
                    <thead>
                        <tr style={{ border: "1px solid black" }}>
                            <th style={{ border: "1px solid black" }}>Student Id</th>
                            <th style={{ border: "1px solid black" }}>Name of the Candidates</th>
                            <th style={{ border: "1px solid black" }}>
                                Credit earned (Out of {offeredCredit} credits)

                            </th>
                            <th style={{ border: "1px solid black" }}>
                                Lost Credit (Course Code)

                            </th>
                            <th style={{ border: "1px solid black" }}>
                                GPA

                            </th>
                            <th style={{ border: "1px solid black" }}>
                                Result
                            </th>
                            <th style={{ border: "1px solid black" }}>
                                Remarks
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            processedResult?.map(x =>
                                // unpaid course means the result will not inlude that course
                                // x?.totalCreditTaken === 0
                                //     ?
                                //     <></>
                                //     :
                                <tr key={x?.id} style={{ border: "1px solid black" }}>
                                    <td style={{ border: "1px solid black" }}>{x.id.toUpperCase()}</td>
                                    <td style={{ border: "1px solid black" }}>{x.name}</td>
                                    <td style={{ border: "1px solid black" }}>{x.creditEarned}</td>
                                    <td style={{ border: "1px solid black" }}>
                                        {
                                            x?.creditLost !== 0
                                            &&
                                            <>
                                                {x.creditLost + ' '}
                                                (
                                                {
                                                    x?.failedCourses?.map(y => {
                                                        return (<span key={y} >
                                                            <span>{y.toUpperCase()}</span>
                                                            <span>

                                                                {
                                                                    y !== x?.failedCourses[x?.failedCourses.length - 1]
                                                                    &&
                                                                    `, `
                                                                }

                                                            </span>
                                                        </span>)
                                                    })
                                                }
                                                )
                                            </>
                                        }
                                    </td>
                                    <td style={{ border: "1px solid black" }}>{x.cgpa}</td>
                                    <td style={{ border: "1px solid black" }}>{checkGpa(x.cgpa)}</td>
                                    {
                                        (x.totalCreditTaken === offeredCredit)
                                        &&
                                        <td style={{ border: "1px solid black" }}>{x?.remarks}</td>
                                    }
                                </tr>
                            )
                        }


                    </tbody>
                </Table>
                <div className='text-center my-4'>
                    <Button variant='primary' className='me-2' onClick={() => setShowModal(true)}> Generate PDF</Button>
                    <Button
                        onClick={() => { handleResultPublish() }}
                        variant='success'>
                        Publish Result</Button>
                </div>
            </div>

        </div>
    );
};

export default ResultSheet;