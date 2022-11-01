import React, { useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

const ThirdMarkModal = (props) => {
    const { marks, showMarkModal, setShowMarkModal, thirdExaminerFinal, setThirdExaminerFinal, courseId, isSaving, setIsSaving } = props;
    const { register, handleSubmit, reset } = useForm();
    const [theoryThirdExaminer, setTheoryThirdExaminer] = useState();
    const [fileUpload, setFileUpload] = useState();

    const handleThirdExaminerFinalChange = e => {
        setTheoryThirdExaminer(e.target.value);
    }

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

    const makeAllPropsFalse = () => {
        setThirdExaminerFinal(false);
    }

    const onSubmit = data => {
        let supObj = {};
        let arr = [];

        supObj.propertyName = "theoryThirdExaminer";

        marks?.studentsMarks?.map(x => {
            const obj = {};

            obj.id = data[`${x.id}_id`];
            obj.theoryThirdExaminer = data[`${x.id}_final`];


            arr.push(obj);
        })

        supObj.marks = arr;

        console.log('marks to push ', supObj);

        fetch(`http://localhost:5000/api/v1/marks/update-marks/third-examiner/${courseId}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
            body: JSON.stringify(supObj)
        })
            .then(res => res.json())
            .then(info => {
                // console.log("info ", info);
                if (info?.status === 'success') {
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully updated marks'
                    })
                    setIsSaving(!isSaving)
                    setShowMarkModal(false);
                    reset()
                    makeAllPropsFalse();
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: info?.message
                    })
                    reset()
                }
            });

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

        if (thirdExaminerFinal) {
            choice = 'theoryThirdExaminer';
        }

        if (fileUpload[0][`${choice}`]) {
            supObj.propertyName = choice;
            fileUpload?.map(x => {
                const obj = {};
                obj.id = x.id;
                obj[`${choice}`] = x[`${choice}`];
                arr.push(obj);
            })
            supObj.marks = arr;

            console.log('marks to push ', supObj);

            fetch(`http://localhost:5000/api/v1/marks/update-marks/third-examiner/${courseId}`, {
                method: 'put',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
                },
                body: JSON.stringify(supObj)
            })
                .then(res => res.json())
                .then(info => {
                    console.log("third excel info ", info);
                    if (info?.status === 'success') {
                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully updated marks'
                        })
                        setIsSaving(!isSaving)
                        setShowMarkModal(false);
                        reset()
                        makeAllPropsFalse();
                    }
                    else {
                        Toast.fire({
                            icon: 'error',
                            title: 'Failed to update marks'
                        })
                        reset()
                    }
                });

        }

        else {
            alert("Please Select a correct file !!!!");
        }


    }

    return (
        <div>
            <Modal
                show={showMarkModal}
                onHide={() => { setShowMarkModal(false); setThirdExaminerFinal(false); }}
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
                    <div className='container w-100 ms-4 py-2'>
                        <div className="d-flex">
                            <h4 className='text-primary my-3 me-3 '>Please Select a file: </h4>
                            <input type="file" className='mt-3' onChange={(e) => {
                                const file = e.target.files[0];
                                readExcel(file);
                            }} />

                        </div>
                        <Button variant='primary' className='btn btn-primary' onClick={onFileUpload}>Upload File</Button>
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
                                                            thirdExaminerFinal && <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
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
                                                                        thirdExaminerFinal
                                                                        &&
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <input className='w-25 text-center' style={{ backgroundColor: 'inherit', border: "1px solid grey" }} type="number" defaultValue={
                                                                                x.theoryThirdExaminer ? x.theoryThirdExaminer : theoryThirdExaminer
                                                                            } onChange={() => handleThirdExaminerFinalChange()} {...register(`${x?.id}_final`, { required: true })} min="0" max="70" />
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
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ThirdMarkModal;