import React, { useEffect, useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import { MdEdit } from "react-icons/md";
import { Button, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './DashboardHome.css';

import academicCommitteePhoto from "../../../images/academicCommittee.png";
import chairmanPhoto from "../../../images/chairman.png";
import hallProvostPhoto from "../../../images/hallProvost.png";
import teacherPhoto from "../../../images/teacher.png";
import studentPhoto from "../../../images/student.png";
import userPhoto from "../../../images/user.png";

const DashboardHome = () => {

    const { user } = useAuth();

    const [profile, setProfile] = useState()

    const [isLoading, setIsLoading] = useState(true);

    const history = useHistory();
    // const id = "CE17050"
    // const name = "Jubair Ahmed Khan";
    // const email = "jubair.mbstu@gmail.com";
    // const phone = "01601293123";
    // const address = "9/A, Mohammadi Road, Sontek, Jatrabari, Dhaka-1236";
    // const hall = "JAMH";
    // const session = "2016-17";
    // const designation = "Assistant Professor";
    // const field = ['Artificial Intelligence', 'Machine Learning', 'Image Processing', 'Natural Language Processing'];

    // console.log("useeer === ", user);

    // let userPhoto = userImage;

    // if (user?.isStudent)
    //     userPhoto = studentImage;

    // if (user?.isTeacher)
    //     userPhoto = teacherImage;


    // const { first_name, last_name, email, phone, address, designation, field } = teacher;

    // const email = 'lubnaju@yahoo.com';
    // useEffect(() => {
    //     //console.log('email ', email);
    //     fetch(https://mbstu-panel-server.onrender.com/courses-taken/${email})
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log('taken courses', data);
    //             console.log('email', email);
    //             // seTakenCourses(data);
    //         })
    // }, [])

    useEffect(() => {
        //console.log('email ', email);
        fetch('https://mbstu-panel-server.onrender.com/api/v1/profile', {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        })
            .then(res => res.json())
            .then(info => {
                setProfile(info?.data)
                setIsLoading(false);
                // console.log('my-profile === ', info);
                // console.log('email', email);
                // seTakenCourses(data);
            })
    }, [])

    const handleEdit = () => {
        history.push('/dashboard/profile');
    }

    return (
        <div>
            <div className='mt-3 mx-3 d-flex justify-content-between'>
                <div className='ms-5'>
                    <h5>My Profile</h5>
                </div>
                <div className='me-5'>
                    <div className='d-flex edit-info' onClick={handleEdit}>
                        <MdEdit className='mt-1 me-1'> </MdEdit>
                        <p>Edit</p>
                    </div>
                </div>
            </div>
            <div className='mx-3'>
                <hr className='w-100' />
            </div>
            {
                isLoading ?
                    <div className='text-center my-5 py-5 '>
                        <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div> :
                    <div className='container mb-5'>
                        <div className='row container d-flex justify-content-center align-items-center'>
                            <div className='col-sm-12 col-md-2 col-lg-2 mt-5 mb-2'>
                                <div className='mb-3 text-center'>

                                    <>
                                        {/* <img src={profile?.imageURL ? profile?.imageURL : userPhoto} alt="img of user" style={{ borderRadius: "50%", width: "200px", height: "200px" }} className="border border-3 border-lg img-fluid mx-auto" /> */}

                                        {
                                            profile?.imageURL
                                                ?
                                                <img src={profile?.imageURL} alt="user_profile" className='profile-image  bg-white' />
                                                :
                                                <>
                                                    {
                                                        user?.isAcademicCommittee
                                                            ?
                                                            <img src={academicCommitteePhoto} alt="academic-committee" className='profile-image  bg-white' />
                                                            :
                                                            <>
                                                                {
                                                                    user?.isDeptChairman
                                                                        ?
                                                                        <img src={chairmanPhoto} alt="dept-chairman" className='profile-image  bg-white ' />
                                                                        :
                                                                        <>
                                                                            {
                                                                                user?.isHallProvost
                                                                                    ?
                                                                                    <img src={hallProvostPhoto} alt="hall-provost" className='profile-image  bg-white ' />
                                                                                    :
                                                                                    <>
                                                                                        {

                                                                                            user?.isTeacher
                                                                                                ?
                                                                                                <img src={teacherPhoto} alt="teacher" className='profile-image  bg-white ' />
                                                                                                :
                                                                                                <>
                                                                                                    {
                                                                                                        user?.isStudent
                                                                                                            ?
                                                                                                            <img src={studentPhoto} alt="student" className='profile-image  bg-white ' />
                                                                                                            :
                                                                                                            <img src={userPhoto} alt="user" className='profile-image  bg-white ' />
                                                                                                    }
                                                                                                </>
                                                                                        }
                                                                                    </>
                                                                            }
                                                                        </>
                                                                }
                                                            </>

                                                    }
                                                </>

                                        }
                                    </>

                                </div>
                                <div className='text-center'>
                                    <Button style={{ borderRadius: "30px" }} className="px-3" onClick={handleEdit}>Edit Profile</Button>
                                </div>

                            </div>
                            <div className='col mt-2 ms-5 mb-4 py-2'>
                                {
                                    user?.isStudent &&
                                    <div>
                                        <h6 className='text-muted'>Student ID:</h6>
                                        <p>{profile?.id?.toUpperCase()}</p>
                                    </div>
                                }

                                <div>
                                    <h6 className='text-muted'>Full name:</h6>
                                    {
                                        <p>{profile?.firstName + " " + profile?.lastName}</p>
                                    }
                                </div>


                                <div>
                                    <h6 className='text-muted'>Email Address:</h6>
                                    <p>{profile?.email}</p>
                                </div>

                                {
                                    profile?.address &&
                                    <div>
                                        <h6 className='text-muted'>Address:</h6>
                                        <p>{profile?.address}</p>
                                    </div>
                                }

                                {
                                    profile?.contactNumber &&
                                    <div>
                                        <h6 className='text-muted'>Phone:</h6>
                                        <p>{profile?.contactNumber}</p>
                                    </div>

                                }

                                {
                                    user?.isStudent &&
                                    <div>
                                        <h6 className='text-muted'>Session:</h6>
                                        <p>{profile?.session}</p>
                                    </div>
                                }

                                {
                                    user?.isStudent &&
                                    <div>
                                        <h6 className='text-muted'>Hall:</h6>
                                        <p>{user?.hall?.name}</p>
                                    </div>
                                }

                                {
                                    // user?.isTeacher &&
                                    // <div>
                                    //     <h6 className='text-muted'>Designation:</h6>
                                    //     {
                                    //         designation &&
                                    //         <>
                                    //             <p>{designation}</p>
                                    //         </>
                                    //     }

                                    // </div>
                                }

                                {
                                    // user?.isTeacher &&
                                    // <div>
                                    //     <h6 className='text-muted'>Field of interest:</h6>
                                    //     {
                                    //         field &&
                                    //         <>
                                    //             <div className='row row-cols-lg-4 row-cols-md-3 row-cols-sm-1'>
                                    //                 {
                                    //                     field.map(x => <div><span className='text-success me-2'><AiFillCheckSquare></AiFillCheckSquare></span>{x}</div>)
                                    //                 }
                                    //             </div>
                                    //         </>
                                    //     }

                                    // </div>
                                }
                            </div>
                        </div>
                    </div>
            }



        </div>
    );
};

export default DashboardHome;