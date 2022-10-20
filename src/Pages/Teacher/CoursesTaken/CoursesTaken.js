import React, { useEffect, useState } from 'react';
import { Button, Card, Nav } from 'react-bootstrap';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';

const TakenCourses = () => {
    const { user } = useAuth();
    const [semesters, setSemesters] = useState([]);
    const email = user?.email;
    //const email = 'lubnaju@yahoo.com';
    const [state, setState] = useState(1);
    let { path, url } = useRouteMatch();
    //console.log('path = ', path, ' and url = ', url)
    useEffect(() => {
        //console.log('email ', email);
        fetch(`http://localhost:5000/courses-taken/${email}/${state}`)
            .then(res => res.json())
            .then(data => {
                console.log('state ', state, " data ", data);
                // const arr = [];
                // data?.map(x => {
                //     x?.courses?.map(i => {
                //         if (i?.email === email) {
                //             //console.log('course ', i?.course_code)
                //             const obj = {};
                //             obj._id = x?._id;
                //             obj.session = x?.session;
                //             obj.course_code = i?.course_code;
                //             obj.course_title = i?.course_title;
                //             arr.push(obj);
                //         }
                //     })
                // })
                // console.log(arr);
                setSemesters(data);
            })
    }, [email, state])

    return (
        <div className='text-center'>
            <h3 className='py-5'>List of taken courses</h3>
            <div className=' container mt-2'>
                <Nav justify variant="pills" defaultActiveKey="1" >
                    <Nav.Item>
                        <Nav.Link onClick={() => { setState(1) }} eventKey="1" >My Courses</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={() => { setState(2) }} eventKey="link-1" >Second Examineer</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={() => { setState(3) }} eventKey="link-2" >Third Examineer</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>

            {/* {
                state === 1 && */}
            <div className='row container mx-auto my-5'>
                {
                    semesters?.map(x =>
                        x?.courses?.map(c => {
                            return (<div className='col-lg-3 col-sm-4 col-12' key={`${x?.semester_id}_${c.course_code}`}>
                                <Card style={{ border: "1px solid black" }} className="mb-3">
                                    <Card.Body>
                                        <Card.Title> {c?.course_title}</Card.Title>
                                        <Card.Text>
                                            {c?.course_code}
                                        </Card.Text>
                                        <Card.Text>
                                            Session: {x?.session}
                                        </Card.Text>
                                        {
                                            state === 1 &&
                                            <Link to={`${url}/${x?.semester_id}/${c?.course_code}`}>
                                                <Button variant="primary"
                                                // onClick={() => { history.push(`${url}/semester_id/${x?._id}`) }}
                                                >
                                                    View Details
                                                </Button>
                                            </Link>
                                        }
                                        {
                                            state === 2 &&
                                            <Link to={`${url}/second-examiner/${x?.semester_id}/${c?.course_code}`}>
                                                <Button variant="primary"
                                                // onClick={() => { history.push(`${url}/semester_id/${x?._id}`) }}
                                                >
                                                    View Details
                                                </Button>
                                            </Link>
                                        }
                                        {
                                            state === 3 &&
                                            <Link to={`${url}/third-examiner/${x?.semester_id}/${c?.course_code}`}>
                                                <Button variant="primary"
                                                // onClick={() => { history.push(`${url}/semester_id/${x?._id}`) }}
                                                >
                                                    View Details
                                                </Button>
                                            </Link>
                                        }

                                    </Card.Body>

                                </Card>
                            </div >)
                        })

                    )
                }
            </div>
            {/* } */}



        </div>
    );
};

export default TakenCourses;