import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

const MarksAssignCommitteeModal = (props) => {
    const { marks, showCommitteeModal, setShowCommitteeModal, courseId, examCommitteeLabExp, setExamCommitteeLabExp, examCommitteeLabViva, setExamCommitteeLabViva,
        examCommitteeProject, setExamCommitteeProject, isSaving, setIsSaving } = props;
    const [fileUpload, setFileUpload] = useState();
    const [labExperiment, setLabExperiment] = useState()
    const [labViva, setLabViva] = useState()
    const [project, setProject] = useState();
    const { register, handleSubmit, reset } = useForm();
    // const [examCommitteeFinal,setExamCommitteeFinal]=useState()

    console.log('marks ', marks);


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
        setExamCommitteeLabViva(false)
        setExamCommitteeLabExp(false)
        setExamCommitteeProject(false)
    }

    // console.log("exam committee marks == ", marks);

    const onSubmit = data => {

        console.log("exam modal data ==== ", data)
        let supObj = {};
        let arr = [];
        marks?.marks?.map(x => {
            const obj = {};
            obj.id = data[`${x.id}_id`];
            if (examCommitteeLabExp) {
                supObj.propertyName = "labExperiment";
                obj.labExperiment = data[`${x.id}_lab_experiment`];
            }
            else if (examCommitteeLabViva) {
                supObj.propertyName = "labViva";
                obj.labViva = data[`${x.id}_lab_viva`];
            }
            else if (examCommitteeProject) {
                supObj.propertyName = "projectPresentation";
                obj.projectPresentation = data[`${x.id}_project_presentation`];
            }
            arr.push(obj);
        })
        supObj.marks = arr;
        console.log('marks to push ', supObj);


        fetch(`http://localhost:5000/api/v1/marks/update-marks/exam-committe/${courseId}`, {
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
                    setShowCommitteeModal(false);
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
        let supObj = {};
        let arr = [];
        let choice;
        if (examCommitteeLabViva) {
            choice = "labViva";
        }
        else if (examCommitteeLabExp) {
            choice = "labExperiment";
        }
        else if (examCommitteeProject) {
            choice = "projectPresentation";
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

            console.log('marks to push file == ', supObj);

            fetch(`http://localhost:5000/api/v1/marks/update-marks/exam-committe/${courseId}`, {
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
                        setShowCommitteeModal(false);
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
            // alert("Please Select a correct file !!!!");
            Toast.fire({
                icon: 'error',
                title: "Please Select a correct File"
            })
        }
    }

    useEffect(() => {
        // console.log('he  !!')
        reset();
    }, [showCommitteeModal])

    return (
        <div>
            <Modal
                show={showCommitteeModal}
                onHide={() => { setShowCommitteeModal(false); setExamCommitteeLabViva(false); setExamCommitteeLabExp(false); setExamCommitteeProject(false) }}
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

                        {
                            marks.type === 'lab'
                            &&
                            <div className='container'>
                                <div className='container-fluid shadow-lg  rounded ' >
                                    <div className='p-4'>
                                        <div className=' '>
                                            <h3 className='text-center mb-3' >Assign Marks</h3>
                                            <p><span className='fw-bold'>Course Title: </span>{marks?.courseTitle}</p>
                                            <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode?.toUpperCase()}</p>
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
                                                                examCommitteeLabExp
                                                                &&
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Final Practical exam/Sessional Marks<br /> (40 marks)
                                                                    {/* <br />
                                                                    <span className='edit' onClick={() => { setShowCommitteeModal(true); setExamCommitteeLabExp(true) }}>Edit</span> */}
                                                                </th>
                                                            }
                                                            {
                                                                examCommitteeLabViva
                                                                &&
                                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Viva-voce Marks <br /> (10 marks)
                                                                    {/* <br />
                                                                    <span className='edit' onClick={() => { setShowCommitteeModal(true); setExamCommitteeLabViva(true) }}>Edit</span> */}
                                                                </th>
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            marks?.marks?.map(x => {
                                                                // console.log(x)
                                                                return (
                                                                    <tr key={x?.id} style={{ border: "1px solid black" }}>
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                                {...register(`${x?.id}_id`, { required: true })}
                                                                                readOnly />
                                                                        </td>
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} defaultValue={x?.name}
                                                                                {...register(`${x?.id}_name`, { required: true })}
                                                                                readOnly />
                                                                        </td>
                                                                        {
                                                                            examCommitteeLabExp
                                                                            &&
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='w-25 text-center' style={{ backgroundColor: 'inherit', border: "1px solid grey" }} type="number" defaultValue={
                                                                                    x.labExperiment ? x.labExperiment : labExperiment
                                                                                } onChange={(e) => setLabExperiment(e.target.value)} {...register(`${x?.id}_lab_experiment`, { required: true })} min="0" max="40" />
                                                                            </td>
                                                                        }
                                                                        {
                                                                            examCommitteeLabViva
                                                                            &&
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='w-25 text-center' style={{ backgroundColor: 'inherit', border: "1px solid grey" }} type="number" defaultValue={
                                                                                    x.labViva ? x.labViva : labViva
                                                                                } onChange={(e) => setLabViva(e.target.value)} {...register(`${x?.id}_lab_viva`, { required: true })} min="0" max="10" />
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
                        {
                            marks.type === 'project'
                            &&
                            <div className='container'>
                                <div className='container-fluid shadow-lg  rounded ' >
                                    <div className='p-4'>
                                        <div className=' '>
                                            <h3 className='text-center mb-3' >Assign Marks</h3>
                                            <p><span className='fw-bold'>Course Title: </span>{marks?.courseTitle}</p>
                                            <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode?.toUpperCase()}</p>
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
                                                                examCommitteeProject && <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                    Presentation and Viva <br />(30%)

                                                                </th>
                                                            }
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            marks?.marks?.map(x => {
                                                                // console.log(x)
                                                                return (
                                                                    <tr key={x?.id} style={{ border: "1px solid black" }}>
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                                {...register(`${x?.id}_id`, { required: true })}
                                                                                readOnly />
                                                                        </td>
                                                                        <td style={{ border: "1px solid black" }}>
                                                                            <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} defaultValue={x?.name}
                                                                                {...register(`${x?.id}_name`, { required: true })}
                                                                                readOnly />
                                                                        </td>
                                                                        {
                                                                            examCommitteeProject
                                                                            &&
                                                                            <td style={{ border: "1px solid black" }}>
                                                                                <input className='w-25 text-center' style={{ backgroundColor: 'inherit', border: "1px solid grey" }} type="number" defaultValue={
                                                                                    x?.projectPresentation ? x.projectPresentation : project
                                                                                } onChange={(e) => setProject(e.target.value)} {...register(`${x?.id}_project_presentation`, { required: true })} min="0" max="30" />
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
        </div>
    );
};

export default MarksAssignCommitteeModal;