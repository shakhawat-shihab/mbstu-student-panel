import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import SecondExaminerMarksModal from './SecondExaminerMarksModal';
import SecondMarkModal from './SecondMarkModal';

const SecondExaminer = () => {
    const [marks, setMarks] = useState({});
    const [allInfo, setAllinfo] = useState({});
    const [editFinalMarks, setEditFinalMarks] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showMarkModal, setShowMarkModal] = useState(false);
    const [secondExaminerFinal, setSecondExaminerFinal] = useState(false);
    const [final, setFinal] = useState(true);
    const { user } = useAuth();
    const { courseId } = useParams();


    const email = user?.email;
    const history = useHistory();
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
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    // useEffect(() => {
    //     fetch(`http://localhost:5000/get-marks/second-examiner/${semesterId}/${courseCode.toUpperCase()}/${email}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log('a course ', data);
    //             if (data?.code === "403") {
    //                 Toast.fire({
    //                     icon: 'error',
    //                     title: data?.message
    //                 })
    //                 history.push('/home');
    //             }
    //             else {
    //                 setAllinfo(data);
    //             }

    //         })
    // }, [email, semesterId, courseCode])

    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/marks/get-marks/second-examiner/${courseId}`, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        })
            .then(res => res.json())
            .then(info => {
                console.log('info ', info)
                setMarks(info.data);

            })
    }, [courseId])

    const onSubmit = data => {
        //setSubmitClick(!submitClick);
        // trimming all properties of data
        for (var key in data) {
            if (data[key].trim)
                data[key] = data[key].trim();
            if (data[key].length === 0) {
                //errors.newError = 'error'
                Toast.fire({
                    icon: 'error',
                    title: "Don't put a feild empty, you can assign 0"
                })
                return;
            }
        }
        // console.log('submit ', data)
        // console.log("Hello")
        // fetch(`http://localhost:5000/add-marks/second-examiner/${semesterId}/${courseCode}`, {
        //     method: 'put',
        //     headers: {
        //         'content-type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // })
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log("data ", data);
        //         if (data.modifiedCount) {
        //             Toast.fire({
        //                 icon: 'success',
        //                 title: 'Successfully updated marks'
        //             })
        //             history.push('/dashboard/courses-taken')
        //         }
        //         else if (data.modifiedCount === 0 && data.matchedCount === 1) {
        //             Toast.fire({
        //                 icon: 'warning',
        //                 title: 'Give some data then click assign'
        //             })
        //             //history.push('/dashboard/courses-taken')
        //         }
        //     });
    };

    const visibile = {
        visibility: 'visible'
    }

    // console.log("semeeester idddd ===== ", semesterId);
    // console.log("courseee codeeee ===== ", courseCode);
    // console.log("allll infoooooo  ===== ", allInfo);

    return (
        <>
            {

                <>
                    <div>
                        <SecondExaminerMarksModal
                            marks={marks} showModal={showModal} setShowModal={setShowModal}

                        />

                    </div>
                    <div>
                        <SecondMarkModal
                            marks={marks} showMarkModal={showMarkModal} setShowMarkModal={setShowMarkModal}
                            secondExaminerFinal={secondExaminerFinal} setSecondExaminerFinal={setSecondExaminerFinal}

                        />

                    </div>
                    <div>

                        <div className='container'>
                            <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                <div className='p-4 '>
                                    <div className=' '>
                                        <h3 className='text-center mb-3' >Assign Marks</h3>
                                        <p><span className='fw-bold'>Course Name: </span>{marks?.courseTitle}</p>
                                        <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode}</p>
                                        <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p>
                                    </div>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <Form.Group className='mb-2'>
                                            <Table responsive striped bordered hover className='text-center'  >
                                                <col width="25%" />
                                                <col width="50%" />
                                                <col width="30%" />

                                                <thead>
                                                    <tr style={{ border: "1px solid black" }}>
                                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                            Final Exam Mark <br />(70 marks)
                                                            <br />
                                                            <span className='edit' onClick={() => { setShowMarkModal(true); setSecondExaminerFinal(true) }}>Edit</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        // Object.keys(allInfo).length !== 0 &&
                                                        marks?.studentsMarks?.map(x => <tr key={x?.id} style={{ border: "1px solid black" }}>
                                                            <td style={{ border: "1px solid black" }}>
                                                                <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                    {...register(`${x?.id}_id`, { required: true })}
                                                                    readOnly />
                                                            </td>
                                                            <td style={{ border: "1px solid black" }}>
                                                                <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} defaultValue={x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName}
                                                                    {...register(`${x?.id}_name`, { required: true })}
                                                                    readOnly />
                                                            </td>

                                                            <td style={{ border: "1px solid black" }}>
                                                                {
                                                                    <p>{x?.theorySecondExaminer}</p>
                                                                }
                                                            </td>
                                                        </tr>)
                                                    }
                                                </tbody>
                                            </Table>
                                        </Form.Group>

                                        <Form.Check
                                            inline
                                            type='checkbox'
                                            label="Final Exam Mark"
                                            // name="FinalExamMark"
                                            id="FinalExamMark"
                                            checked
                                        />
                                        <div className='text-center'>
                                            <Button variant='success' className='me-2' onClick={() => setShowModal(true)}> Generate PDF</Button>
                                            <input as Button variant='primary' type="submit" value='Save' className='btn btn-primary' />
                                        </div>
                                    </Form>

                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    );
};

export default SecondExaminer;