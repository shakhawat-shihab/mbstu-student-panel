import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';
import Compressor from 'compressorjs';

import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import Swal from 'sweetalert2';

import academicCommitteePhoto from "../../../images/academicCommittee.png";
import chairmanPhoto from "../../../images/chairman.png";
import hallProvostPhoto from "../../../images/hallProvost.png";
import teacherPhoto from "../../../images/teacher.png";
import studentPhoto from "../../../images/student.png";
import userPhoto from "../../../images/user.png";

const UpdateProfile = () => {

    const { url } = useRouteMatch();
    const { user } = useAuth();
    const history = useHistory();
    // console.log("update profile user === ", user)

    const [selectedFile, setSelectedFile] = useState("");
    const inputFile = useRef(null);

    const [profile, setProfile] = useState();
    const [imageSrc, setImageSrc] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

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

    // let userPhoto = userImage;


    // if (user?.isStudent) {
    //     userPhoto = studentImage;

    // }

    // if (user?.isTeacher)
    //     userPhoto = teacherImage;



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



    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            checkbox: false,
        }
    });

    //image compress
    const handleCompressedUpload = (e) => {
        const image = e.target.files[0];
        var src = URL.createObjectURL(image);
        setImageSrc(src);
        new Compressor(image, {
            quality: 0.4, // 0.6 can also be used, but its not recommended to go below.
            success: (compressedResult) => {
                // compressedResult has the compressed file.
                // Use the compressed file to upload the images to your server.        
                // console.log(compressedResult)
                var file = new File([compressedResult], "image.jpg");
                setSelectedFile(file)
            },
        });
    };

    //image show in container



    const onButtonClick = () => {
        inputFile.current.click();
    };

    const onSubmit = data => {
        let formData = new FormData();    //formdata object

        //append the values with key, value pair
        formData.append('firstName', data?.first_name);
        formData.append('lastName', data?.last_name);
        formData.append('contactNumber', data?.contact_number);
        formData.append('address', data?.address);

        const imageFile = selectedFile;

        formData.append('image', imageFile);
        // console.log('form data ===>> ', formData)

        setShowModal(true);

        fetch(`https://mbstu-panel-server.onrender.com/api/v1/profile/update`, {
            method: 'put',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
            body: formData,
        })
            .then(res => res.json())
            .then(info => {
                console.log('info after profile update', info)
                setShowModal(false);
                if (info?.status === 'success') {
                    Toast.fire({
                        icon: 'success',
                        title: info?.message
                    })

                    history.push('/dashboard')
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: info?.message
                    })
                }

                //show message in modal (generalize design) if success 

            })

    }
    return (
        <div>
            <div className='mt-3 mx-3'>
                <div className='ms-5'>
                    <h5>Update Profile</h5>
                </div>
            </div>
            <div className='mx-3'>
                <hr className='w-100' />
            </div>
            {
                isLoading
                    ?
                    <div className='text-center my-5 py-5 '>
                        <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :

                    <div className='container'>
                        <div>
                            <Modal
                                show={showModal}
                                backdrop="static"
                                keyboard={false}
                                centered
                            >
                                <Modal.Body className='d-flex justify-content-center align-items-center' style={{ fontsize: "30px" }}>
                                    <p>Saving ....</p>
                                </Modal.Body>

                            </Modal>
                        </div>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <div className='row container d-flex justify-content-center align-items-center'>
                                <div className='col-sm-12 col-md-2 col-lg-2'>
                                    <div className='text-center mb-4'>

                                        <>
                                            {/* <img src={imageSrc ? imageSrc : profile?.imageURL ? profile?.imageURL : userPhoto} alt="img of user" style={{ borderRadius: "50%", width: "200px", height: "200px" }} className="border border-3 border-lg img-fluid mx-auto" /> */}

                                            {
                                                imageSrc
                                                    ?
                                                    <img src={imageSrc} alt={`${user?.fullName}`} className='profile-image  bg-white' />
                                                    :
                                                    profile?.imageURL
                                                        ?
                                                        <img src={profile?.imageURL} alt={`${user?.fullName}`} className='profile-image  bg-white' />
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

                                        <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={(e) => {
                                            //setSelectedFile(e.target.files[0])
                                            //console.log(e.target.files[0])
                                            handleCompressedUpload(e)
                                        }} />
                                        <Button variant="primary" style={{ borderRadius: "30px" }} onClick={onButtonClick}>Upload photo</Button>

                                    </div>

                                </div>

                                <div className='col mt-5 pt-2 ms-4 '>

                                    <Form.Group className="mb-3">
                                        <Form.Label className='text-primary'>First name: </Form.Label>

                                        <Form.Control type="text" style={{ paddingLeft: "10px" }} {...register("first_name", { required: true })} className="w-100" defaultValue={profile?.firstName} min="3" max="100" />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className='text-primary'>Last name: </Form.Label>

                                        <Form.Control type="text" style={{ paddingLeft: "10px" }} {...register("last_name", { required: true })} className="w-100" defaultValue={profile?.lastName} min="3" max="100" />
                                    </Form.Group>


                                    <Form.Group className="mb-3">
                                        <Form.Label className='text-primary'>Phone:</Form.Label>

                                        <Form.Control type="text" style={{ paddingLeft: "10px" }} {...register("contact_number", { required: false })} className="w-100" defaultValue={profile?.contactNumber ? profile?.contactNumber : ""} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className='text-primary'>Address: </Form.Label>

                                        <Form.Control type="text" style={{ paddingLeft: "10px" }} {...register("address", { required: false })} className="w-100" defaultValue={profile?.address ? profile?.address : ""} />
                                    </Form.Group>

                                    {
                                        // user?.isStudent &&
                                        // <Form.Group className="mb-3">
                                        //     <Form.Label className='text-primary'>Hall: </Form.Label>
                                        //     <Form.Control type="text" style={{ paddingLeft: "10px" }} {...register("hall", { required: true })} className="w-100" />
                                        // </Form.Group>
                                    }

                                    {
                                        // user?.isStudent &&
                                        // <Form.Group className="mb-3">
                                        //     <Form.Label className='text-primary'>Session:</Form.Label>

                                        //     <Form.Select {...register("session", { required: true })}>
                                        //         <option value="">Select</option>
                                        //         <option value="16">2015-16</option>
                                        //         <option value="17">2016-17</option>
                                        //         <option value="18">2017-18</option>
                                        //         <option value="19">2018-19</option>
                                        //         <option value="20">2019-20</option>
                                        //         <option value="21">2020-21</option>
                                        //         <option value="22">2021-22</option>
                                        //     </Form.Select>
                                        // </Form.Group>
                                    }

                                    {
                                        // user?.isTeacher &&
                                        // <Form.Group className="mb-3">
                                        //     <Form.Label className='text-primary'>Designation: </Form.Label>
                                        //     <Form.Control type="text" {...register("designation", { required: true })} className="w-100" />
                                        // </Form.Group>
                                    }

                                    {
                                        // user?.isTeacher &&
                                        // <Form.Group className="mb-3">
                                        //     <Form.Label className='text-primary'>Field of Interest:</Form.Label>
                                        //     <br></br>
                                        //     <div className='row row-cols-lg-4 row-cols-md-3 row-cols-sm-1'>
                                        //         <div>
                                        //             <input
                                        //                 name="Machine Learning"
                                        //                 type="checkbox"
                                        //                 value="Machine Learning"
                                        //                 onChange={handleCheck}

                                        //             /> Machine Learning
                                        //         </div>

                                        //         {/* <br></br> */}
                                        //         <div>
                                        //             <input
                                        //                 name="Artificial Intelligence"
                                        //                 type="checkbox"
                                        //                 value="Artificial Intelligence"
                                        //                 onChange={handleCheck}

                                        //             /> Artificial Intelligence
                                        //         </div>
                                        //         {/* <br></br> */}
                                        //         <div>
                                        //             <input
                                        //                 name="Image Processing"
                                        //                 type="checkbox"
                                        //                 value="Image Processing"
                                        //                 onChange={handleCheck}

                                        //             /> Image Processing
                                        //         </div>

                                        //         <div>
                                        //             <input
                                        //                 name="IoT"
                                        //                 type="checkbox"
                                        //                 value="IoT"
                                        //                 onChange={handleCheck}

                                        //             /> IoT
                                        //         </div>
                                        //         <div>
                                        //             <input
                                        //                 name="Natural Language Processing"
                                        //                 type="checkbox"
                                        //                 value="Natural Language Processing"
                                        //                 onChange={handleCheck}
                                        //             /> Natural Language Processing
                                        //         </div>
                                        //         <div>
                                        //             <input
                                        //                 name="VLSI Design"
                                        //                 type="checkbox"
                                        //                 value="VLSI Design"
                                        //                 onChange={handleCheck}
                                        //             /> VLSI Design
                                        //         </div>
                                        //         <div>
                                        //             <input
                                        //                 name="Data Mining"
                                        //                 type="checkbox"
                                        //                 value="Data Mining"
                                        //                 onChange={handleCheck}
                                        //             /> Data Mining
                                        //         </div>
                                        //         <div>
                                        //             <input
                                        //                 name="Deep Learning"
                                        //                 type="checkbox"
                                        //                 value="Deep Learning"
                                        //                 onChange={handleCheck}
                                        //             /> Deep Learning
                                        //         </div>
                                        //         <div>
                                        //             <input
                                        //                 name="Bioinformatics"
                                        //                 type="checkbox"
                                        //                 value="Bioinformatics"
                                        //                 onChange={handleCheck}
                                        //             /> Bioinformatics
                                        //         </div>
                                        //     </div>
                                        // </Form.Group>
                                    }
                                    <div className='text-center mt-2 mb-5 pe-3 pt-4'>
                                        <input className="btn btn-primary" type="submit" value='Save changes' />
                                        <Link to={`${url}/change-password`}>
                                            <Button variant='warning ms-3'>
                                                Change Password
                                            </Button>
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        </Form>



                    </div>
            }


        </div>
    );
};

export default UpdateProfile;