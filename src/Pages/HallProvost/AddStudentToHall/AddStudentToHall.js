import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';

import * as XLSX from 'xlsx';

const AddStudentToHall = () => {

    const [studentId, setStudentId] = useState('');

    const [fileUpload, setFileUpload] = useState();

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



    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, { type: 'buffer' })
                const wsName = wb.SheetNames[0];
                const ws = wb.Sheets[wsName];

                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
        promise.then((d) => {
            // console.log("hehe he ", d);
            setFileUpload(d);
        });
    };


    const onFileUpload = () => {

        let arr = [];
        let supObj = {}

        if (fileUpload[0]['student_id']) {
            fileUpload?.map(x => {
                arr.push(x?.student_id?.trim()?.toLowerCase());
            })
            supObj.studentIds = arr;

            console.log('marks to push file == ', supObj);

            fetch(`https://mbstu-panel-server.onrender.com/api/v1/hall/insert-file`, {
                method: 'put',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
                },
                body: JSON.stringify(supObj)
            })
                .then(res => res.json())
                .then(info => {
                    console.log('after add ', info);

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
        else {

            Toast.fire({
                icon: 'error',
                title: "Please Select a correct File"
            })
        }
    }

    const addStudent = () => {
        if (studentId === '') {
            Toast.fire({
                icon: 'error',
                title: 'Insert a student id'
            })
            return;
        }
        else {
            fetch(`https://mbstu-panel-server.onrender.com/api/v1/hall/insert/${studentId}`, {
                method: 'put',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
                },
            })
                .then(res => res.json())
                .then(info => {
                    console.log('after add ', info);

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
            <h2 className='text-center text-primary fw-bold mb-4'>Add Student to Hall</h2>

            <div className='container w-100 ms-4 py-2 mb-5'>
                <div className="d-flex">
                    <h4 className='text-primary mt-3 mb-0 me-3 '>Please Select a file: </h4>
                    <input type="file" className='mt-3' onChange={(e) => {
                        const file = e.target.files[0];
                        readExcel(file);
                    }} />
                </div>
                <p className='text-danger fs-6 ps-3 mt-1 mb-3'> *column name must be student_id</p>
                {/* <br /> */}
                <Button variant='primary' className='btn btn-primary' onClick={onFileUpload}>Upload File</Button>
            </div>

            <div className=''>
                <div className="row row-cols-lg-1 row-cols-md-1 row-cols-sm-1 px-4 ms-1">
                    <Form.Group className="mb-3 ">
                        <Form.Label className='text-primary'>Student ID: </Form.Label>
                        <Form.Control type="text" className="w-100 " onKeyUp={(e) => { setStudentId(e.target.value.toLowerCase().trim()) }} />
                    </Form.Group>
                </div>
                <br />
                <div className='text-center my-3'>
                    <Button type="submit" className='btn btn-success' onClick={() => addStudent()} >Add Student</Button>
                    {/* <Button type="submit" className='btn btn-danger ms-3' onClick={() => removeStudent()} >Remove Student</Button> */}
                </div>
            </div>
        </div>
    );
};

export default AddStudentToHall;