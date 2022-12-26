import React, { useEffect, useState } from 'react';
import { Button, Modal, Pagination, Table } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';
import checkDepartmentName from '../../../Functions/DeptCodeToDeptName';
import checkSemesterName from '../../../Functions/SemesterCodeToSemesterName';
// import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import useAuth from '../../../Hooks/useAuth';

const ThirdExaminerMarksModal = (props) => {
    const { user } = useAuth();
    const { marks } = props;
    const { showModal } = props;
    const { setShowModal } = props;

    const marksLength = marks?.studentsMarks?.length;

    const [numberOfPages, setNumberOfPages] = useState(1);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [pages, setPages] = useState([]);
    const [paginatedMarks, setPaginatedMarks] = useState([]);
    const numberOfStudentPerPage = 25;

    useEffect(() => {
        let pageCount = parseInt(marksLength / numberOfStudentPerPage);
        if (marksLength % numberOfStudentPerPage != 0) {
            pageCount += 1;
        }
        setNumberOfPages(pageCount)
        const array = []
        for (let i = 1; i <= pageCount; i++) {
            array.push(i);
        }
        console.log(array)
        setPages(array);
    }, [marks?.studentsMarks])

    useEffect(() => {
        const selectedtedMarks = marks?.studentsMarks?.slice(numberOfStudentPerPage * (currentPageNumber - 1), currentPageNumber * numberOfStudentPerPage)
        setPaginatedMarks(selectedtedMarks)
    }, [currentPageNumber])


    const handleDownload = () => {
        const selected = document.getElementById('selectedPortion');

        const divHeight = selected.clientHeight;
        const divWidth = selected.clientWidth;
        const ratio = divHeight / divWidth;

        html2canvas(selected, { useCORS: true }, { scale: '10' }).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg');

            const pdfDOC = new jsPDF("p", "mm", "a4");

            const width = pdfDOC.internal.pageSize.getWidth();
            let height = pdfDOC.internal.pageSize.getHeight();

            height = ratio * width;
            pdfDOC.addImage(imgData, 'JPEG', 0, 0, width, height + 30, 'FAST');
            pdfDOC.save(`${marks?.courseCode}_marks.pdf`);
        });
        // const selected = document.getElementById('selectedPortion');
        // window.open(invoice);
        // return false;
        // html2pdf().from(selected).save(`${marks?.courseCode}_marks.pdf`);

    }
    // console.log(marks);
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
                        {/* <div className='mt-4'>
                            <h5 className='text-uppercase text-center fw-bold mb-1'>Mawlana Bhashani Science and Technology university</h5>
                            <h5 className='text-center'>Santosh,Tangail-1902</h5>
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
                        </div> */}
                        <div className='d-flex flex-row-reverse mb-4'>
                            <small>Page {currentPageNumber} of {numberOfPages}</small>
                        </div>
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
                                                <span className='fw-bold'>Name of the Examiner: {props?.marks?.thirdExaminer?.name}</span>
                                            </div>
                                            <div className='d-flex flex-column align-items-end'>
                                                <span className='fw-bold'>Credit Hour: {marks?.credit}</span>
                                                <span className='fw-bold'>Full Marks:70
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </>
                        }
                        <div>
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
                                            props?.final &&
                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                Final Exam Mark <br />(70%)
                                            </th>
                                        }

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Object.keys(marks).length !== 0 &&
                                        marks?.studentsMarks.map(x => {
                                            // console.log(x)
                                            return (
                                                <tr key={x?.s_id} style={{ border: "1px solid black" }}>
                                                    <td style={{ border: "1px solid black" }} className='text-uppercase'>
                                                        <p>{x?.id}</p>
                                                    </td>
                                                    <td style={{ border: "1px solid black" }}>
                                                        <p>{x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName}</p>
                                                    </td>
                                                    {
                                                        props?.final &&
                                                        <td style={{ border: "1px solid black" }}>
                                                            {
                                                                <p>{x?.theoryThirdExaminer}</p>
                                                            }
                                                        </td>
                                                    }
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                        {/* <div className='mt-5 pt-5'>
                            <div className='container d-flex justify-content-between ms-2 pe-4'>
                                <div className="w-25">
                                    <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                                    <p className='text-center'>Signature of the Third Examiner</p>
                                </div>
                                <div className="w-25">
                                    <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                                    <p className='text-center'>Chairman</p>
                                </div>
                            </div>
                        </div> */}
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
                                        <span className=''>Signature of the Third Examiner</span>
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

export default ThirdExaminerMarksModal;