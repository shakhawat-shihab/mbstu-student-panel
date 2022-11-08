import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { MdPendingActions, MdCancel } from 'react-icons/md';
const Payment = (props) => {
    const { application } = props;
    const [amount, setAmount] = useState(0);
    const regularCoursesRate = 110;
    const backlogCoursesRate = 300;
    const specialCoursesRate = 500;
    const marksheetFee = 100;
    console.log('application ', application);


    useEffect(() => {
        const numberOfRegularCourses = application?.regularCourses?.length || 0;
        const numberOfBacklogCourses = application?.backlogCourses?.length || 0;
        const numberOfSpecialCourses = application?.specialCourses?.length || 0;
        setAmount(numberOfRegularCourses * regularCoursesRate + numberOfBacklogCourses * backlogCoursesRate + numberOfSpecialCourses * specialCoursesRate + 100)
    }, [application])

    const processPayment = () => {
        // console.log('processPayment')
        const info = {
            applicationId: application?._id,
            numberOfRegularCourses: application?.regularCourses.length,
            numberOfBacklogCourses: application?.backlogCourses.length,
            numberOfSpecialCourses: application?.specialCourses.length,
            // marksheetFee: 100,
            // amount: 100,
        }

        fetch('http://localhost:5000/api/v1/payment/ssl-init', {
            method: 'post',
            // { redirect: 'follow', 'content-type': 'Access-Control-Allow-Origin' }
            headers: {
                'Content-type': 'application/json',
                // 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
            body: JSON.stringify(info)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                window.location.replace(data)
            })
    }


    return (
        <div>
            {
                application?.isHallVerified
                    ?
                    <div className='container shadow-lg py-4 px-5 my-4 rounded'>
                        <h2 className='text-center mb-5 fw-bold' style={{ color: "#3C3FED" }}>Payment</h2>
                        <div className='mt-3 d-flex justify-content-between'>
                            <h3 className='fw-bold text-center mb-4'>{application?.name}</h3>
                            {
                                application?.status !== 'pending'
                                    ?
                                    <h5 className='fw-bold float-end text-capitalize'>{application?.status}<span className="text-danger fs-1"> <MdCancel /></span></h5>
                                    :
                                    <h5 className='fw-bold float-end text-capitalize'>{application?.status}<span className="text-warning fs-1"> <MdPendingActions /></span></h5>
                            }
                        </div>

                        <div className='d-flex flex-column'>
                            <span style={{ fontSize: "20px" }}><span className="fw-bold">Name: </span>{application?.applicantName}</span>
                            <span style={{ fontSize: "20px" }} className="text-uppercase"><span className="fw-bold">ID: </span>{application?.applicantId}</span>
                            <span style={{ fontSize: "20px" }}><span className="fw-bold">Session: </span>{application?.applicantSession}</span>
                            <span style={{ fontSize: "20px" }}><span className="fw-bold">Hall: </span>{application?.applicantHallName}</span>
                        </div>


                        <div className='mt-5 px-4'>
                            <table class="table">
                                <thead class="table-dark">
                                    <tr >
                                        <th className='py-4'>Name of the fees</th>
                                        <th className='py-4'>Qty</th>
                                        <th className='py-4'>Rate</th>
                                        <th className='py-4'>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='py-3'>Regular Courses</td>
                                        <td>{application?.regularCourses.length}</td>
                                        <td>{regularCoursesRate}</td>
                                        <td>{regularCoursesRate * application?.regularCourses.length}</td>
                                    </tr>
                                    <tr>
                                        <td className='py-3'>Backlog Courses</td>
                                        <td>{application?.backlogCourses.length}</td>
                                        <td>{backlogCoursesRate}</td>
                                        <td>{backlogCoursesRate * application?.backlogCourses.length}</td>
                                    </tr>
                                    <tr>
                                        <td className='py-3'>Special Courses</td>
                                        <td>{application?.specialCourses.length}</td>
                                        <td>{specialCoursesRate}</td>
                                        <td>{specialCoursesRate * application?.specialCourses.length}</td>
                                    </tr>
                                    <tr>
                                        <td className='py-3'>Marksheet Fee</td>
                                        <td></td>
                                        <td></td>
                                        <td>{marksheetFee}</td>
                                    </tr>
                                    <tr >
                                        <td style={{ 'borderBottomWidth': '0px' }} className='py-4'></td>
                                        <td style={{ 'borderBottomWidth': '0px' }}></td>
                                        <td style={{ backgroundColor: '#FFC107' }}>Total</td>
                                        <td style={{ backgroundColor: '#FFC107' }} >{amount}</td>
                                    </tr>
                                    {/* <tr >
                                        <td style={{ 'borderBottomWidth': '0px' }} className='py-4'></td>
                                        <td style={{ 'borderBottomWidth': '0px' }} ></td>
                                        <td style={{ 'borderBottomWidth': '0px' }}></td>
                                        <td style={{ 'borderBottomWidth': '0px' }} className='pt-3'>
                                            {
                                                !application?.isPaid
                                                    ?
                                                    <Button variant='warning'
                                                        onClick={() => {
                                                            processPayment();
                                                        }}>
                                                        Pay
                                                    </Button>
                                                    :
                                                    <Button variant='success' disabled className='px-5'>
                                                        Paid
                                                    </Button>
                                            }
                                        </td>
                                    </tr> */}
                                </tbody>

                            </table>
                        </div>

                        <div className='text-center my-5'>
                            {
                                !application?.isPaid
                                    ?
                                    <Button variant='warning'
                                        className='px-5'
                                        onClick={() => {
                                            processPayment();
                                        }}>
                                        Pay
                                    </Button>
                                    :
                                    <Button variant='success' className='px-5' disabled>
                                        Paid
                                    </Button>
                            }
                        </div>
                    </div>
                    :
                    <div className=' d-flex justify-content-center align-items-center half-height' >
                        <h5 className='text-center fs-2 text-secondary my-4 fw-bold error-opacity' >Hall-Provost has not approved application yet</h5>
                    </div>
            }


        </div >

    );
};

export default Payment;