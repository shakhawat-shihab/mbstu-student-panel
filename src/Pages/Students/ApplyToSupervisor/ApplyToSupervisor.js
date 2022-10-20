import React, { useEffect, useState } from 'react';
import { Button, Col, Form, InputGroup, Nav, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import Application from '../Application/Application';

const ApplyToSupervisor = () => {
    const { courseCode, semesterCode } = useParams();
    const { user } = useAuth();
    const email = user?.email;
    const [student, setStudent] = useState({});
    const [isRunning, setIsRunning] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [teachers, setTeachers] = useState([]);
    const [counter, setCounter] = useState(0);
    const [waitMessage, setWaitMessage] = useState(false);
    const [message, setMessage] = useState(false);
    const [errorMessageForId, setErrorMessageForId] = useState('');
    const [state, setState] = useState(1);
    const [proposals, setProposals] = useState([]);
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm();

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
        fetch(`http://localhost:5000/myProposal/${courseCode}/${student.s_id}`)
            .then(res => res.json())
            .then(data => {
                console.log("proposals ", data);
                setProposals(data);
                setWaitMessage(false);
                data.map(x => {
                    if (x.status === 'accepted') {
                        setMessage('Your Application is Accepted!')
                        setWaitMessage(true);
                    }
                    if (x.status === 'pending') {
                        setMessage("You have done an application already wait for response")
                        setWaitMessage(true);
                    }
                })
            })
    }, [courseCode, student, state])
    useEffect(() => {
        fetch(`http://localhost:5000/students/${email}`)
            .then(res => res.json())
            .then(data => {
                // console.log("student ", data);
                setStudent(data);
            })
    }, [email])

    useEffect(() => {
        fetch(`http://localhost:5000/semesters/isRunning/${courseCode}/${semesterCode}`)
            .then(res => res.json())
            .then(data => {
                if (Object.keys(data).length === 0) {
                    setIsRunning(false);
                }
                else {
                    setIsRunning(true);
                }
                setIsLoading(false);
                setTeachers(data);
            })
    }, [semesterCode, courseCode]);
    // useEffect use kore teacher nam khuje ber korbo jar kase se already allocated


    const onSubmit = data => {
        //console.log('application ', data);
        let i = 0;
        const array = [];
        array.push(data.student_id);
        while (i < counter) {
            if (data[`student_id_${i}`].trim()) {
                array.push(data[`student_id_${i}`].trim().toLowerCase());
            }
            i++;
        }



        const application = {}
        application.subject = data.subject;
        application.description = data.description;
        application.teacher = data.teacher;
        application.status = "pending";
        application.course_code = courseCode;
        application.students = array;


        fetch(`http://localhost:5000/application-to-supervisor/id-check/${courseCode}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(application.students)
        })
            .then(res => res.json())
            .then(data => {
                console.log("app ", data);
                if (data.length === 0) {
                    console.log('student id not exist')
                    fetch('http://localhost:5000/application-to-supervisor', {
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
                                    title: 'Successfully Applied to Supervisor'
                                })
                                reset();
                            }
                        });
                }
                else {
                    console.log('student id already exist')
                    Toast.fire({
                        icon: 'error',
                        title: "You can't make group with these students!!"
                    })
                    setErrorMessageForId('The Id you inserted already applied to superrvisor')
                }
            });

        console.log('application to push ', application);
        // fetch('http://localhost:5000/application-to-supervisor', {
        //     method: 'put',
        //     headers: {
        //         'content-type': 'application/json'
        //     },
        //     body: JSON.stringify(application)
        // })
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log("data ", data);
        //         if (data.insertedId) {
        //             Toast.fire({
        //                 icon: 'success',
        //                 title: 'Successfully Applied to Supervisor'
        //             })
        //             reset();
        //         }
        //     });

    }
    return (
        <div>
            <div className='container my-5'>
                <Nav justify variant="pills" defaultActiveKey="1" >
                    <Nav.Item>
                        <Nav.Link onClick={() => { setState(1) }} eventKey="1" >My Application</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={() => { setState(2) }} eventKey="link-1" >Apply For Supervisor</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
            {
                state === 1 ?
                    <>
                        <div className='container my-4 py-3 w-100'>
                            {/* <h4 className='text-center text-primary mb-4'>My Applications</h4> */}
                            {
                                proposals?.map(x =>
                                    <Application key={x._id} details={x}></Application>)
                            }
                        </div>
                    </>
                    :
                    isLoading
                        ?
                        <div className='text-center my-5 py-5 '>
                            <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                        :
                        waitMessage ?
                            <h5 className='text-info text-center my-3'>{message}</h5>
                            :
                            <>
                                {
                                    isRunning
                                        ?
                                        <div className='w-75 mx-auto shadow-lg px-4 py-5'>
                                            <h2 className='text-center'>Apply </h2>
                                            <Form onSubmit={handleSubmit(onSubmit)}>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label className='text-primary'>Subject</Form.Label>
                                                    <Form.Control {...register("subject", { required: true })} type="text" placeholder="Write the Subject" />
                                                </Form.Group>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label className='text-primary'>Teacher List</Form.Label>
                                                    <Form.Select {...register("teacher", { required: true })}>
                                                        <option value="">Select teacher</option>
                                                        {
                                                            teachers.map(x => (<option key={x?.email} value={x?.email}>{x?.displayName}</option>)
                                                            )
                                                        }
                                                    </Form.Select>
                                                </Form.Group>
                                                <Form.Group className="mb-3" >
                                                    <Form.Label className='text-primary'>Give a short description on which type of work you want to do</Form.Label>
                                                    <Form.Control {...register("description", { required: true })} as="textarea" rows={3} />
                                                </Form.Group>
                                                <Form.Group className="mb-3" >

                                                    <Form.Label className='text-primary'>Student Id 1: </Form.Label>
                                                    <Form.Control className='w-75 mb-3' type="text" value={student?.s_id} {...register("student_id", { required: true })}
                                                    />
                                                    {Array.from(Array(counter)).map((c, index) => {
                                                        return (
                                                            <>
                                                                <Form.Label className='text-primary'>Student Id {index + 2}: </Form.Label>
                                                                <InputGroup className="mb-3 w-75">
                                                                    <Form.Control type="text" key={index} {...register(`student_id_${index}`, { required: true })} className="w-75 " />
                                                                </InputGroup>
                                                            </>
                                                        );
                                                    })}
                                                    <Col className='mt-2'>
                                                        <Button className=' ' variant="outline-success" onClick={() => setCounter(counter + 1)}>Add Group mate</Button>
                                                        <Button className='ms-2' onClick={() => counter >= 1 && setCounter(counter - 1)} variant="outline-danger" id="button-addon2">
                                                            Remove
                                                        </Button>
                                                    </Col>
                                                </Form.Group>
                                                <br />
                                                <p className='text-danger' >{errorMessageForId}</p>
                                                <div className='my-3'>
                                                    <Form.Control type="submit" value='Apply' className='btn btn-primary w-75' />
                                                </div>
                                            </Form>
                                        </div>
                                        :
                                        <h5 className='text-center text-danger'>Sorry there is no running semester</h5>

                                }
                            </>

            }

        </div >
    );
};

export default ApplyToSupervisor;