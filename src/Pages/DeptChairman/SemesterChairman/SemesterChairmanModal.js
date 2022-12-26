import React from 'react';
import checkDepartmentName from '../../../Functions/DeptCodeToDeptName';
import useAuth from '../../../Hooks/useAuth';
// import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaDownload } from 'react-icons/fa';
import { Button, Modal, Table } from 'react-bootstrap';

const SemesterChairmanModal = (props) => {
    const { user, dept } = useAuth();
    // const allInfo = props.allInfo;
    const { showModal, setShowModal, course, courseName, courseCode, credit, semesterAllMarks } = props;

    const handleDownload = () => {
        const selected = document.getElementById('selectedPortion');

        const divHeight = selected.clientHeight
        const divWidth = selected.clientWidth
        const ratio = divHeight / divWidth;

        html2canvas(selected, { useCORS: true }, { scale: '5' }).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg');

            const pdfDOC = new jsPDF("l", "mm", "a4");

            const width = pdfDOC.internal.pageSize.getWidth();
            let height = pdfDOC.internal.pageSize.getHeight();

            height = ratio * width;
            pdfDOC.addImage(imgData, 'JPEG', 0, 0, width, height + 30, 'FAST');
            pdfDOC.save(`${courseCode}_marks.pdf`);
        });
        // const selected = document.getElementById('selectedPortion');
        // window.open(invoice);
        // return false;
        // html2pdf().from(selected).save(`${courseCode}_marks.pdf`);

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
                            <p className='text-center fw-bold mb-1'>Department of {checkDepartmentName(dept)}</p>
                        </div>
                        <div className='container'>
                            <div className='my-4 ms-4'>
                                <p><span className='fw-bold'>Course Code: </span>{courseCode}</p>
                                <p><span className='fw-bold'>Course Name: </span>{courseName}</p>
                                <p><span className='fw-bold'>Credit Hour: </span>{credit}</p>
                                {/* <p><span className="fw-bold">Name of the Examiner(s): </span>{user?.displayName}</p> */}
                            </div>
                        </div>
                        {
                            courseCode &&
                            semesterAllMarks[`${courseCode}_type`] === 'theory'
                            &&
                            <div className='container'>
                                <div className='container rounded  my-5 ' >
                                    <div className='p-3 '>
                                        <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                            <thead>
                                                <tr style={{ border: "1px solid black" }}>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>CT & Attendance (30%)</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Course Teacher </th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Second Examiner </th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Third Examiner </th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Final Marks (70%)</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Total Marks (100%)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    course.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                        <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.s_id}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.displayName}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.thirtyPercent}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.course_teacher_marks}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.second_examiner_marks}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.third_examiner_marks}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.final_marks}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.total_marks}</td>
                                                    </tr>)
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            courseCode &&
                            semesterAllMarks[`${courseCode}_type`] === 'lab'
                            &&
                            <div className='container'>
                                <div className='container-fluid rounded  my-5 ' >
                                    <div className='p-3 '>
                                        <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                            <thead>
                                                <tr style={{ border: "1px solid black" }}>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Marks (60%)</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Experiment Marks (40%)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    course.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                        <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.s_id}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.displayName}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.class_marks_lab}</td>
                                                        <td title={x?.experiment_marks_lab_by} style={{ border: "1px solid black" }}>{x?.experiment_marks_lab}</td>
                                                    </tr>)
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            courseCode &&
                            semesterAllMarks[`${courseCode}_type`] === 'project'
                            &&
                            <div className='container'>
                                <div className='container-fluid rounded  my-5 ' >
                                    <div className='p-3 '>
                                        <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                            <thead>
                                                <tr style={{ border: "1px solid black" }}>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Performance (70%)</th>
                                                    <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Presentation and Viva (30%)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    course.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                        <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.s_id}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.displayName}</td>
                                                        <td style={{ border: "1px solid black" }}>{x?.class_marks_project}</td>
                                                        <td title={x?.presentation_marks_project_by} style={{ border: "1px solid black" }}>{x?.presentation_marks_project}</td>
                                                    </tr>)
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>

                        }

                    </div>
                    <div className="ms-5 ps-3 w-25">
                        <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                        <p className='text-center'>Signature of the Chairman</p>
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

export default SemesterChairmanModal;