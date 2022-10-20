import React from 'react';
import { Form } from 'react-bootstrap';
import ReactSelect from 'react-select';
import { components } from "react-select";

const Option = (props) => {
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

const CourseTeacherMap = (props) => {
    //console.log("props ", props.register);
    //type ante hobe, 
    const { course_title, credit, course_code, department, semester_code, category, type } = props.course;
    const { register } = props;
    const { setOptionSelected, optionSelected, setTeacherList, teachersOption } = props;
    // const [teachersOption, setTeachersOption] = useState([]);
    // const arrOfTeachers = []
    // useEffect(() => {
    //     props?.teacher?.map(x => {
    //         const obj = {}
    //         obj.label = x?.displayName;
    //         obj.value = x?.email;
    //         arrOfTeachers.push(obj);
    //     })
    //     setTeachersOption(arrOfTeachers)
    // }, [])
    //console.log("teachersOption == ", teachersOption)
    const visibile = {
        visibility: 'visible'
    }
    const invisibile = {
        visibility: 'hidden'
    }

    //console.log('fun ', props?.course?.course_title, ' category ', category);

    return (
        <tr style={{ border: '1px solid black' }}>
            <td className='text-center' style={{ border: '1px solid black' }}>{course_code}</td>
            <td style={{ border: '1px solid black' }}>
                {
                    category === 'optional' ?
                        <Form.Select {...register(`${department}${semester_code}_course_title.${course_code}`, { required: true })}>
                            <option value="">Select a Course</option>
                            {
                                props?.course?.course_title?.map(x => <option key={x} value={x}>{x}</option>)
                            }
                        </Form.Select>
                        :
                        <input className='border-0  w-100' style={{ backgroundColor: 'inherit' }} type="text" readOnly value={course_title} {...register(`${department}${semester_code}_course_title.${course_code}`, { required: true })} />
                }
            </td>
            <td style={{ border: '1px solid black' }}>
                <input className='border-0  w-100' style={{ backgroundColor: 'inherit' }} type="text" readOnly value={type} {...register(`${department}${semester_code}_course_type.${course_code}`, { required: true })} />
            </td>
            <td className='text-center' style={{ border: '1px solid black' }}>
                <input className='border-0  w-25' style={{ backgroundColor: 'inherit' }} type="text" readOnly value={credit} {...register(`${department}${semester_code}_course_credit.${course_code}`, { required: true })} />
            </td>

            {
                type === 'theory' &&
                <td style={{ border: '1px solid black' }}>
                    <Form.Select {...register(`${department}${semester_code}_course_teacher.${course_code}`, { required: true })}>
                        <option value="" className='text-center'>Select a teacher</option>
                        {
                            props?.teachers.map(x => <option key={x?.displayName} value={x.email}>{x?.displayName}</option>)
                        }
                    </Form.Select>
                </td>
            }

            {
                type === 'lab' &&
                <td colspan='3' style={{ border: '1px solid black' }}>
                    <Form.Select {...register(`${department}${semester_code}_course_teacher.${course_code}`, { required: true })}>
                        <option value="" className='text-center'>Select a teacher</option>
                        {
                            props?.teachers.map(x => <option key={x?.displayName} value={x.email}>{x?.displayName}</option>)
                        }
                    </Form.Select>
                </td>
            }

            {
                type === 'project' &&
                <td colspan='3' style={{ border: '1px solid black' }}>
                    <ReactSelect
                        className="w-100 text-center"
                        options={teachersOption}
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        onChange={(selected) => {
                            setOptionSelected(selected);
                            setTeacherList(selected);
                        }}
                        allowSelectAll={true}
                        value={optionSelected}
                    >
                        <Option />
                    </ReactSelect>
                </td>
            }

            {
                type === 'theory' &&
                <td style={{ border: '1px solid black' }}>
                    <Form.Select {...register(`${department}${semester_code}_second_examiner.${course_code}`, { required: true })}>
                        {/* <option value="">Select a second Examiner</option> */}
                        {
                            props?.teachers.map(x => <option key={x?.displayName} value={x.email}>{x?.displayName}</option>)
                        }
                        {/* <span style={errors.course_code ? visibile : invisibile} className='text-danger ps-2' >* Chose Teacher Name</span> */}
                    </Form.Select>
                </td>

            }
            {
                type === 'theory' &&
                <td style={{ border: '1px solid black' }}>
                    <Form.Select {...register(`${department}${semester_code}_third_examiner.${course_code}`, { required: true })}>
                        {/* <option value="">Select a Third Examiner</option> */}
                        {
                            props?.teachers.map(x => <option key={x?.displayName} value={x.email}>{x?.displayName}</option>)
                        }
                        {/* <span style={errors.course_code ? visibile : invisibile} className='text-danger ps-2' >* Chose Teacher Name</span> */}
                    </Form.Select>
                </td>
            }

        </tr>
    );
};

export default CourseTeacherMap;