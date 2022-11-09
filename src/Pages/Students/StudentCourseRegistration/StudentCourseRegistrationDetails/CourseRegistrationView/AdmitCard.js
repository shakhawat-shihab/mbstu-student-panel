import React, { useState } from 'react';

import { useEffect } from 'react';

import { Button } from 'react-bootstrap';

import checkDepartmentName from '../../../../../Functions/DeptCodeToDeptName';

import useAuth from '../../../../../Hooks/useAuth';

import mbstuLogo from "../../../../../images/mbstu-logo.jpg"

import './AdmitCard.css'

// import AdmitCardModal from './AdmitCardModal';



const AdmitCard = (props) => {



    const { user } = useAuth();

    const { application } = props;



    const { name, degree, applicantId, applicantName, applicantSession, department,

        applicantHallName, regularCourses, backlogCourses, specialCourses } = application;



    const [profile, setProfile] = useState();

    const [showModal, setShowModal] = useState(false);



    console.log("admit applicationn === ", application);



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

    return (

        <div>

            {/* <div>

                <AdmitCardModal application={application} showModal={showModal} setShowModal={setShowModal} />

            </div> */}



            <div className='container shadow-lg  py-5 px-5 my-4'>



                <h2 className='text-center mb-5' style={{ color: "#3C3FED" }}>Admit Card</h2>



                <div className='row'>

                    <div className='col-lg-2'>

                        <img src={mbstuLogo} alt="mbstu" style={{ width: "90px" }} />

                    </div>

                    <div className="col-lg-8">

                        <h3 className='fw-bold' style={{ wordSpacing: "8px" }}>Mawlana Bhashani Science and Technology University</h3>

                        <p className='text-center'>Santosh, Tangail</p>

                        <h3 className='text-center mb-3'>Admit Card</h3>

                        <h5 className='text-center'>{name} {degree} Final Examination</h5>

                    </div>

                    <div className='col-lg-2'>

                        <img src={profile?.imageURL} alt="myself" style={{ width: "200px", height: "200px" }} />

                    </div>

                </div>



                <div className='d-flex flex-column'>

                    <span style={{ fontSize: "20px" }}><span className="fw-bold">Student ID: </span>{applicantId.toUpperCase()}</span>

                    <span style={{ fontSize: "20px" }}><span className="fw-bold">Session: </span>{applicantSession}</span>

                    <span style={{ fontSize: "20px" }}><span className="fw-bold">Name of the applicant: </span>{applicantName}</span>

                    <span style={{ fontSize: "20px" }}><span className="fw-bold">Name of the Department: </span>{checkDepartmentName(department)}</span>

                    <span style={{ fontSize: "20px" }}><span className="fw-bold">Staring Date of Examination: </span></span>

                    <span style={{ fontSize: "20px" }}><span className="fw-bold">Name of the Hall: </span>{applicantHallName}</span>

                </div>



                <div>

                    {

                        regularCourses?.length !== 0 &&

                        <div className='mt-4 my-2'>

                            <span className='fw-bold' style={{ fontSize: "20px" }}>Regular Courses: </span> <br />

                            <ol>

                                {

                                    regularCourses?.map(x => <li>{x?.courseCode?.toUpperCase()}</li>)

                                }

                            </ol>

                        </div>

                    }

                    {

                        backlogCourses?.length !== 0 &&

                        <div className='mt-4 my-2'>

                            <span className='fw-bold' style={{ fontSize: "20px" }}>Backlog Courses: </span> <br />

                            <ol>

                                {

                                    backlogCourses?.map(x => <li>{x?.courseCode?.toUpperCase()}</li>)

                                }

                            </ol>

                        </div>

                    }

                    {

                        specialCourses?.length !== 0 &&

                        <div className='mt-4 my-2'>

                            <span className='fw-bold' style={{ fontSize: "20px" }}>Special Courses: </span> <br />

                            <ol>

                                {

                                    specialCourses?.map(x => <li>{x?.courseCode?.toUpperCase()}</li>)

                                }

                            </ol>

                        </div>

                    }

                    {

                        specialCourses?.length !== 0 &&

                        <div className='mt-4 my-2'>

                            <span className='fw-bold' style={{ fontSize: "20px" }}>Special Courses: </span> <br />

                            <ol>

                                {

                                    specialCourses?.map(x => <li>{x?.courseCode?.toUpperCase()}</li>)

                                }

                            </ol>

                        </div>

                    }

                    {

                        specialCourses?.length !== 0 &&

                        <div className='mt-4 my-2'>

                            <span className='fw-bold' style={{ fontSize: "20px" }}>Special Courses: </span> <br />

                            <ol>

                                {

                                    specialCourses?.map(x => <li>{x?.courseCode?.toUpperCase()}</li>)

                                }

                            </ol>

                        </div>

                    }

                    {

                        specialCourses?.length !== 0 &&

                        <div className='mt-4 my-2'>

                            <span className='fw-bold' style={{ fontSize: "20px" }}>Special Courses: </span> <br />

                            <ol>

                                {

                                    specialCourses?.map(x => <li>{x?.courseCode?.toUpperCase()}</li>)

                                }

                            </ol>

                        </div>

                    }

                    {

                        specialCourses?.length !== 0 &&

                        <div className='mt-4 my-2'>

                            <span className='fw-bold' style={{ fontSize: "20px" }}>Special Courses: </span> <br />

                            <ol>

                                {

                                    specialCourses?.map(x => <li>{x?.courseCode?.toUpperCase()}</li>)

                                }

                            </ol>

                        </div>

                    }

                    {

                        specialCourses?.length !== 0 &&

                        <div className='mt-4 my-2'>

                            <span className='fw-bold' style={{ fontSize: "20px" }}>Special Courses: </span> <br />

                            <ol>

                                {

                                    specialCourses?.map(x => <li>{x?.courseCode?.toUpperCase()}</li>)

                                }

                            </ol>

                        </div>

                    }

                    {

                        specialCourses?.length !== 0 &&

                        <div className='mt-4 my-2'>

                            <span className='fw-bold' style={{ fontSize: "20px" }}>Special Courses: </span> <br />

                            <ol>

                                {

                                    specialCourses?.map(x => <li>{x?.courseCode?.toUpperCase()}</li>)

                                }

                            </ol>

                        </div>

                    }



                </div>



                <div className='text-center mb-5 mt-5'>

                    <Button variant='primary' className='me-2' onClick={() => setShowModal(true)}>Generate Pdf</Button>

                </div>





            </div>

        </div>

    );

};



export default AdmitCard;