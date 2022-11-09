import React from 'react';
import { FaDownload } from 'react-icons/fa';
import { Button, Modal, Table } from 'react-bootstrap';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
// import html2pdf from 'html2pdf.js';
import { useEffect } from 'react';
import { useState } from 'react';
import checkDepartmentName from '../../../../../Functions/DeptCodeToDeptName';
import mbstuLogo from "../../../../../images/mbstu-logo.jpg"

const AdmitCardModal = (props) => {
    const { application, showModal, setShowModal } = props;

    const { name, degree, applicantId, applicantName, applicantSession, department,
        applicantHallName, regularCourses, backlogCourses, specialCourses } = application;

    const [profile, setProfile] = useState();

    useEffect(() => {
        fetch("http://localhost:5000/api/v1/profile", {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        })
            .then(res => res.json())
            .then(info => {
                console.log("profile info == ", info)
                setProfile(info?.data);
            })
    }, [])

    const handleDownload = () => {
        const selected = document.getElementById('selectedPortion');
        const divHeight = selected.clientHeight
        const divWidth = selected.clientWidth
        const ratio = divHeight / divWidth;

        html2canvas(selected, { scale: '5' }).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg');
            const pdfDOC = new jsPDF("l", "mm", "a4"); //  use a4 for smaller page
            const width = pdfDOC.internal.pageSize.getWidth();
            let height = pdfDOC.internal.pageSize.getHeight();
            height = ratio * width;
            // console.log(height, width, ratio)
            pdfDOC.addImage(imgData, 'JPEG', 0, 0, width, height, 'FAST');
            pdfDOC.save("admit-card.pdf");   //Download the rendered PDF.
        });
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
                    <div id="selectedPortion" className='pt-5 px-3 font-style-work-sans'>
                        <div className='px-4'>
                            <div className='row'>
                                <div className='col-lg-1 mt-2'>
                                    <img src={mbstuLogo} alt="mbstu" style={{ width: "100px" }} />
                                </div>
                                <div className="col-lg-9 ps-4 mt-2 font-style-work-sans">
                                    <h4 className='fw-bold text-center'>Mawlana Bhashani Science and Technology University</h4>
                                    <p className='text-center'>Santosh, Tangail</p>
                                    <h3 className='text-center mb-3 fw-bold'>Admit Card</h3>
                                    <h5 className='text-center'>{name} {degree} Final Examination</h5>
                                </div>
                                <div className='col-lg-2'>
                                    <img src={profile?.imageURL} alt="myself" style={{ width: "170px", height: "170px" }} />
                                </div>
                            </div>

                            <div className='d-flex flex-column mb-3 ps-3'>
                                <span style={{ fontSize: "16px" }}><span className="fw-bold">Student ID: </span>{applicantId.toUpperCase()}</span>
                                <span style={{ fontSize: "16px" }}><span className="fw-bold">Session: </span>{applicantSession}</span>
                                <span style={{ fontSize: "16px" }}><span className="fw-bold">Name of the applicant: </span>{applicantName}</span>

                            </div>

                            <div className='d-flex flex-column mb-3 ps-3'>
                                <span style={{ fontSize: "16px" }}><span className="fw-bold">Name of the Department: </span>{checkDepartmentName(department)}</span>
                                <span style={{ fontSize: "16px" }}><span className="fw-bold">Staring Date of Examination: </span></span>
                                <span style={{ fontSize: "16px" }}><span className="fw-bold">Name of the Hall: </span>{applicantHallName}</span>
                            </div>

                            <div className='ps-3'>
                                {
                                    regularCourses?.length !== 0 &&
                                    <div className='my-3'>
                                        <span className='fw-bold' style={{ fontSize: "16px" }}>Regular Courses: </span> <br />
                                        <ol>
                                            {
                                                regularCourses?.map(x => <li>{x?.courseCode?.toUpperCase()}</li>)
                                            }
                                        </ol>
                                    </div>
                                }
                                {
                                    backlogCourses?.length !== 0 &&
                                    <div className='my-2'>
                                        <span className='fw-bold' style={{ fontSize: "16px" }}>Backlog Courses: </span> <br />
                                        <ol>
                                            {
                                                backlogCourses?.map(x => <li>{x?.courseCode?.toUpperCase()}</li>)
                                            }
                                        </ol>
                                    </div>
                                }
                                {
                                    specialCourses?.length !== 0 &&
                                    <div className='my-2'>
                                        <span className='fw-bold' style={{ fontSize: "16px" }}>Special Courses: </span> <br />
                                        <ol>
                                            {
                                                specialCourses?.map(x => <li>{x?.courseCode?.toUpperCase()}</li>)
                                            }
                                        </ol>
                                    </div>
                                }

                                <div className="ms-5 mt-5 ps-3  d-flex flex-row-reverse">
                                    <div>
                                        <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                                        <p className='text-center'>Conroller of Examinations</p>
                                    </div>


                                </div>


                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

        </div>
    );
};

export default AdmitCardModal;