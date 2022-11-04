import React from 'react';
import { Accordion, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

const TeacherProjectApplication = (props) => {
    // const { user } = useAuth();
    const { applicationDetails, setProposalState, proposalState } = props;
    console.log('applicationDetails ====> ', applicationDetails);

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
        setProposalState(!proposalState)
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
                        }
                        // body: JSON.stringify(applicationDetails)
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

    const handleReject = () => {
        Swal.fire({
            title: 'Do you want to reject the proposal?',
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
                    fetch(`http://localhost:5000/api/v1/project-application/deny-proposal/${proposalId}`, {
                        method: 'put',
                        headers: {
                            'Content-type': 'application/json',
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
                        },
                        // body: JSON.stringify(applicationDetails)
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
                            setProposalState(!proposalState)
                        })
                }
            })
    }
    return (
        <div>
            <div className='ps-2'>

                <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Applicant Name: </span>{applicationDetails?.applicantName}</p>
                <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Appliicant ID: </span>{applicationDetails?.applicantId?.toUpperCase()}</p>
                <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Course Title: </span>{applicationDetails?.courseTitle}</p>
                <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Course Code: </span>{applicationDetails?.courseCode?.toUpperCase()}</p>
                <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Project Title: </span>{applicationDetails?.projectApplicationTitle}</p>
                <p className='mb-2' style={{ fontSize: "20px" }}><span className='fw-bold'>Supervisor: </span>{applicationDetails?.teacher?.name}</p>

                <br />

                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>{applicationDetails?.projectApplicationTitle}</Accordion.Header>
                        <Accordion.Body>
                            {
                                applicationDetails?.projectApplicationDescription
                            }
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>


                <div className='mt-5 pt-3 mb-5 text-center'>

                    <>
                        <Button variant='success' onClick={() => { handleAccept() }}> Accept </Button>
                        <Button variant='danger' className='ms-2' onClick={() => { handleReject() }}> Reject </Button>
                    </>

                </div>
            </div>
            <hr className="fs-1 mb-5" style={{ border: "4px dotted #000", borderStyle: "none none dotted", color: "#000", backgroundColor: "#000" }} />
        </div>
    );
};

export default TeacherProjectApplication;