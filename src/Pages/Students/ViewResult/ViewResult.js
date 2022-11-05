import React, { useEffect, useState } from 'react';
import { Form, Spinner, Table } from 'react-bootstrap';
import checkSemesterName from '../../../Functions/SemesterCodeToSemesterName';
import useAuth from '../../../Hooks/useAuth';
import ResultSheet from '../../Teacher/ExamCommitteeChairman/ResultSheet/ResultSheet';

const ViewResult = () => {

    const { user } = useAuth();
    const [result, setResult] = useState([]);
    const [isLoadingResult, setIsLoadingResult] = useState(true);
    const [isProcessingResultOfASemester, setIsProcessingResultOfASemester] = useState(true);
    const [resultOfASemester, setResultOfASemester] = useState({});
    const [semesterCode, setSemesterCode] = useState(-1);

    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [profile, setProfile] = useState([]);

    const [semesterNames, setSemesterNames] = useState([]);

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


    //for loading profile
    useEffect(() => {
        setIsLoadingProfile(true);
        fetch(`http://localhost:5000/api/v1/profile`, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
        })
            .then(res => res.json())
            .then(info => {
                console.log('info of profile  = ', info?.data);
                setProfile(info?.data)
                setIsLoadingProfile(false);
            })
    }, [user])




    //for loading courses marks 
    useEffect(() => {
        // setIsLoadingResult(true);
        fetch(`http://localhost:5000/api/v1/student-result/get-student-result/${user?.profileId}`, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
        })
            .then(res => res.json())
            .then(info => {
                console.log('info  = ', info?.data);
                setSemesterCode(info?.data?.semesterCode);
                setResult(info?.data?.coursesMarks);
                setIsLoadingResult(false);
            })

    }, [user])

    //for processing marks
    useEffect(() => {
        setIsProcessingResultOfASemester(true);
        const supObj = {}
        let creditOffered = 0;
        let creditEarned = 0;
        let sumOfGPA = 0;
        // console.log('result ==> ', result)
        // console.log('semesterCode ==> ', semesterCode)
        const marksArray = [];
        result.map(x => {
            if (x.semesterCode == semesterCode) {
                const obj = {}
                obj.courseCode = x?.courseCode;
                obj.courseTitle = x?.courseTitle;
                obj.credit = x?.credit;
                creditOffered += x?.credit;
                let total = 0;
                if (x.type === 'theory') {
                    total = x?.theorySeventy + x?.theoryThirty;
                }
                else if (x.type === 'lab') {
                    total = x?.labSixty + x?.labFourty;
                }
                else if (x.type === 'project') {
                    total = x?.projectSeventy + x?.projectThirty;
                }

                if (total > 40) {
                    creditEarned += x?.credit;
                }
                const gradeAndLetter = checkMarks(total);
                obj.totalMarks = total;
                obj.GP = gradeAndLetter.gp
                obj.LG = gradeAndLetter.lg
                sumOfGPA += gradeAndLetter.gp * x?.credit;
                // console.log('obj  ', obj)
                marksArray.push(obj);
            }
        })
        supObj.creditOffered = creditOffered;
        supObj.creditEarned = creditEarned;
        supObj.GPA = (sumOfGPA / creditEarned).toFixed(2);
        supObj.courses = marksArray;
        supObj.semesterCode = semesterCode;
        supObj.semesterName = checkSemesterName(semesterCode);
        setResultOfASemester(supObj);
        console.log('supObj  ', supObj)
        setIsProcessingResultOfASemester(false);
    }, [semesterCode, result])


    //load semester name 
    useEffect(() => {
        const arrayOfSemesterName = []
        if (semesterCode != -1) {
            for (let i = 1; i <= semesterCode; i++) {
                const obj = {}
                obj.key = i;
                obj.value = checkSemesterName(i);
                arrayOfSemesterName.push(obj)
            }
            console.log('arrayOfSemesterName ', arrayOfSemesterName)
            setSemesterNames(arrayOfSemesterName)
        }

    }, [isLoadingResult])

    return (
        <>
            {
                (isProcessingResultOfASemester || isLoadingResult || isLoadingProfile)
                    ?
                    <div className='text-center my-5 py-5 '>
                        <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <div className='px-2 py-4 my-3 shadow-lg w-75 mx-auto rounded'>
                        <div className=' my-4'>
                            <Form >
                                <Form.Group className="mb-1 w-100 mx-auto">
                                    <Form.Label className='text-primary'>Select Semester:</Form.Label>
                                    <br></br>
                                    <Form.Select
                                        onChange={(e) => {
                                            setSemesterCode(e.target.value);
                                        }}>
                                        {
                                            semesterNames?.map(s => {
                                                return (
                                                    <>
                                                        {
                                                            s.key === semesterCode
                                                                ?
                                                                <option key={s.key} selected value={s.key}>{s.value}</option>
                                                                :
                                                                <option key={s.key} value={s.key}>{s.value}</option>
                                                        }

                                                    </>
                                                )
                                            })
                                        }
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        </div>
                        <div>
                            <Table responsive striped bordered hover>
                                <thead>
                                    <tr style={{ border: "1px solid black" }}>
                                        <th style={{ border: "1px solid black" }}>Course Code</th>
                                        <th style={{ border: "1px solid black" }}>Course Title</th>
                                        <th style={{ border: "1px solid black" }}>Credit Hour(s) </th>
                                        <th style={{ border: "1px solid black" }}> LG </th>
                                        <th style={{ border: "1px solid black" }}>GP</th>
                                        <th style={{ border: "1px solid black" }}> GPA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        resultOfASemester?.courses?.map(x => (
                                            <tr key={x?.courseCode} style={{ border: "1px solid black" }}>
                                                <td style={{ border: "1px solid black" }}>{x?.courseCode.toUpperCase()}</td>
                                                <td style={{ border: "1px solid black" }}>{x?.courseTitle}</td>
                                                <td style={{ border: "1px solid black" }}>{x.credit}</td>
                                                <td style={{ border: "1px solid black" }}>{x.LG}</td>
                                                <td style={{ border: "1px solid black" }}>{x.GP}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>

            }
        </>

    );
};

export default ViewResult;