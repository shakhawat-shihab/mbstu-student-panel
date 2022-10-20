import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import checkDepartmentName from '../../../Functions/DeptCodeToDeptName';
import checkSemesterName from '../../../Functions/SemesterCodeToSemesterName';
import useAuth from '../../../Hooks/useAuth';
import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';

const CourseTeacherMarksModal = (props) => {
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

                        {
                            allInfo.type === 'theory'
                            &&
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
                                            props?.attendance &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Attendance <br />(10 marks)
                                            </th>
                                        }
                                        {
                                            props?.ct1 &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                CT-1 <br />(20 marks)
                                            </th>
                                        }
                                        {
                                            props?.ct2 &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                CT-2 <br />(20 marks)
                                            </th>
                                        }
                                        {
                                            props?.ct3 &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                CT-3 <br />(20 marks)
                                            </th>
                                        }
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
                                                props?.attendance &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.attendance}</p>
                                                    }
                                                </td>
                                            }
                                            {
                                                props?.ct1 &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.ct1}</p>
                                                    }
                                                </td>
                                            }
                                            {
                                                props?.ct2 &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.ct2}</p>
                                                    }
                                                </td>
                                            }
                                            {
                                                props?.ct3 &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.ct3}</p>
                                                    }
                                                </td>
                                            }
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
                        }
                        {
                            allInfo.type === 'lab'
                            &&
                            <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                {/* <col width="15%" />
                                <col width="30%" />
                                <col width="15%" />
                                <col width="15%" />
                                <col width="15%" /> */}
                                <thead>
                                    <tr style={{ border: "1px solid black" }}>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                        {
                                            props?.labAttendance &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Lab Attendance (15%)
                                            </th>
                                        }
                                        {
                                            props?.labReport &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Lab Report Marks (15%)
                                            </th>
                                        }
                                        {
                                            props?.labQuiz &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Lab Quiz Marks (30%)
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
                                                props?.labAttendance &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.lab_attendance}</p>
                                                    }
                                                </td>
                                            }
                                            {
                                                props?.labReport &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.lab_report}</p>
                                                    }
                                                </td>
                                            }
                                            {
                                                props?.labQuiz &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.lab_quiz}</p>
                                                    }
                                                </td>
                                            }
                                        </tr>)
                                    }
                                </tbody>
                            </Table>
                        }
                        {
                            allInfo.type === 'project' &&
                            <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                {/* <col width="15%" />
                                <col width="40%" />
                                <col width="25%" /> */}
                                <thead>
                                    <tr style={{ border: "1px solid black" }}>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                        {
                                            props?.classPerformanceProject &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Class Performance (70%)
                                            </th>
                                        }

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(allInfo).length !== 0 &&
                                        allInfo?.marks?.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                            <td style={{ border: "1px solid black" }} className='text-uppercase'>
                                                <p>{x?.s_id}</p>
                                            </td>
                                            <td style={{ border: "1px solid black" }}>
                                                <p>{x?.displayName}</p>
                                            </td>
                                            {
                                                props?.classPerformanceProject &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.class_marks_project}</p>
                                                    }
                                                </td>
                                            }

                                        </tr>)
                                    }
                                </tbody>
                            </Table>
                        }
                    </div>
                    <div className='container d-flex justify-content-between ms-2 pe-4'>
                        <div className="w-25">
                            <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                            <p className='text-center'>Signature of the Course Teacher</p>
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

export default CourseTeacherMarksModal;