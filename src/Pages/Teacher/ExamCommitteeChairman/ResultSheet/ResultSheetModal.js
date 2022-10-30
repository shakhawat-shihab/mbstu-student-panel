import React from 'react';
import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';
import { Button, Modal, Table } from 'react-bootstrap';
import useAuth from '../../../../Hooks/useAuth';
import checkSemesterName from '../../../../Functions/SemesterCodeToSemesterName';
import checkDepartmentName from '../../../../Functions/DeptCodeToDeptName';


const ResultSheetModal = (props) => {

    const { showModal, setShowModal, semester, totalCredit, studentResult } = props;
    const { dept } = useAuth();

    const handleDownload = () => {
        const selected = document.getElementById('selectedPortion');
        // window.open(invoice);
        // return false;
        html2pdf().from(selected).save(`${checkSemesterName(semester?.semester_code)}_result.pdf`);

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
                    <div id="selectedPortion">
                        <div className='container-fluid w-100'>
                            <h4 className='text-center mt-4 mb-4'>Notice</h4>
                            <p style={{ fontSize: "1.2rem" }} className='mb-4'>It is notified that the results of {checkSemesterName(semester?.semester_code)} B.Sc (Engg.) Final Examination (session: {semester?.session}) Department of {checkDepartmentName(dept)} are provisionally published as follows.</p>
                            <p style={{ fontSize: "1.2rem" }}>The University reserves the right to correct or amend the results, if necessary.</p>
                        </div>
                        <h5 className='text-center mb-1 mt-5 fw-bold'>{semester?.department?.toUpperCase()} {checkSemesterName(semester?.semester_code)} B.Sc(Engg.) Final Examination Result</h5>
                        <div className='container-fluid w-100 my-5 py-2'>
                            <Table responsive bordered className='text-center' >
                                {/* <col width="11%" />
                                <col width="30%" />
                                <col width="12%" />
                                <col width="30%" />
                                <col width="8%" />
                                <col width="8%" />
                                <col width="8%" /> */}
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

                                                <td>{x.remarks && <span>{x.remarks}</span>}</td>
                                            }

                                        </tr>)
                                    }
                                </tbody>
                            </Table>
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
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ResultSheetModal;