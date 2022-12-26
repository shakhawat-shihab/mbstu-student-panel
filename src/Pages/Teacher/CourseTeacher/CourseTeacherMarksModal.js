import React from 'react';
import { Button, Modal, Table } from 'react-bootstrap';
import Pagination from 'react-bootstrap/Pagination';
import checkDepartmentName from '../../../Functions/DeptCodeToDeptName';
// import checkSemesterName from '../../../Functions/SemesterCodeToSemesterName';
import useAuth from '../../../Hooks/useAuth';
// import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';
import { useState } from 'react';
import { useEffect } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CourseTeacherMarksModal = (props) => {
    const { user } = useAuth();
    const marks = props.marks;
    const marksToView = props.marksToView;
    const { showModal } = props;
    const { setShowModal } = props;
    // console.log('marksToView ', marksToView);

    //for pagination add the following para
    const [numberOfPages, setNumberOfPages] = useState(1);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [pages, setPages] = useState([]);
    const [paginatedMarks, setPaginatedMarks] = useState([]);
    const numberOfStudentPerPage = 25;
    useEffect(() => {
        let pageCount = parseInt(marksToView.length / numberOfStudentPerPage);
        if (marksToView.length % numberOfStudentPerPage != 0) {
            pageCount += 1;
        }
        setNumberOfPages(pageCount)
        const array = []
        for (let i = 1; i <= pageCount; i++) {
            array.push(i);
        }
        console.log(array)
        setPages(array);
    }, [marksToView])
    useEffect(() => {
        const selectedtedMarks = marksToView.slice(numberOfStudentPerPage * (currentPageNumber - 1), currentPageNumber * numberOfStudentPerPage)
        // console.log('currentPageNumber  ', currentPageNumber)
        // console.log('selectedtedMarks ', selectedtedMarks)
        setPaginatedMarks(selectedtedMarks)
    }, [currentPageNumber])


    const handleDownload = () => {
        const selected = document.getElementById('selectedPortion');

        const divHeight = selected.clientHeight
        const divWidth = selected.clientWidth
        const ratio = divHeight / divWidth;

        html2canvas(selected, { useCORS: true }, { scale: '5' }).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg');

            const pdfDOC = new jsPDF("p", "mm", "a4");

            const width = pdfDOC.internal.pageSize.getWidth();
            let height = pdfDOC.internal.pageSize.getHeight();

            height = ratio * width;
            pdfDOC.addImage(imgData, 'JPEG', 0, 0, width, height + 30, 'FAST');
            pdfDOC.save(`${marks?.courseCode.toUpperCase()}_marks.pdf`);
        });
        // const selected = document.getElementById('selectedPortion');
        // html2pdf().from(selected).save(`${marks?.courseCode}_marks.pdf`);
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

                                <div className=''>
                                    <div className='mt-4'>
                                        <h5 className='text-uppercase text-center fw-bold mb-1 mt-2'>Mawlana Bhashani Science and Technology university</h5>
                                        <h6 className='text-center'>Santosh,Tangail-1902</h6>
                                        <h6 className='text-center'>Marks-sheet</h6>
                                        <h6 className='text-center'>Class Test/Home Work/Assignment/Quiz/Tutorial/Presentation</h6>
                                    </div>

                                    <div>
                                        <h6 className='text-center'>{marks?.semesterId?.name} {marks?.semesterId?.degree} Final Examination</h6>

                                    </div>

                                    <div className='mt-1'>
                                        <p className='text-center mb-1'>Department of {checkDepartmentName(user?.department)}</p>
                                    </div>

                                    <div className='mb-2'>
                                        <div className='mt-4 d-flex justify-content-between'>
                                            <div className='d-flex flex-column'>
                                                <span className='fw-bold'>Course Code: {marks?.courseCode?.toUpperCase()}</span>
                                                <span className='fw-bold'>Course Title: {marks?.courseTitle}</span>
                                                <span className='fw-bold'>Name of the Examiner: {user?.fulllName}</span>
                                            </div>
                                            <div className='d-flex flex-column align-items-end'>
                                                <span className='fw-bold'>Credit Hour: {marks?.credit}</span>
                                                <span className='fw-bold'>Full Marks:
                                                    {marks?.type === "theory" && <span>100</span>}
                                                    {marks?.type === "lab" && <span>50</span>}
                                                    {
                                                        marks?.type === "project"
                                                        &&
                                                        <span>
                                                            {
                                                                props.projectInternalMarks && props.projectPerformance
                                                                    ?
                                                                    <span>70</span>
                                                                    :
                                                                    props.projectInternalMarks ?
                                                                        <span>50</span>
                                                                        :
                                                                        <span>20</span>
                                                            }

                                                        </span>
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </>
                        }


                        {
                            marks.type === 'theory'
                            &&
                            <>
                                <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                    <col width="7%" />
                                    <col width="21%" />
                                    {/* <col width="9%" />
                                <col width="9%" />
                                <col width="9%" />
                                <col width="9%" />
                                <col width="9%" />
                                <col width="9%" />
                                <col width="9%" /> */}
                                    {/* <col width="9%" /> */}
                                    <thead>
                                        <tr style={{ border: "1px solid black", fontSize: "12px" }}>
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                            {
                                                props?.attendance &&
                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                    Class Participation <br />(10%)
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
                                                props?.ctAvg &&
                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                    Class Test/ Home Work/ Assignment<br />(20%)
                                                </th>
                                            }
                                            {
                                                props?.classThirty &&
                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                    Total (30%)
                                                </th>
                                            }
                                            {
                                                props?.final &&
                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                    Final Exam Mark <br />(70%)
                                                </th>
                                            }
                                            {
                                                props?.remarks &&
                                                <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                    Remarks
                                                </th>
                                            }

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Object.keys(paginatedMarks).length !== 0 &&
                                            paginatedMarks?.map(x => <tr key={x?.id} style={{ border: "1px solid black", fontSize: "12px" }}>
                                                <td style={{ border: "1px solid black" }} className='text-uppercase'>
                                                    {x?.id}
                                                </td>
                                                <td style={{ border: "1px solid black" }}>
                                                    {x?.name}
                                                </td>
                                                {
                                                    props?.attendance &&
                                                    <td style={{ border: "1px solid black" }}>
                                                        {x?.theoryAttendance}
                                                    </td>
                                                }
                                                {
                                                    props?.ct1 &&
                                                    <td style={{ border: "1px solid black" }}>
                                                        {x?.theoryCT1}
                                                    </td>
                                                }
                                                {
                                                    props?.ct2 &&
                                                    <td style={{ border: "1px solid black" }}>
                                                        {x?.theoryCT2}
                                                    </td>
                                                }
                                                {
                                                    props?.ct3 &&
                                                    <td style={{ border: "1px solid black" }}>
                                                        {x?.theoryCT3}
                                                    </td>
                                                }
                                                {
                                                    props?.ctAvg &&
                                                    <td style={{ border: "1px solid black" }}>
                                                        {x?.ctAvg}
                                                    </td>
                                                }
                                                {
                                                    props?.classThirty &&
                                                    <td style={{ border: "1px solid black" }}>
                                                        {x?.thirtyPercent}
                                                    </td>
                                                }
                                                {
                                                    props?.final &&
                                                    <td style={{ border: "1px solid black" }}>
                                                        {x?.theoryFinal}
                                                    </td>
                                                }
                                                {
                                                    props?.remarks &&
                                                    <td style={{ border: "1px solid black" }}>
                                                        {x?.remarks}
                                                    </td>
                                                }
                                            </tr>)
                                        }
                                    </tbody>
                                </Table>
                            </>


                        }

                        {
                            marks.type === 'lab'
                            &&
                            <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                <col width="15%" />
                                <col width="30%" />

                                <thead>
                                    <tr style={{ border: "1px solid black", fontSize: "12px" }}>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name of the Candidates</th>
                                        {
                                            props?.labReport &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Lab Report Marks<br /> (20)
                                            </th>
                                        }
                                        {
                                            props?.labAttendance &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Lab Attendance Marks<br />(10)
                                            </th>
                                        }

                                        {
                                            props?.labQuiz &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Lab Quiz Marks<br />(20)
                                            </th>
                                        }
                                        {
                                            props?.total &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Total (50)
                                            </th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(paginatedMarks).length !== 0 &&
                                        paginatedMarks.map(x => <tr key={x?.id} style={{ border: "1px solid black", fontSize: "12px" }}>
                                            <td style={{ border: "1px solid black" }} className='text-uppercase'>
                                                {x?.id}
                                            </td>
                                            <td style={{ border: "1px solid black" }}>
                                                {x?.name}
                                            </td>
                                            {
                                                props?.labAttendance &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {x?.labAttendance}
                                                </td>
                                            }
                                            {
                                                props?.labReport &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {x?.labReport}
                                                </td>
                                            }
                                            {
                                                props?.labQuiz &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {x?.labQuiz}
                                                </td>
                                            }
                                            {
                                                props?.total &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {x?.labClass}
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
                                    <tr style={{ border: "1px solid black", fontSize: "12px" }}>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                        <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                        {/* {
                                            props?.classPerformanceProject
                                            &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Class Performance (70%)
                                            </th>
                                        } */}
                                        {
                                            props.projectInternalMarks
                                            &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Internal Examiner Mark<br />(50%)
                                            </th>
                                        }
                                        {
                                            props.projectPerformance
                                            &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Project Performance<br />(20%)
                                            </th>
                                        }

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(paginatedMarks).length !== 0 &&
                                        paginatedMarks?.map(x => <tr key={x?.id} style={{ border: "1px solid black", fontSize: "12px" }}>
                                            <td style={{ border: "1px solid black" }} className='text-uppercase'>
                                                {x?.id}
                                            </td>
                                            <td style={{ border: "1px solid black" }}>
                                                {x?.name}
                                            </td>
                                            {/* {
                                                props?.classPerformanceProject &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {
                                                        <p>{x?.classPerformanceProject}</p>
                                                    }
                                                </td>
                                            } */}

                                            {
                                                props?.projectInternalMarks
                                                &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {x?.projectInternalMarks}
                                                </td>
                                            }
                                            {
                                                props?.projectPerformance
                                                &&
                                                <td style={{ border: "1px solid black" }}>
                                                    {x?.projectClassPerformance}
                                                </td>
                                            }


                                        </tr>)
                                    }
                                </tbody>
                            </Table>
                        }

                        {
                            currentPageNumber === numberOfPages
                            &&
                            <span className='fw-bolder' style={{ fontSize: "10px" }}>Note: All columns must be filed up and examiner should give of total marks in round figure but not in fractions. *Means "Failed Previously or Improvement."</span>
                        }


                        {/* the signature of the courses will be in last page */}
                        {
                            currentPageNumber === numberOfPages
                            &&
                            <div className='mt-5 pt-5'>
                                <div className='container d-flex justify-content-between pe-4'>
                                    <div className="w-50 d-flex flex-column fw-bold">
                                        <hr style={{ width: "280px", height: "3px", color: "black" }} />
                                        <span className=''>Signature of the Course Teacher</span>
                                        <span>Date: </span>
                                    </div>
                                    <div className="w-25 d-flex flex-column fw-bold">
                                        <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                                        <span className=''>Signature of the Chairman</span>
                                        <span>Date: </span>
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