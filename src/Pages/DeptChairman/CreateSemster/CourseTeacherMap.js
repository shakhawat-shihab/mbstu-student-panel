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
    const { courseTitle, credit, courseCode, department, semesterCode, category, type } = props.course;
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

    //console.log('fun ', props?.course?.courseTitle, ' category ', category);

    return (
        <tr style={{ border: '1px solid black' }}>
            <td className='text-center' style={{ border: '1px solid black' }}>{courseCode}</td>
            <td style={{ border: '1px solid black' }}>
                {
                    category === 'optional' ?
                        <Form.Select {...register(`${department}${semesterCode}_courseTitle.${courseCode}`, { required: true })}>
                            <option value="">Select a Course</option>
                            {
                                props?.course?.courseTitle?.map(x => <option key={x} value={x}>{x}</option>)
                            }
                        </Form.Select>
                        :
                        <input className='border-0  w-100' style={{ backgroundColor: 'inherit' }} type="text" readOnly value={courseTitle[0]} {...register(`${department}${semesterCode}_courseTitle.${courseCode}`, { required: true })} />
                }
            </td>
            <td style={{ border: '1px solid black' }}>
                <input className='border-0  w-100' style={{ backgroundColor: 'inherit' }} type="text" readOnly value={type} {...register(`${department}${semesterCode}_course_type.${courseCode}`, { required: true })} />
            </td>
            <td className='text-center' style={{ border: '1px solid black' }}>
                <input className='border-0  w-25' style={{ backgroundColor: 'inherit' }} type="text" readOnly value={credit} {...register(`${department}${semesterCode}_course_credit.${courseCode}`, { required: true })} />
            </td>

            {
                type === 'theory' &&
                <td style={{ border: '1px solid black' }}>
                    <Form.Select {...register(`${department}${semesterCode}_course_teacher.${courseCode}`, { required: true })}>
                        <option value="" className='text-center'>Select a teacher</option>
                        {
                            props?.teachers.map(x => {
                                // console.log(x);
                                return (
                                    <option key={x?.profile?.['_id']} value={`${x?.profile?.['_id']}=/=${x?.profile?.['firstName']} ${x?.profile?.['lastName']}`}>
                                        {
                                            x?.profile?.['firstName']
                                                ?
                                                x?.profile?.['firstName'] + ' ' + x?.profile?.['lastName'] + '    (' + x.department + ')'
                                                :
                                                x?.email + '    (' + x.department + ')'
                                        }
                                    </option>
                                )
                            })
                        }
                    </Form.Select>
                </td>
            }

            {
                type === 'lab' &&
                <td colspan='3' style={{ border: '1px solid black' }}>
                    <Form.Select {...register(`${department}${semesterCode}_course_teacher.${courseCode}`, { required: true })}>
                        <option value="" className='text-center'>Select a teacher</option>
                        {
                            props?.teachers.map(x => {
                                // console.log(x);
                                return (
                                    <option key={x?.profile?.['_id']} value={`${x?.profile?.['_id']}=/=${x?.profile?.['firstName']} ${x?.profile?.['lastName']}`}>
                                        {
                                            x?.profile?.['firstName']
                                                ?
                                                x?.profile?.['firstName'] + ' ' + x?.profile?.['lastName'] + '    (' + x.department + ')'
                                                :
                                                x?.email + '    (' + x.department + ')'
                                        }
                                    </option>
                                )
                            })
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
                    <Form.Select {...register(`${department}${semesterCode}_second_examiner.${courseCode}`, { required: true })}>
                        <option value="" className='text-center'>Select a teacher</option>
                        {
                            props?.teachers.map(x => {
                                // console.log(x);
                                return (
                                    <option key={x?.profile?.['_id']} value={`${x?.profile?.['_id']}=/=${x?.profile?.['firstName']} ${x?.profile?.['lastName']}`}>
                                        {
                                            x?.profile?.['firstName']
                                                ?
                                                x?.profile?.['firstName'] + ' ' + x?.profile?.['lastName'] + '    (' + x.department + ')'
                                                :
                                                x?.email + '    (' + x.department + ')'
                                        }
                                    </option>
                                )
                            })
                        }
                        {/* <span style={errors.courseCode ? visibile : invisibile} className='text-danger ps-2' >* Chose Teacher Name</span> */}
                    </Form.Select>
                </td>

            }
            {
                type === 'theory' &&
                <td style={{ border: '1px solid black' }}>
                    <Form.Select {...register(`${department}${semesterCode}_third_examiner.${courseCode}`, { required: true })}>
                        <option value="" className='text-center'>Select a teacher</option>
                        {
                            props?.teachers.map(x => {
                                // console.log(x);
                                return (
                                    <option key={x?.profile?.['_id']} value={`${x?.profile?.['_id']}=/=${x?.profile?.['firstName']} ${x?.profile?.['lastName']}`}>
                                        {
                                            x?.profile?.['firstName']
                                                ?
                                                x?.profile?.['firstName'] + ' ' + x?.profile?.['lastName'] + '    (' + x.department + ')'
                                                :
                                                x?.email + '    (' + x.department + ')'
                                        }
                                    </option>
                                )
                            })
                        }

                        {/* <span style={errors.courseCode ? visibile : invisibile} className='text-danger ps-2' >* Chose Teacher Name</span> */}
                    </Form.Select>
                </td>
            }

        </tr >
    );
};

export default CourseTeacherMap;