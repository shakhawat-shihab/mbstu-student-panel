import React, { useEffect, useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

const BacklogCourseRegistration = (props) => {
    const history = useHistory()
    const { name, id, department, session, hall_code, hall_name, backlogCourses, applications } = props
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [totalCreditTaken, setTotalCreditTaken] = useState(0);
    const [alreadyCreditTaken, setAlreadyCreditTaken] = useState(0);
    const [currentCredit, setCurrentCredit] = useState(0);
    const [creditError, setCreditError] = useState('');
    useEffect(() => {
        let sum = 0;
        applications.map(x => {
            sum += x.totalCredit;
            x?.backlogCourses.map(b => {
                const find = backlogCourses.find(bc => bc.courseCode === b.courseCode)
                if (find) {
                    backlogCourses[backlogCourses.indexOf(find)].isApplied = true;
                    console.log(backlogCourses.indexOf(find))
                    console.log(find)
                }

            })
        })
        setTotalCreditTaken(sum);
        setAlreadyCreditTaken(sum);
        console.log('backlogCourses ', backlogCourses);
    }, [])
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
    const onSubmit = data => {
        //console.log('error ', errors);
        console.log('form data ', data);
        const backlog = [];
        for (const key in data) {
            if (key.endsWith('_check') && data[`${key}`] === true) {
                //console.log(key)
                const obj = {}
                obj.courseCode = data[`${key.split("_")[0]}_code`];
                obj.course_title = data[`${key.split("_")[0]}_title`];
                obj.credit = data[`${key.split("_")[0]}_credit`];
                backlog.push(obj)
            }
        }
        //console.log(backlog)
        const application = {}
        application.s_id = data.id;
        application.displayName = data.name;
        application.department = data.department;
        application.session = data.session;
        application.hall_code = data.hall_code;
        application.semester = data.semester;
        application.semester_code = data.semester_code;
        application.backlogCourses = backlog;
        application.totalCredit = currentCredit;
        application.isPaymentDone = false;
        // application.regularCourses = regularCourses.map(c => ({ courseCode: c.courseCode, course_title: c.course_title, credit: c.credit }))
        console.log('form to push ', application);
        if (totalCreditTaken < 27) {
            fetch('http://localhost:5000/application-course-registration', {
                method: 'put',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(application)
            })
                .then(res => res.json())
                .then(data => {
                    console.log("data ", data);
                    if (data.insertedId) {
                        Toast.fire({
                            icon: 'success',
                            title: 'Successfully Regsitered'
                        })
                        reset();
                        history.push('/home')
                    }
                });
        }
        else {
            Toast.fire({
                icon: 'error',
                title: "You can't take more than 27 credit in a semester"
            })
        }
    };
    return (
        <div>
            <div className='container-fluid shadow-lg rounded w-75 my-5 py-2'>
                <h4 className='text-center py-3 fw-bold'> Course Registration from</h4>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <h5>
                        <input type='text' {...register("semester", { required: true })} className="w-100 text-center border-0" value={` Backlog courses `} />
                    </h5>

                    <div className="row row-cols-lg-2 row-cols-md-2 row-cols-sm-1">
                        <Form.Group className="mb-3">
                            <Form.Label className='text-danger'>Name: </Form.Label>
                            <input type='text' {...register("name")} className="w-100" defaultValue={name} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className='text-danger'>ID: </Form.Label>
                            <input type='text' {...register("id", { required: true })} className="w-100 text-uppercase" value={id} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className='text-danger'>Department: </Form.Label>
                            <input type='text'  {...register("department", { required: true })} className="w-100" value={department} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className='text-danger'>Session: </Form.Label>
                            <input type='text' {...register("session", { required: true })} className="w-100" value={session} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className='text-danger'>Hall: </Form.Label>
                            <input type='text' {...register("hall_name")} className="w-100" value={hall_name} />
                        </Form.Group>
                        <input type='text' hidden {...register("hall_code", { required: true })} className="w-100" value={hall_code} />
                        {/* <input type='text' hidden {...register("semester_code", { required: true })} className="w-100" value={semesterCode} /> */}
                    </div>


                    <br />


                    <Form.Group className='mb-3'>
                        <Form.Label className='text-danger'>Backlog Courses: </Form.Label>
                        <Table responsive striped bordered hover className='text-center' style={{ border: "1px solid black" }}>
                            <thead>
                                <tr style={{ border: "1px solid black" }}>
                                    <th style={{ border: "1px solid black" }}>Course Code</th>
                                    <th style={{ border: "1px solid black" }}>Course Title</th>
                                    {/* <th style={{ border: "1px solid black" }}>Status</th> */}
                                    <th style={{ border: "1px solid black" }}>Check to select</th>
                                    <th style={{ border: "1px solid black" }}>Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    backlogCourses?.map(x => {
                                        // if (x.isRunningCourse) {
                                        return (<>
                                            {


                                                <tr key={`${x.courseCode}`} className='text-center' style={{ border: "1px solid black" }}>
                                                    <td style={{ border: "1px solid black" }}>
                                                        <input type='text' {...register(`${x?.courseCode}_code`)} className="w-100 border-0 text-center input-color-inherit" value={x?.courseCode} />
                                                    </td>
                                                    <td style={{ border: "1px solid black" }}>
                                                        <input type='text' {...register(`${x?.courseCode}_title`)} className="w-100 border-0 text-center input-color-inherit" value={x?.course_title} />
                                                    </td>
                                                    <td style={{ border: "1px solid black" }}>

                                                        <Form.Check
                                                            inline
                                                            size='lg'
                                                            type='checkbox'
                                                            label="Select"
                                                            id={`${x?.courseCode}_check`}
                                                            {...register(`${x?.courseCode}_check`)}
                                                            onChange={(e) => {
                                                                //console.log(`${x?.courseCode}_check`, e.target.checked)
                                                                if (e.target.checked) {
                                                                    const sum = totalCreditTaken + parseFloat(x?.credit)
                                                                    setTotalCreditTaken(sum)
                                                                    setCurrentCredit(currentCredit + parseFloat(x?.credit))
                                                                    if (sum > 27) {
                                                                        setCreditError("You can't take more than 27 credit")
                                                                    }

                                                                }
                                                                else {
                                                                    const sum = totalCreditTaken - parseFloat(x?.credit)
                                                                    setTotalCreditTaken(sum)
                                                                    setCurrentCredit(currentCredit - parseFloat(x?.credit))
                                                                    if (sum <= 27) {
                                                                        setCreditError("")
                                                                    }

                                                                }
                                                            }
                                                            }
                                                        />
                                                    </td>
                                                    <td style={{ border: "1px solid black" }}>
                                                        <input type='text' {...register(`${x?.courseCode}_credit`)} className="w-100 border-0 text-center input-color-inherit" value={x?.credit} />
                                                    </td>
                                                </tr>
                                            }
                                        </>)

                                        // }
                                    })
                                }
                                <tr className='text-center' style={{ border: "1px solid black" }}>
                                    <td></td>
                                    <td></td>
                                    <td style={{ border: "1px solid black" }} className='fw-bold'>Sum of selected courses Credit</td>
                                    <td className='fw-bold'>{currentCredit}</td>
                                </tr>
                                <tr className='text-center' style={{ border: "1px solid black" }}>
                                    <td></td>
                                    <td></td>
                                    <td style={{ border: "1px solid black" }} className='fw-bold'>Already Taken Credit</td>
                                    <td className='fw-bold'>{alreadyCreditTaken}</td>
                                </tr>
                                <tr className='text-center' style={{ border: "1px solid black" }}>
                                    <td></td>
                                    <td></td>
                                    <td style={{ border: "1px solid black" }} className='fw-bold'>Total Credit</td>
                                    <td className='fw-bold'>{totalCreditTaken}</td>
                                </tr>
                            </tbody>
                        </Table>
                        {
                            creditError
                            &&
                            <span className='text-danger'> {creditError} </span>
                        }

                    </Form.Group>

                    <h4 className='text-center'>Total Credits taken {totalCreditTaken}</h4>
                    <div className='text-center'>
                        <input type="submit" value='Register' className='btn btn-primary' />
                    </div>
                </Form>

            </div>
        </div>
    );
};

export default BacklogCourseRegistration;