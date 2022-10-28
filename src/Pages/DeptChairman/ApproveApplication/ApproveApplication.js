import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { Link, useRouteMatch } from 'react-router-dom';

const ApproveApplication = () => {
    const { url } = useRouteMatch();
    const [applications, setApplications] = useState();
    // const history = useHistory();


    console.log('url ', url);

    useEffect(() => {
        fetch('http://localhost:5000/api/v1/course-application/get-application-department', {
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
            },
        })
            .then(res => res.json())
            .then(info => {
                console.log("appplication data === ", info.data);
                setApplications(info.data);
            })
    }, [])



    return (
        <div>
            <h2 className="text-center my-5">Students Applications</h2>

            <div className='row container mx-auto my-3'>
                {
                    applications?.map(x => {
                        return (
                            <div className='col-lg-3 col-md-4 col-sm-12' key={x?._id}>
                                <Card style={{ border: "1px solid black" }} className="mb-3">
                                    {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                                    <Card.Body>
                                        <Card.Title>{x?.name}</Card.Title> <br />
                                        <Card.Text>
                                            <span className='fw-bold'>Name:</span> {x?.applicantName}
                                        </Card.Text>
                                        <Card.Text className="text-uppercase">
                                            <span className='fw-bold'>ID:</span> {x?.applicantId}
                                        </Card.Text>
                                        <Card.Text>
                                            <span className='fw-bold'>Session:</span> {x?.applicantSession}
                                        </Card.Text>


                                        <Link to={`${url}/${x?._id}`}>
                                            <Button variant="primary" className='float-end'
                                            >
                                                View Details
                                            </Button>
                                        </Link>

                                    </Card.Body>
                                </Card>
                            </div >
                        )
                    })
                }
            </div>

        </div>
    );
};

export default ApproveApplication;