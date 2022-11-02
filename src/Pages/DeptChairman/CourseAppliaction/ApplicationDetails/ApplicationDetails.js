import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FcApproval } from "react-icons/fc"
import { MdPendingActions } from "react-icons/md"

const ApplicationDetails = () => {
    const { applicationId } = useParams();

    const [application, setApplication] = useState({});


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
        //call api to approve an application

    }


    return (
        <div className='p-3'>
            <div className='container shadow-lg p-3'>
                <h4 className='fw-bold text-center mb-5'>{application?.name}</h4>
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
                    application?.status === 'pending' ?
                        <h5 className='fw-bold'>Status: <span className="text-warning text-capitalize">{application?.status} <MdPendingActions /></span>  </h5>
                        :
                        <h5 className='fw-bold'>Status: <span className="text-success text-capitalize">{application?.status} <FcApproval /></span></h5>

                }
                <br />
                <Button type="button" className="btn btn-success" onClick={handleApprove}>Approve</Button>
            </div>
        </div>
    );
};

export default ApplicationDetails;