import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';
import checkDepartmentName from '../../../Functions/DeptCodeToDeptName';
import checkSemesterName from '../../../Functions/SemesterCodeToSemesterName';
import html2pdf from 'html2pdf.js';
import useAuth from '../../../Hooks/useAuth';

const SecondExaminerMarksModal = (props) => {
    const { user, dept } = useAuth();
    const allInfo = props.allInfo;
    const { showModal } = props;
    const { setShowModal } = props;
    const handleDownload = () => {
        const selected = document.getElementById('selectedPortion');
        // window.open(invoice);
        // return false;
        html2pdf().from(selected).save(`${allInfo?.course_code}_marks.pdf`);

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
                            <h5 className='text-uppercase text-center fw-bold mb-1'>Mawlana Bhashani Science and Technology university</h5>
                            <h5 className='text-center'>Santosh,Tangail-1902</h5>
                        </div>
                        <div className='mt-3'>
                            <p className='text-center fw-bold mb-1'>Department of {checkDepartmentName(dept)}</p>
                            <p className='text-center '>{checkSemesterName(allInfo?.semester_code)}</p>
                        </div>
                        <div className=''>
                            <div className='my-4'>
                                <p><span className='fw-bold'>Course Code: </span>{allInfo?.course_code}</p>
                                <p><span className='fw-bold'>Course Name: </span>{allInfo?.course_title}</p>
                                <p><span className='fw-bold'>Credit Hour: </span>{allInfo?.credit}</p>
                                <p><span className="fw-bold">Name of the Examiner(s): </span>{user?.displayName}</p>
                            </div>
                        </div>
                        <div>
                            <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                {/* <col width="11%" />
                                <col width="30%" />
                                <col width="12%" />
                                <col width="12%" />
                                <col width="12%" />
                                <col width="12%" /> */}
                                <thead>
                                    <tr style={{ border: "1px solid black" }}>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>

                                        {
                                            props?.final &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Final Exam Mark <br />(70 marks)
                                            </th>
                                        }

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(allInfo).length !== 0 &&
                                        allInfo?.marks.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                            <td style={{ border: "1px solid black" }} className='text-uppercase'>
                                                <p>{x?.s_id}</p>
                                            </td>
                                            <td style={{ border: "1px solid black" }}>
                                                <p>{x?.displayName}</p>
                                            </td>
                                            {
                                                props?.final &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.course_teacher_marks}</p>
                                                    }
                                                </td>
                                            }
                                        </tr>)
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <div className='container d-flex justify-content-between ms-2 pe-4'>
                        <div className="w-25">
                            <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                            <p className='text-center'>Signature of the Second Examiner</p>
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

export default SecondExaminerMarksModal;