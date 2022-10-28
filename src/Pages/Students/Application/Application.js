import React from 'react';
import { Accordion, Button } from 'react-bootstrap';
import { MdPendingActions, MdCancel } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
import useAuth from '../../../Hooks/useAuth';
const Application = (props) => {
    //const { subject, teacher, students, status, description } = props?.details;
    const { teacher, student } = useAuth();
    const { applicationDetais } = props;
    console.log('applicationDetais ', applicationDetais);

    return (
        <div className=' mb-3 border shadow-sm  rounded px-5 py-3'>
            <p>{applicationDetais.status}</p>
            <h5 className='mb-2 mb-3'>{props?.details?.subject}</h5>
            {
                student &&
                <h5 className='mb-2 text-primary'>Supervisor: <span className='fw-light text-dark'>{props?.details?.teacher}</span></h5>
            }

            <h5 className='mb-2 text-primary'>Group Members: </h5>
            {
                props?.details?.students?.map(x => <li className='ms-5 text-uppercase'>{x}</li>)

            }
            <h5 className='my-3 '>
                {
                    props?.details?.status === "rejected" &&
                    <>
                        <span className='text-capitalize '>
                            Status: <span className='text-danger'>{props?.details?.status}</span>
                            <MdCancel className=' ms-1 fs-3 text-danger '></MdCancel>
                        </span>
                    </>
                }
                {
                    props?.details?.status === "pending" &&
                    <>
                        <span className='text-capitalize '>
                            Status: <span className='text-warning'>{props?.details?.status}</span>
                            <MdPendingActions className=' ms-1 fs-2 text-warning '></MdPendingActions>
                        </span>
                    </>
                }
                {
                    props?.details?.status === "accepted" &&
                    <>
                        <span className='text-capitalize '>
                            Status: <span className='text-success'>{props?.details?.status}</span>
                            <FcApproval className=' ms-1 fs-2 text-success '></FcApproval>
                        </span>
                    </>
                }

            </h5>

            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Project Description</Accordion.Header>
                    <Accordion.Body>
                        {props?.details?.description}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            {
                teacher &&
                <div className='my-2 text-center'>
                    {
                        props?.details?.status === 'pending' &&
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