import { useState } from "react";
import { Button, Card, Form, InputGroup, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import mbstuLogo from "../../../images/mbstu-logo.jpg"
import { AiFillTag } from "react-icons/ai";
import useAuth from "../../../Hooks/useAuth";

const AddTeacher = () => {
    const { user } = useAuth();

    const [email, setEmail] = useState('');
    const [usersByEmail, setUsersByEmail] = useState([]);
    const [isLoadingUserByEmail, setIsLoadingUserByEmail] = useState(false);

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

    const addTeacher = (userId) => {
        console.log('userId ', userId);
        fetch(`http://localhost:5000/api/v1/user/add-teacher/${userId}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
        })
            .then(res => res.json())
            .then(info => {
                if (info?.status === 'success') {
                    Toast.fire({
                        icon: 'success',
                        title: info?.message
                    });
                    findUsersByEmail();
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: info?.message
                    })
                }
            })
    }

    const removeTeacher = (userId) => {
        console.log('userId ', userId);
        fetch(`http://localhost:5000/api/v1/user/remove-teacher/${userId}`, {
            method: 'put',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
        })
            .then(res => res.json())
            .then(info => {
                if (info?.status === 'success') {
                    Toast.fire({
                        icon: 'success',
                        title: info?.message
                    });
                    findUsersByEmail();
                }
                else {
                    Toast.fire({
                        icon: 'error',
                        title: info?.message
                    })
                }
            })
    }


    const findUsersByEmail = () => {
        // console.log('email  ', email);
        if (email.trim() !== '') {
            setIsLoadingUserByEmail(true);
            fetch(`http://localhost:5000/api/v1/user/email/${email.trim()}`, {
                method: 'get',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
                },
            })
                .then(res => res.json())
                .then(info => {
                    // console.log('chairman info = ', info);
                    setUsersByEmail(info?.data);
                    setIsLoadingUserByEmail(false);
                })
        }
    }


    return (
        <>
            <div className='text-center'>
                <div className=' mx-4 my-5'>
                    <h2 className='text-center'>Add Teachers for <span className="text-uppercase">{user?.department}</span>  Department</h2>
                    <div >
                        <InputGroup className="mb-3 w-50 mx-auto">
                            <Form.Control
                                placeholder="Write an email"
                                aria-label="Write an email"
                                onKeyUp={(e) => { setEmail(e.target.value) }}
                            />
                            <Button variant="outline-secondary" id="button-addon2" onClick={() => findUsersByEmail()}>
                                Search
                            </Button>
                        </InputGroup>
                    </div>

                    {
                        isLoadingUserByEmail
                            ?
                            <>
                                <div className='text-center my-4 '>
                                    <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>

                                </div>
                            </>
                            :
                            <>
                                {
                                    usersByEmail.length === 0
                                        ?
                                        <div className='my-4'>

                                            <h4>No user found with </h4>

                                        </div>
                                        :
                                        usersByEmail.map(x =>
                                            <Card key={x?._id} className="mb-3 shadow-sm">
                                                <div className='py-4 px-3'>
                                                    <div className='d-flex'>
                                                        <div >
                                                            <img src={mbstuLogo} width='200px' />
                                                        </div>
                                                        <div className='ms-5'>
                                                            <h4 className='text-start mb-2'> {x?.profile?.firstName + ' ' + x?.profile?.lastName}</h4>
                                                            <br />
                                                            <h5 className='text-start '> Email:  {x?.email}</h5>
                                                            {
                                                                x?.department
                                                                &&
                                                                <h6 className='text-start s'> Department: {x?.department}</h6>
                                                            }

                                                            <div className='text-start'>
                                                                {
                                                                    x?.isStudent
                                                                    &&
                                                                    <>
                                                                        <AiFillTag className=' fs-4' />
                                                                        <span className='ms-1 me-3'>Student</span>
                                                                    </>
                                                                }

                                                                {
                                                                    x?.isTeacher
                                                                    &&
                                                                    <>
                                                                        <AiFillTag className='text-info fs-4' />
                                                                        <span className='ms-1 me-3 text-info'>Teacher</span>
                                                                    </>
                                                                }

                                                                {
                                                                    x?.isDeptChairman
                                                                    &&
                                                                    <>
                                                                        <AiFillTag className='text-primary fs-4' />
                                                                        <span className='ms-1 me-3 text-primary'>Department Chairman</span>
                                                                    </>
                                                                }

                                                                {
                                                                    x?.isAcademicCommittee
                                                                    &&
                                                                    <>
                                                                        <AiFillTag className='text-success fs-4' />
                                                                        <span className='ms-1 me-3 text-success'>Academic Committee</span>
                                                                    </>
                                                                }

                                                                {
                                                                    x?.isHallProvost
                                                                    &&
                                                                    <>
                                                                        <AiFillTag className='text-warning fs-4' />
                                                                        <span className='ms-1 me-3  text-warning'>Hall Provost</span>
                                                                    </>
                                                                }
                                                            </div>

                                                            <div className='text-start pt-3'>
                                                                <Button variant="success" className=''
                                                                    onClick={() => { addTeacher(x?._id) }}
                                                                >
                                                                    Add Teacher
                                                                </Button>
                                                                <br />
                                                                <Button variant="danger" className='mt-3'
                                                                    onClick={() => { removeTeacher(x?._id) }}
                                                                >
                                                                    Remove Teacher
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>


                                                </div>
                                            </Card>
                                        )
                                }
                            </>
                    }











                </div>

            </div>
        </>)
};

export default AddTeacher;