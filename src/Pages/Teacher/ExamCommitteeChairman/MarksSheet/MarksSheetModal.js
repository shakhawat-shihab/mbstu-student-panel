import React from 'react';
import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';
import { Button, Modal, Table } from 'react-bootstrap';
import useAuth from '../../../../Hooks/useAuth';
import checkDepartmentName from '../../../../Functions/DeptCodeToDeptName';

const MarksSheetModal = (props) => {
    const { user } = useAuth();
    const { showModal, setShowModal, courseTitle, courseCode, credit, processedMarks } = props;

    // console.log("processed marks === ", processedMarks);

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
                                <p><span className='fw-bold'>Course Title: </span>{courseTitle}</p>
                                <p><span className='fw-bold'>Course Code: </span>{courseCode}</p>

                                <p><span className='fw-bold'>Credit Hour: </span>{credit}</p>
                                {/* <p><span className="fw-bold">Name of the Examiner(s): </span>{user?.displayName}</p> */}
                            </div>
                        </div>
                        {
                            processedMarks.type === 'theory'
                            &&
                            <div className='container'>
                                <div className='container rounded  my-5 ' >
                                    <div className='p-3 '>
                                        <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                            <thead>
                                                <tr style={{ border: "1px solid black" }}>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>CT & Attendance <br />(30 marks)</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Course Teacher </th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Second Examiner </th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Third Examiner </th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Final Marks <br />(70 marks)</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Total Marks <br /> (100 marks)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    processedMarks?.marks?.map(x => <tr key={x?.id} style={{ border: "1px solid black" }}>
                                                        <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.id}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.name}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.thirtyPercent}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.theoryWritten}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.theorySecondExaminer}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.theoryThirdExaminer}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.theoryFinal}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.totalMarks}</td>
                                                    </tr>)
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            processedMarks.type === 'lab'
                            &&
                            <div className='container'>
                                <div className='container-fluid rounded  my-5 ' >
                                    <div className='p-3 '>
                                        <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                            <thead>
                                                <tr style={{ border: "1px solid black" }}>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Marks <br /> (60 mars)</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Experiment Marks <br /> (40 marks)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    processedMarks?.marks?.map(x => <tr key={x?.id} style={{ border: "1px solid black" }}>
                                                        <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.id}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.name}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.labClassMark}</td>
                                                        <td title={x?.labExperimentBy} style={{ border: "1px solid black" }}>{x?.labExperiment}</td>
                                                    </tr>)
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            processedMarks.type === 'project'
                            &&
                            <div className='container'>
                                <div className='container-fluid rounded  my-5 ' >
                                    <div className='p-3 '>
                                        <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                            <thead>
                                                <tr style={{ border: "1px solid black" }}>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Performance<br />(70 marks)</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Presentation and Viva<br /> (30 marks)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    processedMarks?.marks?.map(x => <tr key={x?.id} style={{ border: "1px solid black" }}>
                                                        <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.id}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.name}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.projectClassPerformance}</td>
                                                        <td title={x?.projectPresentationBy} style={{ border: "1px solid black" }}>{x?.projectPresentation}</td>
                                                    </tr>)
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>

                        }
                        <div className="me-5 w-25 float-end">
                            <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                            <p className='text-center'>Signature of the Chairman</p>
                        </div>

                    </div>

                    {/* <div className='container d-flex justify-content-between ms-2 pe-4'>
                        <div className="w-25">
                            <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                            <p className='text-center'>Signature of Chairman</p>
                        </div>
                        <div className="w-25">
                            <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                            <p className='text-center'>Chairman</p>
                        </div>
                    </div> */}

                </Modal.Body>
            </Modal>

        </div>
    );
};

export default MarksSheetModal;