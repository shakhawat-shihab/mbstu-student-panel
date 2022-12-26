import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

const AcademicCommitteeCourseRegistrationDetails = () => {
    const { applicationId } = useParams();
    const history = useHistory();
    const [application, setApplication] = useState({});
    const [comment, setComment] = useState('');
    const [transactionDate, setTransactionDate] = useState();

    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })




    useEffect(() => {
        fetch(`https://mbstu-panel-server.onrender.com/api/v1/course-application/get-application-details/${applicationId}`, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        })
            .then(res => res.json())
            .then(info => {
                console.log('info  ', info);
                if (info?.data?.paymentId?.tran_date) {
                    const d = new Date(info?.data?.paymentId?.tran_date);
                    const dformat = [d.getMonth() + 1,
                    d.getDate(),
                    d.getFullYear()].join('/') + ' ' +
                        [d.getHours(),
                        d.getMinutes(),
                        d.getSeconds()].join(':');
                    setTransactionDate(dformat)

                }
                setApplication(info.data);
            })
    }, [applicationId])

    // console.log("academic-application == ", application);


    const handleApprove = () => {

        const approvedApplication = {};
        approvedApplication.applicationId = application?._id;
        approvedApplication.academicCommitteeMessage = comment;
        approvedApplication.studentProfileId = application?.applicantProfileId;
        approvedApplication.id = application?.applicantId;
        approvedApplication.department = application?.department;

        const courses = [];

        if (application?.regularCourses?.length !== 0) {
            application?.regularCourses?.map(x => courses.push(x?._id));
        }
        if (application?.backlogCourses?.length !== 0) {
            application?.backlogCourses?.map(x => courses.push(x?._id));
        }

        approvedApplication.courses = courses;


        // console.log("Application to push === ", approvedApplication);

        fetch('https://mbstu-panel-server.onrender.com/api/v1/course-application/approve-application-by-academic-section', {
            method: 'put',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
            body: JSON.stringify(approvedApplication)
        })
            .then(res => res.json())
            .then(data => {
                // console.log("data ", data);
                if (data?.status === 'success') {
                    Toast.fire({
                        icon: 'success',
                        title: data.message
                    })
                    history.replace('/dashboard/approve-course-registration-academic')
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: data.message
                    })
                }
            });


    }
    const handleReject = () => {

        const deniedApplication = {};

        deniedApplication.applicationId = application?._id;
        deniedApplication.academicCommitteeMessage = comment.trim() || 'rejected';
        deniedApplication.studentProfileId = application?.applicantProfileId;
        deniedApplication.department = application?.department;

        console.log("Application to push === ", deniedApplication);

        fetch('https://mbstu-panel-server.onrender.com/api/v1/course-application/deny-application-by-academic-section', {
            method: 'put',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
            body: JSON.stringify(deniedApplication)
        })
            .then(res => res.json())
            .then(data => {
                // console.log("data ", data);
                if (data?.status === 'success') {
                    Toast.fire({
                        icon: 'success',
                        title: data.message
                    })
                    history.replace('/dashboard/approve-course-registration-academic')
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: data.message
                    })
                }
            });



    }

    // console.log("Comment === ", comment);


    return (
        <div className='p-3'>
            <div className='container shadow-lg p-3'>

                <h3 className='fw-bold text-center mb-5'>{application?.name}</h3>
                <p style={{ fontSize: "20px" }}><span className="fw-bold">Name: </span>{application?.applicantName}</p>
                <p style={{ fontSize: "20px" }} className="text-uppercase"><span className="fw-bold">ID: </span>{application?.applicantId}</p>
                <p style={{ fontSize: "20px" }}><span className="fw-bold">Session: </span>{application?.applicantSession}</p>
                <p style={{ fontSize: "20px" }}><span className="fw-bold">Hall: </span>{application?.applicantHallName}</p> <br />
                {
                    (application?.regularCourses && application?.regularCourses?.length !== 0)
                    &&
                    <div>
                        <h5 className="fw-bold">Regular Courses:</h5><br />
                        <Table responsive striped bordered hover style={{ border: "1px solid black" }}>
                            <col width="15%" />
                            <col width="40%" />
                            <col width="10%" />

                            <thead>
                                <tr className='text-center' style={{ border: "1px solid black" }}>
                                    <th style={{ border: "1px solid black", fontSize: "20px" }}>Course Code</th>
                                    <th style={{ border: "1px solid black", fontSize: "20px" }}>Course Title</th>
                                    <th style={{ border: "1px solid black", fontSize: "20px" }}>Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    application?.regularCourses?.map(x => {
                                        return (
                                            <tr key={`${x.courseCode}`} className='text-center' style={{ border: "1px solid black" }}>
                                                <td className="text-uppercase" style={{ border: "1px solid black", fontSize: "20px" }}>{x?.courseCode}</td>
                                                <td style={{ border: "1px solid black", fontSize: "20px" }}>{x?.courseTitle}</td>
                                                <td style={{ border: "1px solid black", fontSize: "20px" }}>{x?.credit}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>

                        </Table>
                    </div>
                }

                <br />

                {
                    (application?.backlogCourses && application?.backlogCourses?.length !== 0)
                    &&
                    <div>
                        <h5 className="fw-bold">Backlog Courses:</h5> <br />
                        <Table responsive striped bordered hover style={{ border: "1px solid black" }}>
                            <col width="15%" />
                            <col width="40%" />
                            <col width="10%" />

                            <thead>
                                <tr className='text-center' style={{ border: "1px solid black" }}>
                                    <th style={{ border: "1px solid black", fontSize: "20px" }}>Course Code</th>
                                    <th style={{ border: "1px solid black", fontSize: "20px" }}>Course Title</th>
                                    <th style={{ border: "1px solid black", fontSize: "20px" }}>Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    application?.backlogCourses?.map(x => {
                                        return (
                                            <tr key={`${x.courseCode}`} className='text-center' style={{ border: "1px solid black" }}>
                                                <td className="text-uppercase" style={{ border: "1px solid black", fontSize: "20px" }}>{x?.courseCode}</td>
                                                <td style={{ border: "1px solid black", fontSize: "20px" }}>{x?.courseTitle}</td>
                                                <td style={{ border: "1px solid black", fontSize: "20px" }}>{x?.credit}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>

                        </Table>
                    </div>
                }

                <br />

                {
                    (application?.specialCourses && application?.specialCourses?.length !== 0)
                    &&
                    <div>
                        <h5 className="fw-bold">Special Courses:</h5>
                        <Table responsive striped bordered hover style={{ border: "1px solid black" }}>
                            <col width="15%" />
                            <col width="40%" />
                            <col width="10%" />

                            <thead>
                                <tr className='text-center' style={{ border: "1px solid black" }}>
                                    <th style={{ border: "1px solid black", fontSize: "20px" }}>Course Code</th>
                                    <th style={{ border: "1px solid black", fontSize: "20px" }}>Course Title</th>
                                    <th style={{ border: "1px solid black", fontSize: "20px" }}>Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    application?.specialCourses?.map(x => {
                                        return (
                                            <tr key={`${x.courseCode}`} className='text-center' style={{ border: "1px solid black" }}>
                                                <td className="text-uppercase" style={{ border: "1px solid black", fontSize: "20px" }}>{x?.courseCode}</td>
                                                <td style={{ border: "1px solid black", fontSize: "20px" }}>{x?.courseTitle}</td>
                                                <td style={{ border: "1px solid black", fontSize: "20px" }}>{x?.credit}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>

                        </Table>
                    </div>
                }


                <br />

                {
                    (application?.isPaid)
                    &&
                    <div>
                        <h5 className="fw-bold">Payment Info:</h5>
                        <Table responsive striped bordered hover style={{ border: "1px solid black" }}>

                            <tbody>
                                <tr className='text-center' style={{ border: "1px solid black" }}>
                                    <td style={{ border: "1px solid black", fontSize: "20px" }}>Card Brand</td>
                                    <td className="text-uppercase" style={{ border: "1px solid black", fontSize: "20px" }}>{application?.paymentId?.card_brand}</td>
                                </tr>
                                <tr className='text-center' style={{ border: "1px solid black" }}>
                                    <td style={{ border: "1px solid black", fontSize: "20px" }}>Card Issuer</td>
                                    <td style={{ border: "1px solid black", fontSize: "20px" }}>{application?.paymentId?.card_issuer}</td>
                                </tr>
                                <tr className='text-center' style={{ border: "1px solid black" }}>
                                    <td style={{ border: "1px solid black", fontSize: "20px" }}>Amount</td>
                                    <td className="text-uppercase" style={{ border: "1px solid black", fontSize: "20px" }}>{application?.paymentId?.amount}</td>
                                </tr>
                                <tr className='text-center' style={{ border: "1px solid black" }}>
                                    <td style={{ border: "1px solid black", fontSize: "20px" }}>Cuurency</td>
                                    <td className="text-uppercase" style={{ border: "1px solid black", fontSize: "20px" }}>{application?.paymentId?.currency}</td>
                                </tr>
                                <tr className='text-center' style={{ border: "1px solid black" }}>
                                    <td style={{ border: "1px solid black", fontSize: "20px" }}>Transaction Id</td>
                                    <td className="text-uppercase" style={{ border: "1px solid black", fontSize: "20px" }}>{application?.paymentId?.tran_id}</td>
                                </tr>
                                <tr className='text-center' style={{ border: "1px solid black" }}>
                                    <td style={{ border: "1px solid black", fontSize: "20px" }}>Transaction Time</td>
                                    <td className="text-uppercase" style={{ border: "1px solid black", fontSize: "20px" }}>{transactionDate}</td>
                                </tr>
                            </tbody>

                        </Table>
                    </div>
                }


                <div className="form-group mb-5 ">
                    {/* <label for="exampleFormControlTextarea1" className='fw-bold'>Write Commment</label> */}
                    <textarea placeholder="Write comment ..." className="form-control" id="exampleFormControlTextarea1" rows="3" onChange={(e) => setComment(e.target.value)}></textarea>
                </div>

                {
                    !application?.isAcademicCommitteeVerified && application?.status === 'pending'
                    &&
                    <div className='text-center mb-3'>
                        <Button variant='success' className='me-2' onClick={() => { handleApprove() }}>Approve</Button>
                        <Button variant='danger' onClick={() => { handleReject() }} >Reject</Button>
                    </div>
                }

            </div>
        </div>
    );
};

export default AcademicCommitteeCourseRegistrationDetails;