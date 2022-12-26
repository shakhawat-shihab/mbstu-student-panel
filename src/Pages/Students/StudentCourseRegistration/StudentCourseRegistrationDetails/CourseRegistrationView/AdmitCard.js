import React, { useState } from 'react';
import { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import checkDepartmentName from '../../../../../Functions/DeptCodeToDeptName';
import mbstuLogo from "../../../../../images/mbstu-logo.jpg"
import './AdmitCard.css'
import AdmitCardModal from './AdmitCardModal';

const AdmitCard = (props) => {

    const { application } = props;

    const { name, degree, applicantId, applicantName, applicantSession, department,
        applicantHallName, regularCourses, backlogCourses, specialCourses } = application;

    const [profile, setProfile] = useState();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch("https://mbstu-panel-server.onrender.com/api/v1/profile", {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        })
            .then(res => res.json())
            .then(info => {
                setProfile(info?.data);
            })
    }, [])

    return (
        <div>
            <div>
                <AdmitCardModal application={application} showModal={showModal} setShowModal={setShowModal} />
            </div>

            {application?.isAcademicCommitteeVerified == true
                ?
                <div className='container shadow-lg  py-5 px-5'>

                    <h2 className='text-center mb-5 me-5' style={{ color: "#3C3FED" }}>Admit Card</h2>

                    <div className='px-4'>
                        <div className='row'>
                            <div className='col-lg-1 mt-2'>
                                <img src={mbstuLogo} alt="mbstu" style={{ width: "140px" }} />
                            </div>
                            <div className="col-lg-9  mt-2 font-style-work-sans">
                                <h3 className='fw-bold text-center' style={{ fontSize: "22px" }}>Mawlana Bhashani Science and Technology University</h3>
                                <p className='text-center'>Santosh, Tangail</p>
                                <h3 className='text-center mb-3'>Admit Card</h3>
                                <h5 className='text-center'>{name} {degree} Final Examination</h5>
                            </div>
                            <div className='col-lg-2'>
                                <img src={profile?.imageURL} alt="myself" style={{ width: "170px", height: "170px" }} />
                            </div>
                        </div>

                        <div className='d-flex flex-column mb-3 mt-3'>
                            <span style={{ fontSize: "16px" }}><span className="fw-bold">Student ID: </span>{applicantId.toUpperCase()}</span>
                            <span style={{ fontSize: "16px" }}><span className="fw-bold">Session: </span>{applicantSession}</span>
                            <span style={{ fontSize: "16px" }}><span className="fw-bold">Name of the applicant: </span>{applicantName}</span>

                        </div>

                        <div className='d-flex flex-column mb-3'>
                            <span style={{ fontSize: "16px" }}><span className="fw-bold">Name of the Department: </span>{checkDepartmentName(department)}</span>
                            <span style={{ fontSize: "16px" }}><span className="fw-bold">Staring Date of Examination: </span></span>
                            <span style={{ fontSize: "16px" }}><span className="fw-bold">Name of the Hall: </span>{applicantHallName}</span>
                        </div>

                        <div>
                            {
                                regularCourses?.length !== 0 &&
                                <div className='my-2'>
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

                            <div className="mt-5 pe-3 d-flex flex-row-reverse">
                                <div>
                                    <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                                    <p className='text-center'>Conroller of Examinations</p>
                                </div>


                            </div>


                        </div>
                    </div>

                    <div className='text-center mb-5 mt-5'>
                        <Button variant='primary' className='me-2' onClick={() => setShowModal(true)}>Generate Pdf</Button>
                    </div>
                </div>
                :
                <div className=' d-flex justify-content-center align-items-center half-height' >
                    <h5 className='text-center fs-2 text-secondary my-4 fw-bold error-opacity' >Admit Card is not issued yet</h5>
                </div>
            }
        </div>
    );
};

export default AdmitCard;