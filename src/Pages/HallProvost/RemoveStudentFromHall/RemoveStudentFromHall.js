import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

const RemoveStudentFromHall = () => {
    const [studentId, setStudentId] = useState('');

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


    const removeStudent = () => {
        if (studentId === '') {
            Toast.fire({
                icon: 'error',
                title: 'Insert a student id'
            })
            return;
        }
        else {
            fetch(`https://mbstu-panel-server.onrender.com/api/v1/hall/remove/${studentId}`, {
                method: 'put',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
                },
            })
                .then(res => res.json())
                .then(info => {
                    console.log('after remove ', info);
                    if (info?.status === 'success') {
                        Toast.fire({
                            icon: 'success',
                            title: info?.message
                        });
                        // setStudentId('');
                    }
                    else {
                        Toast.fire({
                            icon: 'error',
                            title: info?.message
                        })
                    }
                })
        }
    }


    return (
        <div className='px-2 py-4 my-5 shadow-lg container w-75 mx-auto rounded '>
            <h2 className='text-center text-primary fw-bold mb-4'>Remove Student from Hall</h2>
            <div className=''>
                <div className="row row-cols-lg-1 row-cols-md-1 row-cols-sm-1">
                    <Form.Group className="mb-3 ">
                        <Form.Label className='text-primary'>Student ID: </Form.Label>
                        <Form.Control type="text" className="w-100 " onKeyUp={(e) => { setStudentId(e.target.value.toLowerCase().trim()) }} />
                    </Form.Group>
                </div>
                <br />
                <div className='text-center my-3'>
                    {/* <Button type="submit" className='btn btn-success' onClick={() => addStudent()} >Add Student</Button> */}
                    <Button type="submit" className='btn btn-danger ms-3' onClick={() => removeStudent()} >Remove Student</Button>
                </div>
            </div>
        </div>
    );
};

export default RemoveStudentFromHall;