import React, { useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
// import checkDepartmentName from '../../../Functions/DeptCodeToDeptName';
// import { FaDownload } from 'react-icons/fa';
// import useAuth from '../../../Hooks/useAuth';
import { useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';

const MarkModal = (props) => {
    // const { user, dept } = useAuth();
    const { showMarkModal, setShowMarkModal, marks, theoryAttendance, setTheoryAttendance, theoryCT1, setTheoryCT1, theoryCT2, setTheoryCT2,
        theoryCT3, setTheoryCT3, theoryFinal, setTheoryFinal, lbAttendance, setLbAttendance, lbReport, setLbReport, lbQuiz, setLbQuiz } = props;

    const { register, handleSubmit } = useForm();
    const [attendance, setAttendance] = useState();
    const [ct1, setCt1] = useState();
    const [ct2, setCt2] = useState();
    const [ct3, setCt3] = useState();
    const [final, setFinal] = useState();
    const [labAttendance, setLabAttendance] = useState();
    const [labReport, setLabReport] = useState();
    const [labQuiz, setLabQuiz] = useState()
    const [fileUpload, setFileUpload] = useState();
    // useEffect(() => {
    //     marks?.studentsMarks?.map(x => {
    //         setAttendance(x.theoryAttendance);
    //         setCt1(x.theoryCT1);
    //         setCt2(x.theoryCT2);
    //         setCt3(x.theoryCT3);
    //         setFinal(x.theoryFinal);
    //     })
    // }, [])

    const handleAttendanceChange = e => {
        setAttendance(e.target.value);
    }
    const handleCt1Change = e => {
        setCt1(e.target.value);
    }
    const handleCt2Change = e => {
        setCt2(e.target.value);
    }
    const handleCt3Change = e => {
        setCt3(e.target.value);
    }
    const handleFinalChange = e => {
        setFinal(e.target.value);
    }
    const handleLabAttendanceChange = e => {
        setLabAttendance(e.target.value);
    }
    const handleLabReportChange = e => {
        setLabReport(e.target.value);
    }
    const handleLabQuizChange = e => {
        setLabQuiz(e.target.value);
    }

    const onSubmit = data => {
        let supObj = {};
        let arr = [];


        console.log(data);

        console.log(marks);

        marks?.studentsMarks?.map(x => {
            const obj = {};
            obj.id = data[`${x.id}_id`];

            if (theoryAttendance) {
                supObj.propertyName = "theoryAttendance";
                obj.theoryAttendance = data[`${x.id}_attendance`];
            }
            if (theoryCT1) {
                supObj.propertyName = "theoryCT1";
                obj.theoryCT1 = data[`${x.id}_ct1`];
            }
            if (theoryCT2) {
                supObj.propertyName = "theoryCT2";
                obj.theoryCT2 = data[`${x.id}_ct2`];
            }
            if (theoryCT3) {
                supObj.propertyName = "theoryCT3";
                obj.theoryCT3 = data[`${x.id}_ct3`];
            }
            if (theoryFinal) {
                supObj.propertyName = "theoryFinal";
                obj.theoryFinal = data[`${x.id}_final`];
            }
            if (lbAttendance) {
                supObj.propertyName = "labAttendance";
                obj.labAttendance = data[`${x.id}_lab_attendance`];
            }
            if (lbReport) {
                supObj.propertyName = "labReport";
                obj.labReport = data[`${x.id}_lab_report`];
            }
            if (lbQuiz) {
                supObj.propertyName = "labQuiz";
                obj.labQuiz = data[`${x.id}_lab_quiz`];
            }

            arr.push(obj);
        })

        supObj.mark = arr;

        console.log(supObj);

    }

    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, { type: 'buffer' })
                const wsName = wb.SheetNames[0];
                const ws = wb.Sheets[wsName];

                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then((d) => {
            // console.log("hehe he ", d);
            setFileUpload(d);
        });
    };

    // console.log("fillleeee === ", fileUpload);

    const onFileUpload = () => {
        //console.log(fileUpload);
        let supObj = {};
        let arr = [];

        let choice;

        if (theoryAttendance) {
            choice = 'theoryAttendance';
        }
        if (theoryCT1) {
            choice = 'theoryCT1';
        }
        if (theoryCT2) {
            choice = 'theoryCT2';
        }
        if (theoryCT3) {
            choice = 'theoryCT3';
        }
        if (theoryFinal) {
            choice = 'theoryFinal';
        }
        if (lbAttendance) {
            choice = "labAttendance";
        }
        if (lbReport) {
            choice = "labReport";
        }
        if (lbQuiz) {
            choice = "labQuiz";
        }

        if (fileUpload[0][`${choice}`]) {
            supObj.propertyName = choice;
            fileUpload?.map(x => {
                const obj = {};
                obj.id = x.id;
                obj[`${choice}`] = x[`${choice}`];
                arr.push(obj);
            })
            supObj.mark = arr;

            console.log("sooooooppppp ==== ", supObj);

        }

        else {
            alert("Please Select a correct file !!!!");
        }


    }

    return (
        <div>
            <Modal
                show={showMarkModal}
                onHide={() => { setShowMarkModal(false); setTheoryAttendance(false); setTheoryCT1(false); setTheoryCT2(false); setTheoryCT3(false); setTheoryFinal(false); setLbAttendance(false); setLbReport(false); setLbQuiz(false) }}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                // fullscreen={true}
                // className='m-5'
                size='xl'
            >
                <Modal.Header closeButton>
                    {/* <Modal.Title id="example-custom-modal-styling-title ">
                        <Button className='float-end me-5 download-pdf' variant="primary" onClick={handleDownload}>
                            <span className='text-white ms-2 float-end' >Download Pdf</span>
                            <FaDownload className='float-end mt-1 mb-2' ></FaDownload>
                        </Button>

                    </Modal.Title> */}
                </Modal.Header>

                <Modal.Body>
                    <div className='container w-100 my-5 ms-4 py-2'>
                        <div className="d-flex">
                            <h4 className='text-primary my-3 me-3 '>Please Select a file: </h4>
                            <input type="file" className='mt-3' onChange={(e) => {
                                const file = e.target.files[0];
                                readExcel(file);
                            }} />

                        </div>
                        <input as Button variant='primary' className='btn btn-primary mt-5' onClick={onFileUpload} value="Upload File" />
                    </div>
                    <div id="selectedPortion" className='px-4 py-2 my-5'>
                        {
                            marks.type === 'theory'
                            &&
                            <div className='container'>
                                <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                    <div className='p-4 '>
                                        <div className=' '>
                                            <h3 className='text-center mb-3' >Assign Marks</h3>
                                            <p><span className='fw-bold'>Course Title: </span>{marks?.courseTitle}</p>
                                            <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode}</p>
                                            <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p>
                                        </div>
                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <Form.Group className='mb-2'>
                                                <Table responsive striped bordered hover className='text-center' >
                                                    <col width="30%" />
                                                    <col width="30%" />
                                                    <col width="40%" />
                                                    <thead>
                                                        <tr>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                            {
                                                                theoryAttendance && <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Attendance <br />(10 marks)

                                                                </th>
                                                            }
                                                            {
                                                                theoryCT1 && <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    CT-1 <br />(20 marks)
                                                                </th>
                                                            }
                                                            {
                                                                theoryCT2 && <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    CT-2 <br />(20 marks)
                                                                </th>
                                                            }
                                                            {
                                                                theoryCT3 && <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    CT-3 <br />(20 marks)
                                                                </th>
                                                            }
                                                            {
                                                                theoryFinal && <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Final Exam Mark <br />(70 marks)
                                                                </th>
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            //marks?.studentsMarks?.map(x => console.log(x.theoryAttendance))

                                                            marks?.studentsMarks?.map(x => {
                                                                return (

                                                                    <tr key={x.id} style={{ border: "1px solid black" }}>

                                                                        {<td style={{ border: "1px solid black" }}>
                                                                            <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                                {...register(`${x?.id}_id`, { required: true })}
                                                                                readOnly />
                                                                        </td>}
                                                                        {<td style={{ border: "1px solid black" }}>
                                                                            <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} defaultValue={x?.studentProfileId?.firstName}
                                                                                {...register(`${x?.id}_name`, { required: true })}
                                                                                readOnly />
                                                                        </td>}


                                                                        {
                                                                            theoryAttendance
                                                                            &&
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='w-25 text-center' style={{ backgroundColor: 'inherit', border: "1px solid grey" }} type="number" defaultValue={
                                                                                    x.theoryAttendance ? x.theoryAttendance : attendance
                                                                                } onChange={() => handleAttendanceChange()} {...register(`${x?.id}_attendance`, { required: false })} />

                                                                            </td>

                                                                        }
                                                                        {
                                                                            theoryCT1
                                                                            &&
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='w-25 text-center' style={{ backgroundColor: 'inherit', border: "1px solid grey" }} type="number" defaultValue={
                                                                                    x.theoryCT1 ? x.theoryCT1 : ct1
                                                                                } onChange={() => handleCt1Change()} {...register(`${x?.id}_ct1`, { required: true })} />
                                                                            </td>

                                                                        }
                                                                        {
                                                                            theoryCT2
                                                                            &&
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='w-25 text-center' style={{ backgroundColor: 'inherit', border: "1px solid grey" }} type="number" defaultValue={
                                                                                    x.theoryCT2 ? x.theoryCT2 : ct2
                                                                                } onChange={() => handleCt2Change()} {...register(`${x?.id}_ct2`, { required: true })} />
                                                                            </td>

                                                                        }
                                                                        {
                                                                            theoryCT3
                                                                            &&
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='w-25 text-center' style={{ backgroundColor: 'inherit', border: "1px solid grey" }} type="number" defaultValue={
                                                                                    x.theoryCT3 ? x.theoryCT3 : ct3
                                                                                } onChange={() => handleCt3Change()} {...register(`${x?.id}_ct3`, { required: true })} />
                                                                            </td>

                                                                        }
                                                                        {
                                                                            theoryFinal
                                                                            &&
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='w-25 text-center' style={{ backgroundColor: 'inherit', border: "1px solid grey" }} type="number" defaultValue={
                                                                                    x.theoryFinal ? x.theoryFinal : final
                                                                                } onChange={() => handleFinalChange()} {...register(`${x?.id}_final`, { required: true })} />
                                                                            </td>

                                                                        }
                                                                        {/* _course_teacher_marks */}


                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </Table>

                                            </Form.Group>
                                            <div className='text-center'>
                                                <input as Button variant='primary' type="submit" value='Save Marks' className='btn btn-primary' />
                                            </div>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            marks.type === 'lab'
                            &&
                            <div className='container'>
                                <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                    <div className='p-4'>
                                        <div className=' '>
                                            <h3 className='text-center mb-3' >Assign Marks</h3>
                                            <p><span className='fw-bold'>Course Title: </span>{marks?.courseTitle}</p>
                                            <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode}</p>
                                            <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p>
                                        </div>
                                        <Form onSubmit={handleSubmit(onSubmit)}>
                                            <Form.Group className='mb-2'>
                                                <Table responsive striped bordered hover className='text-center'  >
                                                    <col width="15%" />
                                                    <col width="30%" />
                                                    <col width="15%" />
                                                    {/* <col width="15%" />
                                                    <col width="15%" /> */}
                                                    <thead>
                                                        <tr style={{ border: "1px solid black" }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>

                                                            {
                                                                lbAttendance && <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Lab Attendance (15%)

                                                                </th>
                                                            }
                                                            {
                                                                lbReport && <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Lab Report Marks (15%)
                                                                </th>
                                                            }
                                                            {
                                                                lbQuiz && <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Lab Quiz Marks (30%)
                                                                </th>
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            marks?.studentsMarks?.map(x => {
                                                                // console.log(x)
                                                                return (
                                                                    <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                                {...register(`${x?.id}_id`, { required: true })}
                                                                                readOnly />
                                                                        </td>
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} defaultValue={x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName}
                                                                                {...register(`${x?.id}_name`, { required: true })}
                                                                                readOnly />
                                                                        </td>
                                                                        {
                                                                            lbAttendance
                                                                            &&
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='w-25 text-center' style={{ backgroundColor: 'inherit', border: "1px solid grey" }} type="number" defaultValue={
                                                                                    x?.labAttendance ? x.labAttendance : labAttendance
                                                                                } onChange={() => handleLabAttendanceChange()} {...register(`${x?.id}_lab_attendance`, { required: true })} />
                                                                            </td>

                                                                        }
                                                                        {
                                                                            lbReport
                                                                            &&
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='w-25 text-center' style={{ backgroundColor: 'inherit', border: "1px solid grey" }} type="number" defaultValue={
                                                                                    x?.labReport ? x.labReport : labReport
                                                                                } onChange={() => handleLabReportChange()} {...register(`${x?.id}_lab_report`, { required: true })} />
                                                                            </td>

                                                                        }
                                                                        {
                                                                            lbQuiz
                                                                            &&
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='w-25 text-center' style={{ backgroundColor: 'inherit', border: "1px solid grey" }} type="number" defaultValue={
                                                                                    x?.labQuiz ? x.labQuiz : labQuiz
                                                                                } onChange={() => handleLabQuizChange()} {...register(`${x?.id}_lab_quiz`, { required: true })} />
                                                                            </td>

                                                                        }
                                                                    </tr>
                                                                )
                                                            })
                                                        }
                                                    </tbody>
                                                </Table>
                                            </Form.Group>

                                            <div className='text-center'>
                                                <input as Button variant='primary' type="submit" value='Save Marks' className='btn btn-primary' />
                                            </div>

                                        </Form>
                                    </div>

                                </div>
                            </div>
                        }

                    </div>
                </Modal.Body>
            </Modal>
        </div >
    );
};

export default MarkModal;