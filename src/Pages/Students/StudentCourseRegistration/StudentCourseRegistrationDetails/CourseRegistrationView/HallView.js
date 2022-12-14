import React from 'react';
import { Form, Table } from 'react-bootstrap';
import { MdPendingActions, MdOutlineVerified, MdOutlineReportGmailerrorred } from 'react-icons/md';

const HallView = (props) => {
    const { application } = props;
    return (
        <div>
            {
                application?.isHallVerified || application?.hallMessage
                    ?
                    <div className='container shadow-lg py-4 px-5 my-4 rounded'>
                        <h2 className='text-center mb-5 fw-bold' style={{ color: "#3C3FED" }}>Hall Provost Approval</h2>
                        <div className='mt-3 d-flex justify-content-between'>
                            <h3 className='fw-bold text-center mb-1'>{application?.name}</h3>
                            {
                                application?.status === 'pending'
                                &&
                                <h5 className='fw-bold float-end text-capitalize text-warning'>

                                    <span className=" fs-2 me-2">
                                        <MdPendingActions />
                                    </span>
                                    {application?.status}
                                </h5>
                            }
                            {
                                application?.status === 'successfull'
                                &&
                                <h5 className='fw-bold float-end text-capitalize text-success'>
                                    <span className=" fs-2 me-2">
                                        <MdOutlineVerified />
                                    </span>
                                    {application?.status}


                                </h5>
                            }
                            {
                                application?.status?.includes("denied")
                                &&
                                <h5 className='fw-bold float-end text-capitalize text-danger'>
                                    <span className=" fs-2 me-2">
                                        <MdOutlineReportGmailerrorred />
                                    </span>
                                    {application?.status}
                                </h5>
                            }
                        </div>

                        <div className='d-flex flex-column'>
                            <span style={{ fontSize: "20px" }}><span className="fw-bold">Name: </span>{application?.applicantName}</span>
                            <span style={{ fontSize: "20px" }} className="text-uppercase"><span className="fw-bold">ID: </span>{application?.applicantId}</span>
                            <span style={{ fontSize: "20px" }}><span className="fw-bold">Session: </span>{application?.applicantSession}</span>
                            <span style={{ fontSize: "20px" }}><span className="fw-bold">Hall: </span>{application?.applicantHallName}</span>
                        </div>


                        {
                            (application?.regularCourses && application?.regularCourses?.length !== 0)
                            &&
                            <div className='mt-4'>
                                <h5 className="fw-bold">Regular Courses:</h5>
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
                            <div className=''>
                                <h5 className="fw-bold">Backlog Courses:</h5>
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
                            application?.hallMessage != undefined &&
                            <div className="my-3" style={{ fontSize: "20px" }}>
                                <span className="fw-bold" style={{ color: "#3C3FED" }}>Hall Provost message: </span> <br />
                                <Form.Group className="mb-3 mt-2" controlId="exampleForm.ControlTextarea1">
                                    <Form.Control as="textarea" rows={3} value={application?.hallMessage} style={{ fontStyle: "italic", fontSize: "20px" }} />
                                </Form.Group>
                            </div>
                        }

                    </div>
                    :
                    <div className=' d-flex justify-content-center align-items-center half-height' >
                        <h5 className='text-center fs-2 text-secondary my-4 fw-bold error-opacity' >Hall Provost has not approved this application yet</h5>
                    </div>
            }


        </div>
    );
};

export default HallView;