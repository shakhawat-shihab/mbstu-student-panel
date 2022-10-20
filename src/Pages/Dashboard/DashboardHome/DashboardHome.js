import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import { MdEdit } from "react-icons/md";
import { AiFillCheckSquare } from "react-icons/ai"
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import './DashboardHome.css';

const DashboardHome = () => {

    const { user, student, teacher } = useAuth();

    const history = useHistory();
    const id = "CE17050"
    const name = "Jubair Ahmed Khan";
    const email = "jubair.mbstu@gmail.com";
    const phone = "01601293123";
    const address = "9/A, Mohammadi Road, Sontek, Jatrabari, Dhaka-1236";
    const hall = "JAMH";
    const session = "2016-17";
    const designation = "Assistant Professor";
    const field = ['Artificial Intelligence', 'Machine Learning', 'Image Processing', 'Natural Language Processing'];

    //console.log(user);
    ///console.log(student);
    //console.log(teacher);

    let userPhoto = "https://i.ibb.co/FmK44jt/blank-user.png";

    if (user?.photoURL)
        userPhoto = user?.photoURL;

    if (student) {
        // userPhoto = "https://i.ibb.co/6HBxzwW/student.png";
        userPhoto = "https://i.ibb.co/QJn9RVQ/student.png";
        // const { first_name, last_name, email, phone, address, hall, session } = student;

    }

    if (teacher)
        // userPhoto = "https://i.ibb.co/ScpX2fD/teacher.png";
        userPhoto = "https://i.ibb.co/WFx7JDb/teacher.png";
    // const { first_name, last_name, email, phone, address, designation, field } = teacher;

    // const email = 'lubnaju@yahoo.com';
    // useEffect(() => {
    //     //console.log('email ', email);
    //     fetch(http://localhost:5000/courses-taken/${email})
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log('taken courses', data);
    //             console.log('email', email);
    //             // seTakenCourses(data);
    //         })
    // }, [])

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

            <div className='container'>
                <div className='row container'>
                    <div className='col-sm-12 col-md-2 col-lg-2 mt-5 mb-2'>
                        <div className='mb-3 text-center'>

                            <>
                                <img src={userPhoto} alt="img of user" style={{ borderRadius: "50%" }} className="img-fluid mx-auto" width="150px" />
                            </>

                        </div>
                        <div className='text-center'>
                            <Button style={{ borderRadius: "30px" }} className="px-3" onClick={handleEdit}>Edit Profile</Button>
                        </div>

                    </div>
                    <div className='col mt-2 ms-3 mb-4 py-2'>
                        {
                            student &&
                            <div className=''>
                                <h6 className='text-muted'>Student ID:</h6>
                                <p>{id}</p>
                            </div>
                        }

                        <div>
                            <h6 className='text-muted'>Full name:</h6>
                            {
                                name ?
                                    <>
                                        <p>{name}</p>
                                    </>
                                    :
                                    <>
                                        <p>{user?.displayName}</p>
                                    </>
                            }
                        </div>


                        <div>
                            <h6 className='text-muted'>Email Address:</h6>
                            {
                                email ?
                                    <>
                                        <p>{email}</p>
                                    </>
                                    :
                                    <>
                                        <p>{user?.email}</p>
                                    </>
                            }

                        </div>


                        <div>
                            <h6 className='text-muted'>Phone:</h6>
                            {
                                phone &&
                                <>
                                    <p>{phone}</p>
                                </>
                            }

                        </div>

                        <div>
                            <h6 className='text-muted'>Address:</h6>
                            {
                                address &&
                                <>
                                    <p>{address}</p>
                                </>
                            }

                        </div>

                        {
                            student &&
                            <div>
                                <h6 className='text-muted'>Hall:</h6>
                                {
                                    hall &&
                                    <>
                                        <p>{hall}</p>
                                    </>
                                }

                            </div>
                        }


                        {
                            student &&
                            <div>
                                <h6 className='text-muted'>Session:</h6>
                                {
                                    session &&
                                    <>
                                        <p>{session}</p>
                                    </>
                                }

                            </div>
                        }

                        {
                            teacher &&
                            <div>
                                <h6 className='text-muted'>Designation:</h6>
                                {
                                    designation &&
                                    <>
                                        <p>{designation}</p>
                                    </>
                                }

                            </div>
                        }

                        {
                            teacher &&
                            <div>
                                <h6 className='text-muted'>Field of interest:</h6>
                                {
                                    field &&
                                    <>
                                        <div className='row row-cols-lg-4 row-cols-md-3 row-cols-sm-1'>
                                            {
                                                field.map(x => <div><span className='text-success me-2'><AiFillCheckSquare></AiFillCheckSquare></span>{x}</div>)
                                            }
                                        </div>
                                    </>
                                }

                            </div>
                        }
                    </div>
                </div>
            </div>

        </div>
    );
};

export default DashboardHome;