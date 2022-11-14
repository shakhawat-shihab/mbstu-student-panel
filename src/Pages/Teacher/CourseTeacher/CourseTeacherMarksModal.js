import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import checkDepartmentName from '../../../Functions/DeptCodeToDeptName';
import checkSemesterName from '../../../Functions/SemesterCodeToSemesterName';
import useAuth from '../../../Hooks/useAuth';
import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';

const CourseTeacherMarksModal = (props) => {
    const { user } = useAuth();
    const marks = props.marks;
    const { showModal } = props;
    const { setShowModal } = props;


    //for pagination add the following para
    const [numberOfPages, setNumberOfPages] = useState(1);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [pages, setPages] = useState([]);
    const [paginatedMarks, setPaginatedMarks] = useState([]);
    const numberOfStudentPerPage = 2;
    useEffect(() => {
        let pageCount = parseInt(marks.studentsMarks.length / numberOfStudentPerPage);
        if (marks.studentsMarks.length % numberOfStudentPerPage != 0) {
            pageCount += 1;
        }
        setNumberOfPages(pageCount)
        const array = []
        for (let i = 1; i <= pageCount; i++) {
            array.push(i);
        }
        console.log(array)
        setPages(array);
    }, [marks])
    useEffect(() => {
        const selectedtedMarks = marks.studentsMarks.slice(numberOfStudentPerPage * (currentPageNumber - 1), currentPageNumber * numberOfStudentPerPage)
        // console.log('currentPageNumber  ', currentPageNumber)
        // console.log('selectedtedMarks ', selectedtedMarks)
        setPaginatedMarks(selectedtedMarks)
    }, [currentPageNumber])


    const handleDownload = () => {
        const selected = document.getElementById('selectedPortion');
        html2pdf().from(selected).save(`${marks?.courseCode}_marks.pdf`);
    }

    return (
        <div>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                dialogClassName="modal-90w"
                aria-labelledby="example-custom-modal-styling-title"
                // fullscreen={true}
                // className='m-5'
                size='xl'
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title ">
                        <Button className='float-end me-5 download-pdf' variant="primary" onClick={handleDownload}>
                            <span className='text-white ms-2 float-end' >Download Pdf</span>
                            <FaDownload className='float-end mt-1 mb-2' ></FaDownload>
                        </Button>

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div id="selectedPortion" className='px-4 py-2 my-5'>
                        <div className='d-flex flex-row-reverse mb-4'>
                            <small>Page {currentPageNumber} of {numberOfPages}</small>
                        </div>

                        {/* the title of the courses will be in first page */}
                        {
                            currentPageNumber === 1
                            &&
                            <>
                                <div className='mt-2'>
                                    <h5 className='text-uppercase text-center fw-bold mb-1'>Mawlana Bhashani Science and Technology university</h5>
                                    <h5 className='text-center'>Santosh, Tangail-1902</h5>
                                </div>
                                <div className='mt-3'>
                                    <p className='text-center fw-bold mb-1'>Department of {checkDepartmentName(user?.department)}</p>
                                    <p className='text-center '>{checkSemesterName(marks?.semesterId?.semesterCode)}</p>
                                </div>
                                <div className=''>
                                    <div className='my-4'>
                                        <p><span className='fw-bold'>Course Code: </span>{marks?.courseCode}</p>
                                        <p><span className='fw-bold'>Course Name: </span>{marks?.courseTitle}</p>
                                        <p><span className='fw-bold'>Credit Hour: </span>{marks?.credit}</p>
                                        <p><span className="fw-bold">Name of the Examiner(s): </span>{user?.fullName}</p>
                                    </div>
                                </div>
                            </>
                        }


                        {
                            marks.type === 'theory'
                            &&
                            <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                {/* <col width="11%" />
                                <col width="30%" />
                                <col width="12%" />
                                <col width="12%" />
                                <col width="12%" />
                                <col width="12%" /> */}
                                <thead>
                                    <tr style={{ border: "1px solid black" }}>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                        {
                                            props?.attendance &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Attendance <br />(10 marks)
                                            </th>
                                        }
                                        {
                                            props?.ct1 &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                CT-1 <br />(20 marks)
                                            </th>
                                        }
                                        {
                                            props?.ct2 &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                CT-2 <br />(20 marks)
                                            </th>
                                        }
                                        {
                                            props?.ct3 &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                CT-3 <br />(20 marks)
                                            </th>
                                        }
                                        {
                                            props?.final &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Final Exam Mark <br />(70 marks)
                                            </th>
                                        }

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(paginatedMarks).length !== 0 &&
                                        paginatedMarks?.map(x => <tr key={x?.id} style={{ border: "1px solid black" }}>
                                            <td style={{ border: "1px solid black" }} className='text-uppercase'>
                                                <p>{x?.id}</p>
                                            </td>
                                            <td style={{ border: "1px solid black" }}>
                                                <p>{x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName}</p>
                                            </td>
                                            {
                                                props?.attendance &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.theoryAttendance}</p>
                                                    }
                                                </td>
                                            }
                                            {
                                                props?.ct1 &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.theoryCT1}</p>
                                                    }
                                                </td>
                                            }
                                            {
                                                props?.ct2 &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.theoryCT2}</p>
                                                    }
                                                </td>
                                            }
                                            {
                                                props?.ct3 &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.theoryCT3}</p>
                                                    }
                                                </td>
                                            }
                                            {
                                                props?.final &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.theoryFinal}</p>
                                                    }
                                                </td>
                                            }
                                        </tr>)
                                    }
                                </tbody>
                            </Table>
                        }

                        {
                            marks.type === 'lab'
                            &&
                            <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                {/* <col width="15%" />
                                <col width="30%" />
                                <col width="15%" />
                                <col width="15%" />
                                <col width="15%" /> */}
                                <thead>
                                    <tr style={{ border: "1px solid black" }}>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                        {
                                            props?.labAttendance &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Lab Attendance (15%)
                                            </th>
                                        }
                                        {
                                            props?.labReport &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Lab Report Marks (15%)
                                            </th>
                                        }
                                        {
                                            props?.labQuiz &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Lab Quiz Marks (30%)
                                            </th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(paginatedMarks).length !== 0 &&
                                        paginatedMarks.map(x => <tr key={x?.id} style={{ border: "1px solid black" }}>
                                            <td style={{ border: "1px solid black" }} className='text-uppercase'>
                                                <p>{x?.id}</p>
                                            </td>
                                            <td style={{ border: "1px solid black" }}>
                                                <p>{x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName}</p>
                                            </td>
                                            {
                                                props?.labAttendance &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.labAttendance}</p>
                                                    }
                                                </td>
                                            }
                                            {
                                                props?.labReport &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.labReport}</p>
                                                    }
                                                </td>
                                            }
                                            {
                                                props?.labQuiz &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.labQuiz}</p>
                                                    }
                                                </td>
                                            }
                                        </tr>)
                                    }
                                </tbody>
                            </Table>
                        }

                        {
                            marks.type === 'project' &&
                            <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                {/* <col width="15%" />
                                <col width="40%" />
                                <col width="25%" /> */}
                                <thead>
                                    <tr style={{ border: "1px solid black" }}>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                        {
                                            props?.classPerformanceProject &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Class Performance (70%)
                                            </th>
                                        }

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(paginatedMarks).length !== 0 &&
                                        paginatedMarks?.map(x => <tr key={x?.id} style={{ border: "1px solid black" }}>
                                            <td style={{ border: "1px solid black" }} className='text-uppercase'>
                                                <p>{x?.id}</p>
                                            </td>
                                            <td style={{ border: "1px solid black" }}>
                                                <p>{x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName}</p>
                                            </td>
                                            {
                                                props?.classPerformanceProject &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.classPerformanceProject}</p>
                                                    }
                                                </td>
                                            }

                                        </tr>)
                                    }
                                </tbody>
                            </Table>
                        }


                        {/* the signature of the courses will be in last page */}
                        {
                            currentPageNumber === numberOfPages
                            &&
                            <div className='mt-5 pt-5'>
                                <div className='container d-flex justify-content-between ms-2 pe-4'>
                                    <div className="w-25">
                                        <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                                        <p className='text-center'>Signature of the Course Teacher</p>
                                    </div>
                                    <div className="w-25">
                                        <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                                        <p className='text-center'>Chairman</p>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>


                    {/* for pagination  */}
                    <div className='d-flex align-items-center justify-content-center'>
                        {
                            pages?.map(x => {
                                return (<Pagination className='mx-2'>
                                    <Pagination.Item
                                        active={x === currentPageNumber}
                                        onClick={() => setCurrentPageNumber(x)}
                                    >
                                        {x}
                                    </Pagination.Item>
                                </ Pagination>)
                            })
                        }
                    </div>


                </Modal.Body>
            </Modal>
        </div>
    );
};

export default CourseTeacherMarksModal;