import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import ThirdExaminerMarksModal from './ThirdExaminerMarksModal';



const ThirdExaminer = () => {
    const [allInfo, setAllinfo] = useState({});
    const { semesterId, courseCode } = useParams();
    const [editFinalMarks, setEditFinalMarks] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [final, setFinal] = useState(true);
    const { user } = useAuth();
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
    useEffect(() => {
        fetch(`http://localhost:5000/get-marks/third-examiner/${semesterId}/${courseCode.toUpperCase()}/${email}`)
            .then(res => res.json())
            .then(data => {
                console.log('a course ', data);
                if (data?.code === "403") {
                    Toast.fire({
                        icon: 'error',
                        title: data?.message
                    })
                    history.push('/home');
                }
                else {
                    setAllinfo(data);
                }

            })
    }, [email, semesterId, courseCode])

    const onSubmit = data => {
        //setSubmitClick(!submitClick);
        // trimming all properties of data
        for (var key in data) {
            if (data[key].trim)
                data[key] = data[key].trim();
            if (data[key].length === 0) {
                Toast.fire({
                    icon: 'error',
                    title: "Don't put a feild empty, you can assign 0"
                })
                return;
            }
        }
        console.log('submit ', data);
        console.log("Hello")
        fetch(`http://localhost:5000/add-marks/third-examiner/${semesterId}/${courseCode}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log("data ", data);
                if (data.modifiedCount) {
                    Toast.fire({
                        icon: 'success',
                        title: 'Successfully updated marks'
                    })
                    history.push('/dashboard/courses-taken')
                }
                else if (data.modifiedCount === 0 && data.matchedCount === 1) {
                    Toast.fire({
                        icon: 'warning',
                        title: 'Give some data then click assign'
                    })
                    //history.push('/dashboard/courses-taken')
                }
            });
    };


    const visibile = {
        visibility: 'visible'
    }

    return (
        <>
            {
                Object.keys(allInfo).length === 0
                    ?
                    <div className='text-center my-5 py-5 '>
                        <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>
                    :
                    <>
                        <div>
                            <ThirdExaminerMarksModal
                                allInfo={allInfo} showModal={showModal} setShowModal={setShowModal}
                                final={final}

                            />
                        </div>
                        <div>
                            <div className='container'>
                                <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                    <div className='p-4 '>
                                        <div className=' '>
                                            <h3 className='text-center mb-3' >Assign Marks</h3>
                                            <p><span className='fw-bold'>Course Name: </span>{allInfo?.course_title}</p>
                                            <p><span className='fw-bold'>Course Code: </span>{allInfo?.course_code}</p>
                                            <p><span className='fw-bold'>Credit Hour: </span>{allInfo?.credit}</p>
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
                                                                <span className='edit' onClick={() => { setEditFinalMarks(true) }}>Edit</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Object.keys(allInfo).length !== 0 &&
                                                            allInfo?.marks.map(x => <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                                <td style={{ border: "1px solid black" }}>
                                                                    <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.s_id}
                                                                        {...register(`${x?.s_id}_id`, { required: true })}
                                                                        readOnly />
                                                                </td>
                                                                <td style={{ border: "1px solid black" }}>
                                                                    <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} value={x?.displayName}
                                                                        {...register(`${x?.s_id}_name`, { required: true })}
                                                                        readOnly />
                                                                </td>

                                                                <td style={{ border: "1px solid black" }}>
                                                                    {
                                                                        editFinalMarks
                                                                            ?
                                                                            <input type='number' className=' w-50 text-center' defaultValue={x?.third_examiner_marks}
                                                                                {...register(`${x?.s_id}_third_examiner_marks`, { required: true })}
                                                                            />
                                                                            :
                                                                            <p>{x?.third_examiner_marks}</p>
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

export default ThirdExaminer;