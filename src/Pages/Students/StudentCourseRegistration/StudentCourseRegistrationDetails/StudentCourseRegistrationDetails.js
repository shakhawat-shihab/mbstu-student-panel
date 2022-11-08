import React, { useEffect, useState } from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { FcApproval } from 'react-icons/fc';
import { MdPendingActions } from 'react-icons/md';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Academic from './CourseRegistrationView/Academic';
import AdmitCard from './CourseRegistrationView/AdmitCard';
import ChairmanView from './CourseRegistrationView/ChairmanView';
import CourseView from './CourseRegistrationView/CourseView';
import HallView from './CourseRegistrationView/HallView';
import Payment from './CourseRegistrationView/Payment';
import StepProgress from './StepProgress';

const StudentCourseRegistrationDetails = () => {
    const { applicationId } = useParams();
    const [application, setApplication] = useState({});
    const [isLoadingApplication, setIsLoadingApplication] = useState(true);
    const [currentState, setCurrentState] = useState(1);


    const history = useHistory();

    const [applicationView, setApplicationView] = useState(0);
    // console.log("My application id === ", applicationId);

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
                console.log("appplication details === ", info?.data);
                setApplication(info?.data);
                let count = 1;
                if (info?.data?.isChairmanVerified !== undefined) {
                    count++;
                    if (info?.data?.isHallVerified !== undefined) {
                        count++;
                        if (info?.data?.isPaid !== undefined) {
                            count++;
                            if (info?.data?.isAcademicVerified !== undefined) {
                                count++;
                            }
                        }
                    }
                }
                setCurrentState(count);
                setApplicationView(count);
                setIsLoadingApplication(false);
            })
    }, [applicationId])



    return (
        <>
            {
                isLoadingApplication
                    ?
                    <div className='text-center my-5 py-5 '>
                        <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <>
                        {
                            application
                                ?
                                <div className='mb-5'>
                                    <div className='mb-5 py-5'>
                                        <StepProgress current={currentState} applicationView={applicationView}
                                            setApplicationView={setApplicationView}
                                        />
                                    </div>

                                    <div className='mt-5'>
                                        <>
                                            {
                                                application?.isHallVerified && !application?.isPaid
                                                    ?
                                                    <Payment application={application} ></Payment>
                                                    :
                                                    <>
                                                        {
                                                            applicationView === 1
                                                            &&
                                                            <CourseView application={application}></CourseView>
                                                        }
                                                        {
                                                            applicationView === 2
                                                            &&
                                                            <ChairmanView application={application}></ChairmanView>
                                                        }
                                                        {
                                                            applicationView === 3
                                                            &&
                                                            <HallView application={application}></HallView>
                                                        }
                                                        {
                                                            applicationView === 4
                                                            &&
                                                            <Payment application={application} ></Payment>
                                                        }
                                                        {
                                                            applicationView === 5
                                                            &&
                                                            <Academic application={application}></Academic>
                                                        }
                                                        {
                                                            applicationView === 6
                                                            &&
                                                            <AdmitCard application={application}></AdmitCard>
                                                        }
                                                    </>
                                            }

                                        </>
                                        {/* {
                                            applicationView === 1
                                            &&
                                            <CourseView application={application}></CourseView>
                                        }
                                        {
                                            applicationView === 2
                                            &&
                                            <ChairmanView application={application}></ChairmanView>
                                        }
                                        {
                                            applicationView === 3
                                            &&
                                            <HallView application={application}></HallView>
                                        }
                                        {
                                            applicationView === 4
                                            &&
                                            <Payment application={application} ></Payment>
                                        }
                                        {
                                            applicationView === 5
                                            &&
                                            <Academic application={application}></Academic>
                                        }
                                        {
                                            applicationView === 6
                                            &&
                                            <AdmitCard application={application}></AdmitCard>
                                        } */}

                                    </div>
                                </div>
                                :
                                <p>There is no such application</p>

                        }
                    </>

            }


        </>

    );
};

export default StudentCourseRegistrationDetails;