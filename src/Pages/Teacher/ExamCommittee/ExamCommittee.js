import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link, useRouteMatch } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import { Spinner } from 'react-bootstrap';
const ExamCommittee = () => {
    const { user } = useAuth();
    const email = user?.email;
    const [semesters, setSemesters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { url } = useRouteMatch();
    useEffect(() => {
        // console.log()
        fetch(`http://localhost:5000/semester-view/exam-committee/${email}`)
            .then(res => res.json())
            .then(data => {
                console.log('exam committee semesters', data);
                setSemesters(data);
                setIsLoading(false)
            })
    }, [email]);
    return (
        <>
            {
                isLoading ?
                    <div className='text-center my-5 py-5 '>
                        < Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status" >
                            <span className="visually-hidden">Loading...</span>
                        </Spinner >
                    </div >
                    :
                    < div >
                        <h2 className='text-center py-5'> Exam committee </h2>
                        <div className='row container mx-auto my-3'>
                            {
                                semesters?.map(x => {
                                    return (<div className='col-lg-3 col-sm-4 col-12' key={`${x?.session}_${x?.semester_code}`}>
                                        <Card style={{ border: "1px solid black" }} className="mb-3">
                                            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                                            <Card.Body>
                                                <Card.Title> {x?.semester_code}</Card.Title>
                                                <Card.Text>
                                                    {/* {x?.course_code} */}
                                                </Card.Text>
                                                <Card.Text>
                                                    Session: {x?.session}
                                                </Card.Text>
                                                <Link to={`${url}/${x?._id}`}>
                                                    <Button variant="primary"
                                                    // onClick={() => { history.push(`${url}/semester_id/${x?._id}`) }}
                                                    >
                                                        View Semester
                                                    </Button>
                                                </Link>

                                            </Card.Body>
                                        </Card>
                                    </div >)
                                })
                            }
                        </div>
                    </div >
            }
        </>
    );
};

export default ExamCommittee;