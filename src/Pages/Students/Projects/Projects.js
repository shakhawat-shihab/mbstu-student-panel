import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link, useRouteMatch } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';

const Projects = () => {
    const { user } = useAuth();
    const email = user?.email;
    const [projectCourses, setProjectCourses] = useState([]);
    const [student, setStudent] = useState({});
    const { url } = useRouteMatch();
    useEffect(() => {
        fetch(`http://localhost:5000/students/${email}`)
            .then(res => res.json())
            .then(data => {
                console.log("student ", data);
                setStudent(data);
            })
    }, [email])
    useEffect(() => {
        //console.log(`http://localhost:5000/results/projects/${student?.department}/${student?.s_id}`)
        fetch(`http://localhost:5000/results/projects/${student?.department}/${student?.s_id}`)
            .then(res => res.json())
            .then(data => {
                console.log("project courses ", data);
                setProjectCourses(data);
            })
    }, [student])
    return (
        <div>
            <h2 className='text-center my-5'>Projects</h2>
            <div className='row container mx-auto my-3'>
                {
                    projectCourses?.map(x => {
                        return (<div className='col-lg-3 col-sm-4 col-12' key={`${x?.course_code}_${x?.semester_code}`}>
                            <Card style={{ border: "1px solid black" }} className="mb-3">
                                {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                                <Card.Body>
                                    <Card.Title> {x?.title}</Card.Title>
                                    <Card.Text>
                                        {x?.course_code}
                                    </Card.Text>
                                    <Card.Text>
                                        Credit: {x?.credit}
                                    </Card.Text>
                                    <Link to={`${url}/apply-supervisor/${x?.course_code}/${x?.semester_code}`}>
                                        <Button variant="primary"
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