import React, { useEffect, useState } from 'react';
import { Button, Card, Spinner } from 'react-bootstrap';
import { Link, useRouteMatch } from 'react-router-dom';
import checkDepartmentName from '../../../Functions/DeptCodeToDeptName';

const ExamCommitteeChairman = () => {
    const [semesters, setSemesters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { url } = useRouteMatch();
    useEffect(() => {
        fetch(`https://mbstu-panel-server.onrender.com/api/v1/semester/load-running-semester/exam-committee-chairman/`, {
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`
            },
        })
            .then(res => res.json())
            .then(info => {
                console.log('exam committee chairman semesters', info?.data);
                setSemesters(info?.data);
                setIsLoading(false)
            })
    }, []);

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
                        <h2 className='text-center py-5'> Exam committee Chairman</h2>
                        <div className='row container mx-auto my-3'>
                            {
                                semesters?.map(x => {
                                    return (<div className='col-lg-3 col-sm-4 col-12' key={`${x?._id}`}>
                                        <Card style={{ border: "1px solid black" }} className="mb-3">
                                            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                                            <Card.Body>
                                                <Card.Title> {x?.name}</Card.Title>
                                                <Card.Text>
                                                    {x?.degree}
                                                </Card.Text>
                                                <Card.Text>
                                                    Session: {x?.session}
                                                </Card.Text>
                                                <Card.Text className='text-primary'>
                                                    {checkDepartmentName(x?.department)}
                                                </Card.Text>
                                                <div className='text-end'>
                                                    <Link to={`${url}/${x?._id}`}>
                                                        <Button variant="primary"
                                                        // onClick={() => { history.push(`${url}/semester_id/${x?._id}`) }}
                                                        >
                                                            View Semester
                                                        </Button>
                                                    </Link>
                                                </div>
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

export default ExamCommitteeChairman;