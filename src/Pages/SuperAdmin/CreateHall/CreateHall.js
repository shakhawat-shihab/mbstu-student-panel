import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

const CreateHall = () => {

    const [changeProvost, setChangeProvost] = useState(true);

    const { register, handleSubmit, reset } = useForm();
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
        console.log('to submit = ', data);
        const hall = {}
        hall.name = data?.name;
        hall.codeName = data?.codeName.toLowerCase();
        hall.email = data?.email.toLowerCase();
        console.log('hall to save ', hall);

        fetch('http:localhost:5000/api/v1/hall/create', {
            method: 'post',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
            body: JSON.stringify(hall)
        })
            .then(res => res.json())
            .then(info => {
                if (info?.status === 'success') {
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

            });
        reset();
    };

    return (
        <div className='px-2 py-4 my-5 shadow-lg container w-75 mx-auto rounded '>
            <h2 className='text-center text-primary fw-bold mb-4'>Create Hall</h2>
            <Form onSubmit={handleSubmit(onSubmit)} className=''>
                <div className="row row-cols-lg-1 row-cols-md-1 row-cols-sm-1">
                    <Form.Group className="mb-3 ">
                        <Form.Label className='text-primary'>Hall Name: </Form.Label>
                        <Form.Control type="text" {...register("name", { required: true })} className="w-100 " />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className='text-primary'>Hall Code Name: </Form.Label>
                        <Form.Control type="text"  {...register("codeName", { required: true })} className="w-100" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className='text-primary'>Email: </Form.Label>
                        <Form.Control type="email"  {...register("email")} className="w-100" />
                    </Form.Group>
                </div>
                <br />
                <div className='text-center my-3'>
                    <Form.Control type="submit" value='Create' className='btn btn-primary' style={{ width: "100px" }} />
                </div>
            </Form>
        </div>
    );
};

export default CreateHall;

