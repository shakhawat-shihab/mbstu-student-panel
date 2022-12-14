import React, { useState } from 'react';
import { Button, Col, InputGroup } from 'react-bootstrap';
import Form from 'react-bootstrap/form';
import { useForm } from 'react-hook-form';
import ReactSelect from 'react-select';
import Swal from 'sweetalert2';
import useAuth from '../../../Hooks/useAuth';
import { components } from "react-select";
const Option = (props) => {
    console.log('props ', props)
    return (
        <div>
            <components.Option {...props}>
                <input
                    type="checkbox"
                    checked={props.isSelected}
                    onChange={() => null}
                />{" "}
                <label>{props.label}</label>
            </components.Option>
        </div>
    );
};
const CreateCourse = () => {
    const { user } = useAuth();
    const { department } = user;
    // console.log(department);
    const { register, handleSubmit, reset } = useForm();
    const [category, setCategory] = useState('compulsory');
    const [isDepartmental, setIsDepartmental] = useState(true);
    const [counter, setCounter] = useState(0);
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
    const [optionSelected, setOptionSelected] = useState(null);
    const [departmentList, setDepartmentList] = useState([]);
    const courseOptions = [
        { value: "cse", label: "Computer Science and Engineering" },
        { value: "ict", label: "Information and Communication Technology" },
        { value: "te", label: "Textile Engineering" },
        { value: "me", label: "Mechanical Engineering" },
        { value: "esrm", label: "Environmental Science and Resource Management" },
        { value: "cps", label: "Criminology and Police Science" },
        { value: "ftns", label: "Food Technology and Nutritional Science" },
        { value: "bge", label: "Biotechnology and Genetic Engineering" },
        { value: "bmb", label: "Biochemistry and Molecular Biology" },
        { value: "phar", label: "Pharmacy" },
        { value: "chem", label: "Chemistry" },
        { value: "math", label: "Mathematics" },
        { value: "phy", label: "Physics" },
        { value: "stat", label: "Statistics" },
        { value: "bba", label: "Business Administration" },
        { value: "acc", label: "Accounting" },
        { value: "mng", label: "Management" },
        { value: "eco", label: "Economics" },
        { value: "eng", label: "English" },
    ];
    const onSubmit = data => {
        // console.log('to submit = ', data);
        let course = {};
        course.courseCode = data.courseCode.trim();
        course.category = data.category;
        course.semesterCode = parseInt(data.semesterCode);
        course.credit = parseFloat(data?.credit);
        course.type = data.type;
        course.department = data.department;
        course.departmental = data.departmental

        course.type = data.type;

        if (data.category === 'optional') {
            let i = 0;
            const array = [];
            array.push(data.courseTitle);
            while (i < counter) {
                if (data[`courseTitle_${i}`].trim()) {
                    array.push(data[`courseTitle_${i}`]);
                }
                i++;
            }
            course.courseTitle = array;
        }
        else {
            const array = [];
            array.push(data.courseTitle);
            course.courseTitle = array;
        }
        const deptRelatedArray = []
        departmentList?.map(x => {
            deptRelatedArray.push(x.value);
        })
        course.relatedDepartment = deptRelatedArray;
        console.log('course to save ', course);
        fetch('https://mbstu-panel-server.onrender.com/api/v1/course/create', {
            method: 'post',
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
            body: JSON.stringify(course)
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
        // reset();
    };

    //console.log('category ', category)
    return (
        <div>
            <div className='container-fluid shadow-lg w-75 my-5 py-2'>
                <h4 className='text-center text-bolder py-4'>Create Course</h4>
                <Form onSubmit={handleSubmit(onSubmit)} className=''>
                    <div className="row row-cols-lg-1 row-cols-md-1 row-cols-sm-1">
                        <Form.Group className="mb-3 ">
                            <Form.Label className='text-primary'>Course Code: </Form.Label>
                            <Form.Control type="text" {...register("courseCode", { required: true })} className="w-100 " />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            {
                                category === 'compulsory' ?
                                    <>
                                        <Form.Label className='text-primary'>Course Title: </Form.Label>
                                        <Form.Control className='w-100' type="text" {...register("courseTitle", { required: true })} />
                                    </>
                                    :
                                    <>
                                        <Form.Label className='text-primary'>Course Title 1: </Form.Label>
                                        <Form.Control className='w-100 mb-3' type="text" {...register("courseTitle", { required: true })}
                                        />
                                        {Array.from(Array(counter)).map((c, index) => {
                                            return (
                                                <>
                                                    <Form.Label className='text-primary'>Course Title {index + 2}: </Form.Label>
                                                    <InputGroup className="mb-3 w-100">
                                                        <Form.Control type="text" key={index} {...register(`courseTitle_${index}`, { required: true })} className="w-100" />
                                                    </InputGroup>
                                                </>
                                            );
                                        })}
                                        <Col className='mt-2'>
                                            <Button className=' ' variant="outline-success" onClick={() => setCounter(counter + 1)}>Add Course Title</Button>
                                            <Button className='ms-2' onClick={() => counter >= 1 && setCounter(counter - 1)} variant="outline-danger" id="button-addon2">
                                                Remove
                                            </Button>
                                        </Col>
                                    </>
                            }
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='text-primary'>Credit: </Form.Label>
                            <Form.Control type="number" step="0.01" {...register("credit", { required: true })} className="w-100" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='text-primary'>Select Category:</Form.Label>
                            <br></br>
                            <Form.Select className='w-100' {...register("category", { required: true })} onChange={(e) => setCategory(e.target.value)}>
                                {/* <option value="">Select Category</option> */}
                                <option selected value="compoulsary">Compoulsary</option>
                                <option value="optional">Optional</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='text-primary'>Semester Name:</Form.Label>
                            <br></br>
                            <Form.Select className='w-100' {...register("semesterCode", { required: true })}>
                                <option value="">Select a Semester:</option>
                                <option value="1">1st Year 1st Semester</option>
                                <option value="2">1st Year 2nd Semester</option>
                                <option value="3">2nd Year 1st Semester</option>
                                <option value="4">2nd Year 2nd Semester</option>
                                <option value="5">3rd Year 1st Semester</option>
                                <option value="6">3rd Year 2nd Semester</option>
                                <option value="7">4th Year 1st Semester</option>
                                <option value="8">4th Year 2nd Semester</option>
                            </Form.Select>
                        </Form.Group>


                        <Form.Group className="mb-3">
                            <Form.Label className='text-primary'>Department: </Form.Label>
                            <Form.Control type="text" readOnly value={department} {...register("department", { required: true })} className="w-100" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='text-primary'>Select Departmental or Non Departmental:</Form.Label>
                            <br></br>
                            <Form.Select className='w-100' {...register("departmental", { required: true })}
                                onChange={(e) => setIsDepartmental(!isDepartmental)}
                            >
                                {/* <option value="">Select a Semester:</option> */}
                                <option value="departmental" selected >Departmental</option>
                                <option value="non departmental" >Non Departmental</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3 w-100">
                            {
                                isDepartmental == false &&
                                <ReactSelect
                                    className="w-100"
                                    options={courseOptions}
                                    isMulti
                                    closeMenuOnSelect={false}
                                    hideSelectedOptions={false}
                                    onChange={(selected) => {
                                        setOptionSelected(selected);
                                        setDepartmentList(selected);
                                    }}
                                    allowSelectAll={true}
                                    value={optionSelected}
                                >
                                    <Option />
                                </ReactSelect>

                            }
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className='text-primary'>Course Type:</Form.Label>
                            <br></br>
                            <Form.Select className='w-100' {...register("type", { required: true })}>
                                <option value=""> Select Type:</option>
                                <option value="theory">Theory</option>
                                <option value="lab">Lab</option>
                                <option value="project">Project</option>
                            </Form.Select>
                        </Form.Group>
                    </div>
                    <br />
                    <div className='text-center my-3'>
                        <Form.Control type="submit" value='Create' className='btn btn-primary' style={{ width: "100px" }} />
                    </div>
                </Form>

            </div>
        </div>
    );
};

export default CreateCourse;