import React, { useState } from 'react';
import { Accordion, Button } from 'react-bootstrap';
import { MdPendingActions, MdCancel } from "react-icons/md";
import { FcApproval } from "react-icons/fc";
import { AiOutlineDisconnect } from "react-icons/ai";
import useAuth from '../../../Hooks/useAuth';
import Swal from 'sweetalert2';

const Application = (props) => {
    //const { subject, teacher, students, status, description } = props?.details;

    console.log("appliication props === ", props)
    const { user } = useAuth();
    const { applicationDetails } = props;
    console.log('applicationDetails ', applicationDetails);

    // console.log("application props ==== ", props);

    // const [status, setStatus] = useState('pending')
    const proposalId = applicationDetails?._id;

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

    const handleAccept = () => {
        // setStatus('accepted');
        // applicationDetails.status = status;
        Swal.fire({
            title: 'Do you want to accept the proposal?',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            confirmButtonColor: 'green',
            icon: 'warning',
            cancelButtonText: 'No, cancel!',
            cancelButtonColor: 'red'

        })
            .then((result) => {
                if (result.isConfirmed) {
                    // Swal.fire('Saved!', '', 'success')
                    fetch(`http://localhost:5000/api/v1/project-application/approve-proposal/${proposalId}`, {
                        method: 'put',
                        headers: {
                            'Content-type': 'application/json',
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
                        },
                        body: JSON.stringify(applicationDetails)
                    })
                        .then(res => res.json())
                        .then(info => {
                            console.log('info ', info)
                            if (info.status === 'success') {
                                Toast.fire({
                                    icon: 'success',
                                    title: info.message
                                })
                            }
                            else {
                                Toast.fire({
                                    icon: 'error',
                                    title: info.message
                                })
                            }
                        })
                }
            })
    }

    return (
        <div>
            <div className=' mb-3 px-5 py-3'>
                {/* <p>{applicationDetails.status}</p> */}
                {
                    user?.isStudent &&
                    <div>
                        <hr className="fs-1 mb-5" style={{ border: "4px dotted #000", borderStyle: "none none dotted", color: "#000", backgroundColor: "#000" }} />
                        <div className='ps-2'>
                            <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Course Title: </span>{applicationDetails?.courseTitle}</p>
                            <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Course Code: </span>{applicationDetails?.courseCode.toUpperCase()}</p>
                            <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Project Title: </span>{applicationDetails?.projectApplicationTitle}</p>
                            <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Supervisor: </span>{applicationDetails?.teacher?.name}</p>

                            <br />

                            <p className='my-3 ' style={{ fontSize: "20px" }}>
                                {
                                    applicationDetails?.status === "denied" &&
                                    <>
                                        <span className='text-capitalize '>
                                            <span className="fw-bold">Status: </span>
                                            <span className='text-danger'>{applicationDetails?.status}</span>
                                            <MdCancel className=' ms-1 fs-3 text-danger '></MdCancel>
                                        </span>
                                    </>
                                }
                                {
                                    applicationDetails?.status === "pending" &&
                                    <>
                                        <span className='text-capitalize '>
                                            <span className="fw-bold">Status: </span>
                                            <span className='text-warning'>{applicationDetails?.status}</span>
                                            <MdPendingActions className=' ms-1 fs-2 text-warning '></MdPendingActions>
                                        </span>
                                    </>
                                }
                                {
                                    applicationDetails?.status === "accepted" &&
                                    <>
                                        <span className='text-capitalize '>
                                            <span className="fw-bold">Status: </span>
                                            <span className='text-success'>{applicationDetails?.status}</span>
                                            <FcApproval className=' ms-1 fs-2 text-success '></FcApproval>
                                        </span>
                                    </>
                                }
                                {
                                    applicationDetails?.status === "discontinued" &&
                                    <>
                                        <span className='text-capitalize '>
                                            <span className="fw-bold">Status: </span>
                                            <span className='text-danger'>{applicationDetails?.status}</span>
                                            <AiOutlineDisconnect className=' ms-1 fs-2 text-warning ' />
                                        </span>
                                    </>
                                }

                            </p>
                        </div>
                    </div>


                }

                {user?.isTeacher &&
                    <div>
                        <hr className="fs-1 mb-5" style={{ border: "4px dotted #000", borderStyle: "none none dotted", color: "#000", backgroundColor: "#000" }} />
                        <div className='ps-2'>

                            <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Course Title: </span>{applicationDetails?.courseTitle}</p>
                            <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Course Code: </span>{applicationDetails?.courseCode.toUpperCase()}</p>
                            <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Project Title: </span>{applicationDetails?.projectApplicationTitle}</p>
                            <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Supervisor: </span>{applicationDetails?.teacher?.name}</p>

                            <br />


                            <div className="accordion " id="accordionExample">
                                <div className="accordion-item border-0 mb-4">
                                    <div className="border border-2 rounded-3">
                                        <h2 className="accordion-header" id="headingTwo">
                                            <button className="accordion-button collapsed fs-5" type="button"
                                                data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false"
                                                aria-controls="collapseTwo">
                                                How can I tell if my helmet is old and I need a new one?
                                            </button>
                                        </h2>
                                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo"
                                            data-bs-parent="#accordionExample">
                                            <div className="accordion-body text-black-50">
                                                Bear in mind that if the helmet did its job most people would tell you that they
                                                did not even hit their head, or did not hit their head that hard. And the thin
                                                shells on most helmets now tend to hide any dents in the foam. But if you can
                                                see marks on the shell or measure any foam crush at all, replace the helmet.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className='mt-5 pt-3 mb-2 text-center'>

                                <>
                                    <Button variant='success' onClick={() => {
                                        //  handleAdd(props?.details)
                                        handleAccept()
                                    }}> Accept </Button>
                                    <Button variant='danger' className='ms-2' onClick={() => {
                                        //  handleAdd(props?.details)
                                        props?.handleReject(props?.details)
                                    }}> Reject </Button>
                                </>

                            </div>
                        </div>
                        {/* <hr className="fs-1 mb-5" style={{ border: "4px dotted #000", borderStyle: "none none dotted", color: "#000", backgroundColor: "#000" }} /> */}
                    </div>
                }

                {/* <Fun /> */}
                {/* <Example /> */}

            </div>
        </div>
    );
};

export default Application;