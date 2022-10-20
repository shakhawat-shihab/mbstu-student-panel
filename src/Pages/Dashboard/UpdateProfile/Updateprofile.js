import React, { useRef } from 'react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';

const UpdateProfile = () => {
    let field = [];
    const { user, student, teacher } = useAuth();

    const [selectedFile, setSelectedFile] = useState("");
    const inputFile = useRef(null);

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

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            checkbox: false,
        }
    });
    const handleCheck = (e) => {
        const val = e.target.value;
        if (field.includes(val) === false) {
            field.push(val);

        }
    }

    const onButtonClick = () => {

        inputFile.current.click();

    };

    const onSubmit = data => {
        if (teacher) {
            data['field'] = field;
        }

        if (selectedFile)
            data['image'] = selectedFile.name;

        console.log(data);

        // ************ This part is not sure ********

        // fetch('https://localhost:5000/profiles', {
        //     method: 'POST',
        //     body: data
        // })
        //     .then(res => res.json())
        //     .then(data => {
        //         if (data.insertedId) {
        //             console.log('profile updated successfully')
        //         }
        //     })
        //     .catch(error => {
        //         console.error('Error:', error);
        //     });

        // ************ This part is not sure ********

        field = [];
        reset();
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
            <div className='container'>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className='row container'>
                        <div className='col-sm-12 col-md-2 col-lg-2 mt-5 mb-2 pt-5'>
                            <div className='mb-3 text-center'>

                                <>
                                    <img src={userPhoto} alt="img of user" style={{ borderRadius: "50%" }} className="img-fluid mx-auto" width="150px" />
                                </>

                            </div>
                            <div className='text-center mb-4'>

                                <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={(e) => setSelectedFile(e.target.files[0])} />
                                <Button variant="primary" style={{ borderRadius: "30px" }} onClick={onButtonClick}>Upload photo</Button>

                            </div>

                        </div>

                        <div className='col mt-2 ms-4 mb-4 py-2'>

                            <Form.Group className="mb-3">
                                <Form.Label className='text-primary'>Full name: </Form.Label>

                                <input type="text" style={{ paddingLeft: "10px" }} {...register("name", { required: true })} className="w-100" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className='text-primary'>Email address:</Form.Label>

                                <input type="email" style={{ paddingLeft: "10px" }} {...register("email", { required: true })} className="w-100" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className='text-primary'>Phone:</Form.Label>

                                <input type="text" style={{ paddingLeft: "10px" }} {...register("phone", { required: true })} className="w-100" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className='text-primary'>Address: </Form.Label>

                                <input type="text" style={{ paddingLeft: "10px" }} {...register("address", { required: true })} className="w-100" />
                            </Form.Group>

                            {
                                student &&
                                <Form.Group className="mb-3">
                                    <Form.Label className='text-primary'>Hall: </Form.Label>
                                    <input type="text" style={{ paddingLeft: "10px" }} {...register("hall", { required: true })} className="w-100" />
                                </Form.Group>
                            }

                            {
                                student &&
                                <Form.Group className="mb-3">
                                    <Form.Label className='text-primary'>Session:</Form.Label>

                                    <Form.Select {...register("session", { required: true })}>
                                        <option value="">Select</option>
                                        <option value="16">2015-16</option>
                                        <option value="17">2016-17</option>
                                        <option value="18">2017-18</option>
                                        <option value="19">2018-19</option>
                                        <option value="20">2019-20</option>
                                        <option value="21">2020-21</option>
                                        <option value="22">2021-22</option>
                                    </Form.Select>
                                </Form.Group>
                            }

                            {
                                teacher &&
                                <Form.Group className="mb-3">
                                    <Form.Label className='text-primary'>Designation: </Form.Label>
                                    <input type="text" {...register("designation", { required: true })} className="w-100" />
                                </Form.Group>
                            }

                            {
                                teacher &&
                                <Form.Group className="mb-3">
                                    <Form.Label className='text-primary'>Field of Interest:</Form.Label>
                                    <br></br>
                                    <div className='row row-cols-lg-4 row-cols-md-3 row-cols-sm-1'>
                                        <div>
                                            <input
                                                name="Machine Learning"
                                                type="checkbox"
                                                value="Machine Learning"
                                                onChange={handleCheck}

                                            /> Machine Learning
                                        </div>

                                        {/* <br></br> */}
                                        <div>
                                            <input
                                                name="Artificial Intelligence"
                                                type="checkbox"
                                                value="Artificial Intelligence"
                                                onChange={handleCheck}

                                            /> Artificial Intelligence
                                        </div>
                                        {/* <br></br> */}
                                        <div>
                                            <input
                                                name="Image Processing"
                                                type="checkbox"
                                                value="Image Processing"
                                                onChange={handleCheck}

                                            /> Image Processing
                                        </div>

                                        <div>
                                            <input
                                                name="IoT"
                                                type="checkbox"
                                                value="IoT"
                                                onChange={handleCheck}

                                            /> IoT
                                        </div>
                                        <div>
                                            <input
                                                name="Natural Language Processing"
                                                type="checkbox"
                                                value="Natural Language Processing"
                                                onChange={handleCheck}
                                            /> Natural Language Processing
                                        </div>
                                        <div>
                                            <input
                                                name="VLSI Design"
                                                type="checkbox"
                                                value="VLSI Design"
                                                onChange={handleCheck}
                                            /> VLSI Design
                                        </div>
                                        <div>
                                            <input
                                                name="Data Mining"
                                                type="checkbox"
                                                value="Data Mining"
                                                onChange={handleCheck}
                                            /> Data Mining
                                        </div>
                                        <div>
                                            <input
                                                name="Deep Learning"
                                                type="checkbox"
                                                value="Deep Learning"
                                                onChange={handleCheck}
                                            /> Deep Learning
                                        </div>
                                        <div>
                                            <input
                                                name="Bioinformatics"
                                                type="checkbox"
                                                value="Bioinformatics"
                                                onChange={handleCheck}
                                            /> Bioinformatics
                                        </div>
                                    </div>
                                </Form.Group>
                            }
                            <div className='text-center my-5 pe-3 pt-4'>
                                <input className="btn btn-primary" type="submit" value='Save changes' />
                            </div>

                        </div>
                    </div>
                </Form>



            </div>

        </div>
    );
};

export default UpdateProfile;