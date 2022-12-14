import React, { useEffect, useState } from 'react';
import { Button, Form, Spinner, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import ThirdExaminerMarksModal from './ThirdExaminerMarksModal';
import ThirdMarkModal from './ThirdMarkModal';



const ThirdExaminer = () => {
    const [showMarkModal, setShowMarkModal] = useState(false);
    const [marks, setMarks] = useState({});
    const { courseId } = useParams();
    const [allInfo, setAllinfo] = useState({});
    const { semesterId, courseCode } = useParams();
    const [thirdExaminerFinal, setThirdExaminerFinal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [final, setFinal] = useState(true);
    const { user } = useAuth();
    const email = user?.email;
    const history = useHistory();

    const [isLoadingMarks, setIsLoadingMarks] = useState(true);
    const [isSaving, setIsSaving] = useState(true);


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
    //     fetch(`https://mbstu-panel-server.onrender.com/get-marks/third-examiner/${semesterId}/${courseCode.toUpperCase()}/${email}`)
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
        setIsLoadingMarks(true);
        fetch(`https://mbstu-panel-server.onrender.com/api/v1/marks/get-marks/third-examiner/${courseId}`, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        })
            .then(res => res.json())
            .then(info => {
                console.log('info ', info)
                setMarks(info.data);
                setIsLoadingMarks(false);

            })
    }, [courseId, isSaving])

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

        // fetch(`https://mbstu-panel-server.onrender.com/add-marks/third-examiner/${semesterId}/${courseCode}`, {
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

    const submitAllMarksThirdExaminer = () => {

        Swal.fire({
            title: 'Do you want to Turn In the marks?',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            confirmButtonColor: 'green',
            icon: 'warning',
            cancelButtonText: 'No, cancel!',
            cancelButtonColor: 'red'

        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Saved!', '', 'success')
                fetch(`https://mbstu-panel-server.onrender.com/api/v1/marks/turn-in/third-examiner/${courseId}`, {
                    method: 'put',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
                    },
                })
                    .then(res => res.json())
                    .then(info => {
                        console.log('info second ', info)
                        // setMarks(info.data);
                        // setIsLoadingMarks(false);
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


    const visibile = {
        visibility: 'visible'
    }

    return (
        <>
            {
                isLoadingMarks ?
                    <div className='text-center my-5 py-5 '>
                        <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </div>

                    :
                    <>
                        <div>
                            <ThirdExaminerMarksModal
                                marks={marks} showModal={showModal} setShowModal={setShowModal}
                                final={final}
                            />
                        </div>
                        <div>
                            <ThirdMarkModal
                                marks={marks} showMarkModal={showMarkModal} setShowMarkModal={setShowMarkModal}
                                thirdExaminerFinal={thirdExaminerFinal} setThirdExaminerFinal={setThirdExaminerFinal} courseId={courseId} setIsSaving={setIsSaving} isSaving={isSaving}
                            />
                        </div>
                        <div>
                            <div className='container'>
                                <div className='container-fluid shadow-lg  rounded  my-5 ' >
                                    <div className='p-4 '>
                                        {/* <div className=' '>
                                            <h3 className='text-center mb-3' >Assign Marks</h3>
                                            <p><span className='fw-bold'>Course Name: </span>{marks?.courseTitle}</p>
                                            <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode}</p>
                                            <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p>
                                        </div> */}
                                        <div className=''>
                                            <div className='mt-4'>
                                                <h5 className='text-uppercase text-center fw-bold mb-1 mt-2'>Mawlana Bhashani Science and Technology university</h5>
                                                <h6 className='text-center'>Santosh,Tangail-1902</h6>
                                                <h6 className='text-center'>Marks-sheet</h6>
                                                <h6 className='text-center'>Class Test/Home Work/Assignment/Quiz/Tutorial/Presentation</h6>
                                            </div>

                                            <div>
                                                <h6 className='text-center'>{marks?.semesterId?.name} {marks?.semesterId?.degree} Final Examination</h6>

                                            </div>

                                            <div className='mt-1'>
                                                {/* <p className='text-center mb-1'>Department of {checkDepartmentName(user?.department)}</p> */}
                                            </div>

                                            <div className='mb-2'>
                                                <div className='mt-4 d-flex justify-content-between'>
                                                    <div className='d-flex flex-column'>
                                                        <span className='fw-bold'>Course Code: {marks?.courseCode?.toUpperCase()}</span>
                                                        <span className='fw-bold'>Course Title: {marks?.courseTitle}</span>
                                                        <span className='fw-bold'>Name of the Examiner: {marks?.thirdExaminer?.name}</span>
                                                    </div>
                                                    <div className='d-flex flex-column align-items-end'>
                                                        <span className='fw-bold'>Credit Hour: {marks?.credit}</span>
                                                        <span className='fw-bold'>Full Marks:70
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

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
                                                                Final Exam Mark <br />(70%)
                                                                <br />
                                                                <span className='edit' onClick={() => { setShowMarkModal(true); setThirdExaminerFinal(true) }}>Edit</span>
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

                                                                        <p>{x?.theoryThirdExaminer}</p>
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
                                                <Button variant='primary' className='me-2' onClick={() => setShowModal(true)}>Generate PDF</Button>
                                                {/* <input variant='primary' type="submit" value='Save' className='btn btn-primary' /> */}
                                                <Button variant='success' className='me-2' onClick={() => submitAllMarksThirdExaminer()}>Submit Marks</Button>
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