import React from 'react';
import { Accordion, Button } from 'react-bootstrap';
import { MdPendingActions, MdCancel } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
import { AiOutlineDisconnect } from "react-icons/ai";
import useAuth from '../../../Hooks/useAuth';
const Application = (props) => {
    //const { subject, teacher, students, status, description } = props?.details;
    const { user } = useAuth();
    const { applicationDetais } = props;
    console.log('applicationDetais ', applicationDetais);

    return (
        <div className=' mb-3 border border border-3 rounded  rounded px-5 py-3'>
            {/* <p>{applicationDetais.status}</p> */}
            {
                user?.isStudent &&
                <div>
                    <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Course Title: </span>{applicationDetais?.courseTitle}</p>
                    <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Course Code: </span>{applicationDetais?.courseCode.toUpperCase()}</p>
                    <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Project Title: </span>{applicationDetais?.projectApplicationTitle}</p>
                    <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Supervisor: </span>{applicationDetais?.teacher?.name}</p>

                    <br />

                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header style={{ fontSize: "20px" }}>Project Description</Accordion.Header>
                            <Accordion.Body>
                                {applicationDetais?.projectApplicationDescription}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <br />

                    <p className='my-3 ' style={{ fontSize: "20px" }}>
                        {
                            applicationDetais?.status === "denied" &&
                            <>
                                <span className='text-capitalize '>
                                    <span className="fw-bold">Status: </span>
                                    <span className='text-danger'>{applicationDetais?.status}</span>
                                    <MdCancel className=' ms-1 fs-3 text-danger '></MdCancel>
                                </span>
                            </>
                        }
                        {
                            applicationDetais?.status === "pending" &&
                            <>
                                <span className='text-capitalize '>
                                    <span className="fw-bold">Status: </span>
                                    <span className='text-warning'>{applicationDetais?.status}</span>
                                    <MdPendingActions className=' ms-1 fs-2 text-warning '></MdPendingActions>
                                </span>
                            </>
                        }
                        {
                            applicationDetais?.status === "accepted" &&
                            <>
                                <span className='text-capitalize '>
                                    <span className="fw-bold">Status: </span>
                                    <span className='text-success'>{applicationDetais?.status}</span>
                                    <FcApproval className=' ms-1 fs-2 text-success '></FcApproval>
                                </span>
                            </>
                        }
                        {
                            applicationDetais?.status === "discontinued" &&
                            <>
                                <span className='text-capitalize '>
                                    <span className="fw-bold">Status: </span>
                                    <span className='text-danger'>{applicationDetais?.status}</span>
                                    <AiOutlineDisconnect className=' ms-1 fs-2 text-warning ' />
                                </span>
                            </>
                        }

                    </p>
                </div>

            }


            {
                user?.isTeacher &&
                <div className='my-2 text-center'>
                    {
                        applicationDetais?.status === 'pending' &&
                        <>
                            <Button variant='success' onClick={() => {
                                //  handleAdd(props?.details)
                                props?.handleAccept(props?.details)
                            }}> Accept </Button>
                            <Button variant='warning' className='ms-2' onClick={() => {
                                //  handleAdd(props?.details)
                                props?.handleReject(props?.details)
                            }}> Reject </Button>
                        </>
                    }

                </div>
            }
        </div>
    );
};

export default Application;