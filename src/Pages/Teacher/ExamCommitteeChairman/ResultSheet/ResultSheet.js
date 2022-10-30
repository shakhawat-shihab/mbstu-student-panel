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
    const { history } = useHistory();
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const email = user?.email;
    const [semester, setSemester] = useState({});

    //let { url } = useRouteMatch();
    //const myArray = url.split("/");
    //console.log(myArray.at(-2));
    const [totalCredit, setTotalCredit] = useState(0);
    const [studentResult, setStudentResult] = useState([]);
    console.log('semesterId ', semesterId);
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

    useEffect(() => {

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
        // const handleResult = () => {
        console.log("semester ", semester)
        const coursesArray = [];
        let credit_sum = 0;
        semester?.courses?.map(x => {
            const objj = {};
            objj.course_code = x.course_code
            objj.course_title = x.course_title
            objj.credit = x.credit
            objj.type = x.type
            coursesArray.push(objj);
            credit_sum += x.credit
        })
        setTotalCredit(credit_sum);

        const dropped = [];
        const students = [];
        semester?.regular_students?.map(x => {
            const student = {}
            student.s_id = x.s_id;
            student.displayName = x.displayName;
            const creditLostArray = [];
            let credit_earned = 0;
            const obj = {}
            let sum_grade_mul_credit = 0;
            coursesArray.map(c => {
                // if (c.type == 'theory') {
                let { ct1, ct2, ct3, attendance, course_teacher_marks, second_examiner_marks, third_examiner_marks, final_marks, lab_attendance, lab_report, lab_quiz, class_marks_lab, class_marks_project, presentation_marks_project, presentation_marks_project_by, experiment_marks_lab, experiment_marks_lab_by } = x[`${c.course_code}`];
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
                        const { gp } = checkMarks(total_marks);
                        sum_grade_mul_credit += gp * c.credit;
                    }
                    else {
                        creditLostArray.push(c.course_code)
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
                        const { gp } = checkMarks(total_marks);
                        sum_grade_mul_credit += gp * c.credit;
                    }
                    else {
                        creditLostArray.push(c.course_code)
                    }

                }
                //project
                else if (c.type === 'project') {
                    let total_marks = 0;
                    (!class_marks_project) && (class_marks_project = 0);
                    (!presentation_marks_project) && (presentation_marks_project = 0);
                    subObj.class_marks_project = class_marks_project;
                    subObj.presentation_marks_project = presentation_marks_project;
                    // subObj.presentation_marks_project_by = presentation_marks_project_by;
                    ((class_marks_project || class_marks_project == 0) && (presentation_marks_project || presentation_marks_project == 0)) && (total_marks = parseInt(class_marks_project) + parseInt(presentation_marks_project));
                    subObj.total_marks = total_marks;
                    if (total_marks > 40) {
                        credit_earned += c.credit;
                        const { gp } = checkMarks(total_marks);
                        sum_grade_mul_credit += gp * c.credit;
                    }
                    else {
                        creditLostArray.push(c.course_code)
                    }
                }
                obj[`${c.course_code}`] = subObj;
            })
            if (credit_earned < 2) {
                dropped.push(x?.s_id);
                student.remarks = 'Not Promoted';
            }
            student.marks = obj;
            student.credit_earned = credit_earned;
            student.credit_lost = credit_sum - credit_earned;
            student.credit_lost_array = creditLostArray;
            console.log(' fun  ', sum_grade_mul_credit, ' fd ', credit_earned)
            const gpa = (sum_grade_mul_credit / credit_earned);
            gpa ? student.gpa = gpa.toFixed(2) : student.gpa = 0;
            student.result = checkGpa(student.gpa);

            students.push(student);
        })
        console.log('students ', students);
        setStudentResult(students);
    }, [semester])

    const checkSemesterName = (semester) => {
        let semesterName = "";
        if (semester === 1)
            semesterName = "1st Year 1st Semester";
        if (semester === 2)
            semesterName = "1st Year 2nd Semester";
        if (semester === 3)
            semesterName = "2nd Year 1st Semester";
        if (semester === 4)
            semesterName = "2nd Year 2nd Semester";
        if (semester === 5)
            semesterName = "3rd Year 1st Semester";
        if (semester === 6)
            semesterName = "3rd Year 2nd Semester";
        if (semester === 7)
            semesterName = "4th Year 1st Semester";
        if (semester === 8)
            semesterName = "4th Year 2nd Semester";
        return semesterName;
    }

    //semesterName = checkSemesterName(semester?.semester_code);
    //console.log(semesterName);

    return (
        <div>
            <div className='container shadow-lg w-75 my-5 py-2'>
                <ResultSheetModal
                    semester={semester} totalCredit={totalCredit} studentResult={studentResult} showModal={showModal} setShowModal={setShowModal}
                />
                <h4 className='text-center mt-4 mb-4'>Result</h4>
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
                                Credit earned (Out of {totalCredit} credits)

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

                            studentResult?.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                <td style={{ border: "1px solid black" }}>{x.s_id.toUpperCase()}</td>
                                <td style={{ border: "1px solid black" }}>{x.displayName}</td>
                                <td style={{ border: "1px solid black" }}>{x.credit_earned}</td>
                                <td style={{ border: "1px solid black" }}>{x.credit_lost + ' '}
                                    (
                                    {
                                        x?.credit_lost_array?.map(y => {
                                            return (<>
                                                <span>{y}</span>
                                                <span>
                                                    {
                                                        y != x.credit_lost_array[x.credit_lost_array.length - 1]
                                                        &&
                                                        `, `
                                                    }
                                                </span>
                                            </>)

                                        })
                                    }
                                    )
                                </td>
                                <td style={{ border: "1px solid black" }}>{x.gpa}</td>
                                <td style={{ border: "1px solid black" }}>{x.result}</td>
                                {

                                    <td style={{ border: "1px solid black" }}>{x.remarks && <span>{x.remarks}</span>}</td>
                                }

                            </tr>)
                        }
                    </tbody>
                </Table>
                <div className='text-center my-4'>
                    <Button variant='success' className='me-2' onClick={() => setShowModal(true)}> Generate PDF</Button>
                </div>
            </div>

        </div>
    );
};

export default ResultSheet;