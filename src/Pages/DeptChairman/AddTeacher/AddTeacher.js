import React, { useEffect, useState } from 'react';
import { Form, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import useAuth from '../../../Hooks/useAuth';

const AddTeacher = () => {
    const { dept } = useAuth();
    const [teachers, setTeachers] = useState([]);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [saveButtonState, setSaveButtonState] = useState(true);
    console.log("saveButtonState = ", saveButtonState)
    useEffect(() => {
        fetch(`http://localhost:5000/teachers/${dept}`)
            .then(res => res.json())
            .then(data => {
                console.log("teachers ", data);
                setTeachers(data);
            })
    }, [saveButtonState])
    const onSubmit = data => {
        data.email = data.email.toLowerCase();
        data.department = dept;
        console.log(data);
        fetch('http://localhost:5000/add-teacher', {
            method: 'put',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log("data ", data);
                setSaveButtonState(!saveButtonState);
                if (data.insertedId) {
                    console.log("data ", data);
                }
            });
    };

    const visibile = {
        visibility: 'visible'
    }
    const invisibile = {
        visibility: 'hidden'
    }


    return (
        <div className='container-fluid shadow-lg w-75 my-5 py-2'>
            <h4 className='text-center'>Add teacher</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Form.Group className=" w-100 mx-auto">
                    <Form.Label className='text-primary'>Name:</Form.Label>
                    <Form.Control {...register("displayName", { required: true })} type='text' placeholder="Enter Full Name" className="w-100"
                    />
                    <span style={errors.displayName ? visibile : invisibile} className='text-info ps-2' >* Enter a name: </span>
                </Form.Group>
                <Form.Group className=" w-100 mx-auto">
                    <Form.Label className='text-primary'>Email:</Form.Label>
                    <Form.Control {...register("email", { required: true })} type='email' placeholder="Enter a valid email" className="w-100"
                    />
                    <span style={errors.email ? visibile : invisibile} className='text-info ps-2' >* Enter an email </span>
                </Form.Group>
                <div className='text-center mb-3'>
                    <input type="submit" value='Add Teacher' className="btn btn-primary" onClick={() => { }} />
                </div>
            </Form>

            <h6 className='text-primary mt-5 mb-3'>Current Teachers: </h6>
            <Table responsive striped bordered hover>
                <thead>
                    <tr style={{ border: "1px solid black" }}>
                        <th style={{ border: "1px solid black" }}>Teacher Name</th>
                        <th style={{ border: "1px solid black" }}>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        teachers.map(x => <tr key={x?.email} style={{ border: "1px solid black" }}>
                            <td style={{ border: "1px solid black" }}>{x?.displayName}</td>
                            <td style={{ border: "1px solid black" }}>{x?.email}</td>
                        </tr>)
                    }
                </tbody>
            </Table>

        </div>
    );
};

export default AddTeacher;