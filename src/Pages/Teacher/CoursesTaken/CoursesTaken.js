import React, { useEffect, useState } from 'react';
import { Button, Card, Nav } from 'react-bootstrap';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';

const TakenCourses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const profileId = user?.profileId;
    const [state, setState] = useState(1);
    let { path, url } = useRouteMatch();
    //console.log('path = ', path, ' and url = ', url)
    useEffect(() => {
        //console.log('email ', email);
        fetch(`http://localhost:5000/api/v1/marks/taken-courses/${profileId}/${state}`)
            .then(res => res.json())
            .then(info => {
                // console.log('state ', state, " info ", info);
                // const arr = [];
                // data?.map(x => {
                //     x?.courses?.map(i => {
                //         if (i?.email === email) {
                //             //console.log('course ', i?.courseCode)
                //             const obj = {};
                //             obj._id = x?._id;
                //             obj.session = x?.session;
                //             obj.courseCode = i?.courseCode;
                //             obj.courseTitle = i?.courseTitle;
                //             arr.push(obj);
                //         }
                //     })
                // })
                // console.log(arr);
                setCourses(info.data);
            })
    }, [state, profileId])

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
                    courses?.map(x => {
                        return (<div className='col-lg-3 col-sm-4 col-12' key={`${x?._id}`}>
                            <Card style={{ border: "1px solid black" }} className="mb-3 h-100 ">
                                <Card.Body>
                                    <Card.Title> {x?.courseTitle}</Card.Title>
                                    <Card.Text>
                                        {x?.courseCode}
                                    </Card.Text>
                                    <Card.Text>
                                        Session: {x?.semesterId?.session}
                                    </Card.Text>
                                    <Card.Text>
                                        Semester: {x?.semesterId?.name}
                                    </Card.Text>
                                    {
                                        state === 1 &&
                                        <Link to={`${url}/${x?._id}`}>
                                            <Button variant="primary"
                                            // onClick={() => { history.push(`${url}/semester_id/${x?._id}`) }}
                                            >
                                                View Details
                                            </Button>
                                        </Link>
                                    }
                                    {
                                        state === 2 &&
                                        <Link to={`${url}/second-examiner/${x?._id}`}>
                                            <Button variant="primary"
                                            // onClick={() => { history.push(`${url}/semester_id/${x?._id}`) }}
                                            >
                                                View Details
                                            </Button>
                                        </Link>
                                    }
                                    {
                                        state === 3 &&
                                        <Link to={`${url}/third-examiner/${x?._id}`}>
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
                        // })
                    }
                    )}
            </div>
        </div>
    );
};

export default TakenCourses;