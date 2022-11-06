import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Swal from 'sweetalert2';
// import { FcApproval } from "react-icons/fc"
// import { MdPendingActions } from "react-icons/md"

const DeptChairmanCourseRegistrationDetails = () => {
    const { applicationId } = useParams();
    const history = useHistory();
    const [application, setApplication] = useState({});
    const [comment, setComment] = useState();

    // console.log("My application === ", application);

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
        fetch(`http://localhost:5000/api/v1/course-application/get-application-details/${applicationId}`, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        })
            .then(res => res.json())
            .then(info => {
                console.log("appplication detils === ", info.data);
                setApplication(info.data);
            })
    }, [applicationId])


    const handleApprove = () => {

        const approvedApplication = {};
        approvedApplication.applicationId = application?._id;
        approvedApplication.chairmanMessage = comment;
        approvedApplication.studentProfileId = application?.applicantProfileId;
        approvedApplication.id = application?.applicantId;
        approvedApplication.department = application?.department;

        const regularCourses = [];
        const backlogCourses = [];

        if (application?.regularCourses?.length !== 0) {
            application?.regularCourses?.map(x => regularCourses.push(x?._id));
        }
        if (application?.backlogCourses?.length !== 0) {
            application?.backlogCourses?.map(x => backlogCourses.push(x?._id));
        }

        approvedApplication.regularCourses = regularCourses;
        approvedApplication.backlogCourses = backlogCourses;

        console.log("Application to push === ", approvedApplication);

        fetch('http://localhost:5000/api/v1/course-application/approve-application-by-dept-chairman', {
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
                    history.replace('/dashboard/approve-course-registration-dept')
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
        deniedApplication.chairmanMessage = comment;
        deniedApplication.studentProfileId = application?.applicantProfileId;
        deniedApplication.department = application?.department;

        fetch('http://localhost:5000/api/v1/course-application/deny-application-by-dept-chairman', {
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

                {
                    // application?.status === 'pending' ?
                    //     <h5 className='fw-bold'>Status: <span className="text-warning text-capitalize">{application?.status} <MdPendingActions /></span>  </h5>
                    //     :
                    //     <h5 className='fw-bold'>Status: <span className="text-success text-capitalize">{application?.status} <FcApproval /></span></h5>

                }

                <div className="form-group mb-5 ">
                    {/* <label for="exampleFormControlTextarea1" className='fw-bold'>Write Commment</label> */}
                    <textarea placeholder="Write comment ..." className="form-control" id="exampleFormControlTextarea1" rows="3" onChange={(e) => setComment(e.target.value)}></textarea>
                </div>

                {/* <Button type="button" className="btn btn-success" onClick={handleApprove}>Approve</Button> */}
                <div className='text-center mb-3'>
                    <Button variant='success' className='me-2' onClick={() => { handleApprove() }}>Approve</Button>
                    <Button variant='danger' onClick={() => { handleReject() }} >Reject</Button>
                </div>
            </div>
        </div>
    );
};

export default DeptChairmanCourseRegistrationDetails;