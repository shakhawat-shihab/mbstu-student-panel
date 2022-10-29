import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link, useRouteMatch } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';

const Projects = () => {
    const { user } = useAuth();
    // const email = user?.email;
    const profileId = user?.profileId;
    const department = user?.department;
    const [projectCourses, setProjectCourses] = useState([]);
    // const [student, setStudent] = useState({});
    const { url } = useRouteMatch();
    // useEffect(() => {
    //     fetch(`http://localhost:5000/students/${email}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log("student ", data);
    //             setStudent(data);
    //         })
    // }, [email])
    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/project-application/find-project-course`, {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        })
            .then(res => res.json())
            .then(info => {
                console.log("project courses ", info);
                setProjectCourses(info?.data);
            })
    }, [profileId, department])

    return (
        <div>
            <h2 className='text-center my-5'>Projects</h2>
            <div className='row container mx-auto my-3'>
                {
                    projectCourses?.map(x => {
                        return (<div className='col-lg-3 col-sm-4 col-12' key={`${x?.courseCode}_${x?.semester_code}`}>
                            <Card style={{ border: "1px solid black" }} className="mb-3">
                                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                                <Card.Body>
                                    <Card.Title> {x?.courseTitle}</Card.Title>
                                    <br />
                                    <Card.Text>
                                        <span className="fw-bold">Course Code: </span>
                                        <span className="text-uppercase">{x?.courseCode}</span>
                                    </Card.Text>
                                    <Card.Text>
                                        <span className="fw-bold">Credit: </span>
                                        <span className="text-uppercase">{x?.credit}</span>
                                    </Card.Text>
                                    <Link to={`${url}/apply-supervisor/${x?._id}`}>
                                        <Button variant="primary" className='float-end'
                                        // onClick={() => { history.push(`${url}/semester_id/${x?._id}`) }}
                                        >
                                            Apply
                                        </Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </div >)
                    })
                }
            </div>
        </div>
    );
};

export default Projects;