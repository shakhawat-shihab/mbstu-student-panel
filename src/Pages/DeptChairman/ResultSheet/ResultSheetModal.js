import React from 'react';
import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';
import { Button, Modal, Table } from 'react-bootstrap';
import useAuth from '../../../../Hooks/useAuth';
import checkSemesterName from '../../../../Functions/SemesterCodeToSemesterName';
import checkDepartmentName from '../../../../Functions/DeptCodeToDeptName';


const ResultSheetModal = (props) => {

    const { showModal, setShowModal, studentResult, processedResult, offeredCredit, semester, info, checkGpa } = props;
    const { user } = useAuth();

    // console.log("result semester == ", semester)
    console.log('processed result ==== ', processedResult);

    const handleDownload = () => {
        const selected = document.getElementById('selectedPortion');
        // window.open(invoice);
        // return false;
        html2pdf().from(selected).save(`${info?.data?.semester?.name}_result.pdf`);

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
                        <Button className='float-end me-5 ms-2 download-pdf' variant="primary" onClick={handleDownload}>
                            <span className='text-white ms-2 float-end' >Download Pdf</span>
                            <FaDownload className='float-end mt-1 mb-2' ></FaDownload>
                        </Button>

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="selectedPortion">
                        <div className='container-fluid w-100'>
                            <h4 className='text-center mt-4 mb-4'>Notice</h4>
                            <p style={{ fontSize: "1.2rem" }} className='mb-4'>It is notified that the results of {info?.data?.semester?.name} B.Sc (Engg.) Final Examination (session: {info?.data?.semester?.session}) Department of {checkDepartmentName(user?.department)} are provisionally published as follows.</p>
                            <p style={{ fontSize: "1.2rem" }}>The University reserves the right to correct or amend the results, if necessary.</p>
                        </div>
                        <h5 className='text-center mb-1 mt-5 fw-bold'>{user?.department?.toUpperCase()} {info?.data?.semester?.name} B.Sc(Engg.) Final Examination Result</h5>
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
                                            Credit earned (Out of {offeredCredit} credits)

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

                                        processedResult?.map(x => <tr key={x?.id} style={{ border: "1px solid black" }}>
                                            <td style={{ border: "1px solid black" }}>{x.id.toUpperCase()}</td>
                                            <td style={{ border: "1px solid black" }}>{x.name}</td>
                                            <td style={{ border: "1px solid black" }}>{x.creditEarned}</td>
                                            <td style={{ border: "1px solid black" }}>{x.creditLost + ' '}
                                                (
                                                {
                                                    x?.failedCourses?.map(y => {
                                                        return (<>
                                                            <span>{y.toUpperCase()}</span>
                                                            <span>
                                                                {
                                                                    y != x.failedCourses[x.failedCourses.length - 1]
                                                                    &&
                                                                    `, `
                                                                }
                                                            </span>
                                                        </>)

                                                    })
                                                }
                                                )
                                            </td>
                                            <td style={{ border: "1px solid black" }}>{x.cgpa}</td>
                                            <td style={{ border: "1px solid black" }}>{checkGpa(x.cgpa)}</td>
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