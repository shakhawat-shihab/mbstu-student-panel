import React, { useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
// import checkDepartmentName from '../../../Functions/DeptCodeToDeptName';
// import useAuth from '../../../Hooks/useAuth';
import { useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';

const SecondMarkModal = (props) => {

    const { marks, showMarkModal, setShowMarkModal, secondExaminerFinal, setSecondExaminerFinal } = props;
    const { register, handleSubmit } = useForm();
    const [theorySecondExaminer, setTheorySecondExaminer] = useState();
    const [fileUpload, setFileUpload] = useState();

    console.log(marks);


    const handleSecondExaminerFinalChange = e => {
        setTheorySecondExaminer(e.target.value);
    }

    const onSubmit = data => {
        let supObj = {};
        let arr = [];


        console.log(data);

        console.log(marks);
        supObj.propertyName = "theorySecondExaminer";

        marks?.studentsMarks?.map(x => {
            const obj = {};

            obj.id = data[`${x.id}_id`];
            obj.theorySecondExaminer = data[`${x.id}_final`];


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

    const onFileUpload = () => {
        //console.log(fileUpload);
        let supObj = {};
        let arr = [];

        let choice;

        if (secondExaminerFinal) {
            choice = 'theorySecondExaminer';
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
                onHide={() => { setShowMarkModal(false); setSecondExaminerFinal(false); }}
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
                                                            secondExaminerFinal && <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
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
                                                                        <input className=' border-0 w-25 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                            {...register(`${x?.id}_id`, { required: true })}
                                                                            readOnly />
                                                                    </td>}
                                                                    {<td style={{ border: "1px solid black" }}>
                                                                        <input className='border-0 w-25 text-center' style={{ backgroundColor: 'inherit' }} defaultValue={x?.studentProfileId?.firstName}
                                                                            {...register(`${x?.id}_name`, { required: true })}
                                                                            readOnly />
                                                                    </td>}

                                                                    {
                                                                        secondExaminerFinal
                                                                        &&
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <input className='w-25 text-center' style={{ backgroundColor: 'inherit', border: "1px solid grey" }} type="number" defaultValue={
                                                                                x.theorySecondExaminer ? x.theorySecondExaminer : theorySecondExaminer
                                                                            } onChange={() => handleSecondExaminerFinalChange()} {...register(`${x?.id}_final`, { required: true })} />
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
                    </div>
                </Modal.Body>

            </Modal>
        </div>
    );
};

export default SecondMarkModal;