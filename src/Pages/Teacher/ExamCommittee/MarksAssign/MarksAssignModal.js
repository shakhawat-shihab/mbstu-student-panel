import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';
import useAuth from '../../../../Hooks/useAuth';
import checkDepartmentName from '../../../../Functions/DeptCodeToDeptName';

const MarksAssignModal = (props) => {
    const { user } = useAuth();
    // const allInfo = props.allInfo;
    const { showModal, setShowModal, course, courseName, courseCode, credit, semesterAllMarks, marks } = props;

    const handleDownload = () => {
        const selected = document.getElementById('selectedPortion');
        // window.open(invoice);
        // return false;
        html2pdf().from(selected).save(`${courseCode}_marks.pdf`);

    }


    return (
        <div>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                // fullscreen={true}
                // className='m-5'
                size='xl'
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title ">
                        <Button className='float-end me-5 download-pdf' variant="primary" onClick={handleDownload}>
                            <span className='text-white ms-2 float-end' >Download Pdf</span>
                            <FaDownload className='float-end mt-1 mb-2' ></FaDownload>
                        </Button>

                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div id="selectedPortion" className='px-4 py-2 my-5'>
                        <div className='mt-4'>
                            <h5 className='text-uppercase text-center fw-bold mb-1 mt-2'>Mawlana Bhashani Science and Technology university</h5>
                            <h5 className='text-center'>Santosh,Tangail-1902</h5>
                        </div>
                        <div className='mt-3'>
                            <p className='text-center fw-bold mb-1'>Department of {checkDepartmentName(user?.department)}</p>
                        </div>
                        <div className='container'>
                            <div className='my-4 ms-4'>

                                <p><span className='fw-bold'>Course Title: </span>{marks?.courseTitle}</p>
                                <p><span className='fw-bold text-uppercase'>Course Code: </span>{marks?.courseCode?.toUpperCase()}</p>
                                <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p>
                                {/* <p><span className="fw-bold">Name of the Examiner(s): </span>{user?.displayName}</p> */}
                            </div>
                        </div>

                        {
                            marks?.type === 'lab'
                            &&
                            <div className='container'>
                                <div className='container-fluid rounded  my-5 ' >
                                    <div className='p-3 '>
                                        <Table responsive bordered className='text-center' style={{ border: '1px solid black' }}>
                                            <thead>
                                                <tr style={{ border: '1px solid black' }}>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                    {/* <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Marks<br />(60 marks)</th> */}
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Lab Experiment Marks  (40 )</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Viva-voce Marks (10)</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Total (50)</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    marks?.marks?.map(x => <tr key={`${x?.id}_${courseCode}`} style={{ border: '1px solid black' }}>
                                                        <td style={{ border: '1px solid black' }}>
                                                            <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} value={x?.id.toUpperCase()}
                                                                readOnly />
                                                        </td>
                                                        <td style={{ border: '1px solid black' }}>{x?.name}</td>
                                                        <td style={{ border: '1px solid black' }}>{x?.labExperiment}</td>
                                                        <td style={{ border: '1px solid black' }}>{x?.labViva}</td>
                                                        <td style={{ border: '1px solid black' }}>
                                                            {
                                                                x?.labExperiment && x?.labViva
                                                                    ?
                                                                    x?.labExperiment + x?.labViva
                                                                    :
                                                                    <>
                                                                        {
                                                                            x?.labViva ? x?.labViva : x?.labExperiment
                                                                        }
                                                                    </>
                                                            }

                                                        </td>
                                                    </tr>)
                                                }

                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            marks.type === 'project'
                            &&
                            <div className='container'>
                                <div className='container-fluid rounded  my-5 ' >
                                    <div className='p-3 '>
                                        <Table responsive bordered className='text-center' style={{ border: '1px solid black' }}>
                                            <thead>
                                                <tr style={{ border: '1px solid black' }}>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                    {/* <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Performance (70%)</th> */}
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Presentation and Viva <br />(30 marks)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {
                                                    marks?.studentsMarks?.map(x => <tr key={x?.id}>
                                                        <td style={{ border: '1px solid black' }}>
                                                            <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id.toUpperCase()}
                                                                readOnly />
                                                        </td>
                                                        <td style={{ border: '1px solid black' }}>{x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName}</td>
                                                        {/* <td style={{ border: '1px solid black' }}>{x?.class_marks_project}</td> */}
                                                        <td style={{ border: '1px solid black' }}>{x?.projectPresentation}</td>
                                                    </tr>)
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className='container d-flex justify-content-between ms-2 pe-4'>
                        <div className="w-25">
                            <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                            <p className='text-center'>Signature of Exam Committee Chairman</p>
                        </div>
                        <div className="w-25">
                            <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                            <p className='text-center'>Chairman</p>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MarksAssignModal;