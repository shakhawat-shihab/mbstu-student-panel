import React, { useEffect, useState } from 'react';
import { Button, Modal, Pagination, Spinner, Table } from 'react-bootstrap';
import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';
import useAuth from '../../../../Hooks/useAuth';
import checkDepartmentName from '../../../../Functions/DeptCodeToDeptName';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MarksAssignModal = (props) => {
    const { user } = useAuth();
    // const allInfo = props.allInfo;

    const { showModal, setShowModal, semesterInfo, courseCode, marks } = props;

    const [isPaginationComplete, setIsPaginationComplete] = useState(false);
    //for pagination add the following para
    const [numberOfPages, setNumberOfPages] = useState(1);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [pages, setPages] = useState([]);
    const [paginatedMarks, setPaginatedMarks] = useState([]);
    const numberOfStudentPerPage = 25;




    useEffect(() => {
        let pageCount = parseInt(marks?.marks?.length / numberOfStudentPerPage);
        if (marks?.marks?.length % numberOfStudentPerPage != 0) {
            pageCount += 1;
        }
        setNumberOfPages(pageCount)
        const array = []
        for (let i = 1; i <= pageCount; i++) {
            array.push(i);
        }
        console.log('array ', array)
        setPages(array);
    }, [marks, showModal])

    useEffect(() => {

        const selectedtedMarks = marks?.marks?.slice(numberOfStudentPerPage * (currentPageNumber - 1), currentPageNumber * numberOfStudentPerPage)
        setPaginatedMarks(selectedtedMarks)
        setIsPaginationComplete(true);
    }, [currentPageNumber, showModal])

    const handleDownload = () => {
        const selected = document.getElementById('selectedPortion');

        const divHeight = selected.clientHeight
        const divWidth = selected.clientWidth
        const ratio = divHeight / divWidth;

        html2canvas(selected, { useCORS: true }, { scale: '10' }).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg');

            const pdfDOC = new jsPDF("p", "mm", "a4");

            const width = pdfDOC.internal.pageSize.getWidth();
            let height = pdfDOC.internal.pageSize.getHeight();

            height = ratio * width;
            pdfDOC.addImage(imgData, 'JPEG', 0, 0, width, height + 30, 'FAST');
            pdfDOC.save(`${marks?.courseCode.toUpperCase()}_marks.pdf`);
        });
        // const selected = document.getElementById('selectedPortion');
        // window.open(invoice);
        // return false;
        //html2pdf().from(selected).save(`${marks?.courseCode}_marks.pdf`);

    }

    // console.log("mark asssign maarskkks == ", semesterAllMarks);
    // console.log("mark assign courssese ==", courseCode);

    // console.log("paginated marksss == ", paginatedMarks)

    return (
        <div>
            {
                !isPaginationComplete
                    ?
                    <div className='text-center my-5 py-5 '>
                        <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>

                    </div>
                    :
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
                                {
                                    currentPageNumber === 1
                                    &&
                                    <>
                                        <div className='mt-4'>
                                            <h5 className='text-uppercase text-center mb-1 mt-2'>Mawlana Bhashani Science and Technology university</h5>
                                            <h6 className='text-center'>Santosh,Tangail-1902</h6>
                                            <h5 className='fw-bold text-center'>Average Number List</h5>
                                        </div>

                                        <div>
                                            <h6 className='text-center'>{semesterInfo?.name} {semesterInfo?.degree} Final Examination</h6>
                                        </div>

                                        <div className='mt-1'>
                                            <p className='text-center mb-1'>Department of {checkDepartmentName(user?.department)}</p>
                                        </div>
                                        <div className='container'>
                                            <div className='mt-4 mx-4 d-flex justify-content-between'>
                                                <div className='d-flex flex-column'>
                                                    <span className='fw-bold'>Course Code: {marks?.courseCode?.toUpperCase()}</span>
                                                    <span className='fw-bold'>Course Title: {marks?.courseTitle}</span>
                                                </div>
                                                <div className='d-flex flex-column align-items-end'>
                                                    <span className='fw-bold'>Credit Hour: {marks?.credit}</span>
                                                    <span className='fw-bold'>Full Marks:
                                                        {
                                                            marks?.type === 'theory' && <span> 70</span>
                                                        }
                                                        {
                                                            marks?.type === 'lab' && <span> 50</span>
                                                        }
                                                        {
                                                            marks?.type === 'project' && <span> 30</span>
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }

                                {
                                    marks?.type === 'theory'
                                    &&
                                    <div className='container'>
                                        <div className='container my-1 ' >
                                            <div className='p-2 '>
                                                <Table responsive bordered className='text-center' style={{ border: '1px solid black' }}>
                                                    <col width="10%" />
                                                    <col width="35%" />
                                                    <col width="10%" />
                                                    <col width="10%" />
                                                    <col width="10%" />
                                                    <col width="10%" />
                                                    <col width="10%" />
                                                    <thead>
                                                        <tr style={{ fontSize: "12px" }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} className="py-2">Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                Internal Examiner
                                                            </th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                External Examiner
                                                            </th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                Third Examiner <br />(If any)
                                                            </th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                Average
                                                            </th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>
                                                                Remarks
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {

                                                            paginatedMarks && Object.keys(paginatedMarks)?.length !== 0 &&
                                                            paginatedMarks?.map(x => <tr key={`${x?.id}_${courseCode}`} style={{ border: "1px solid black", lineHeight: "8px", fontSize: "12px" }}>
                                                                <td style={{ border: '1px solid black' }}>
                                                                    <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id}
                                                                        readOnly />
                                                                </td>
                                                                <td style={{ border: '1px solid black' }}>{x?.name}</td>
                                                                <td style={{ border: '1px solid black' }}>{x?.theoryFinal}</td>
                                                                <td style={{ border: '1px solid black' }}>{x?.theorySecondExaminer}</td>
                                                                <td style={{ border: '1px solid black' }}>{x?.theoryThirdExaminer}</td>
                                                                <td style={{ border: '1px solid black' }}>{x?.theoryWritten}</td>
                                                                <td style={{ border: '1px solid black' }}>{x?.remarks && <span>3<sup>rd</sup> Examiner</span>}</td>
                                                            </tr>)
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>

                                }


                                {
                                    marks?.type === 'lab'
                                    &&
                                    <div className='container'>
                                        <div className='container my-1 ' >
                                            <div className='p-2 '>
                                                <Table responsive bordered className='text-center' style={{ border: '1px solid black' }}>
                                                    <col width="10%" />
                                                    <col width="30%" />
                                                    <col width="25%" />
                                                    <col width="10%" />
                                                    <col width="10%" />
                                                    <col width="10%" />
                                                    <thead>
                                                        <tr style={{ border: '1px solid black', fontSize: "12px" }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} className="py-3">Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                            {/* <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Marks<br />(60 marks)</th> */}
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Final Practical exam/ <br /> Sessional Marks (40 )</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Viva-voce Marks (10)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Total <br />(50)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Remarks</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            paginatedMarks && Object.keys(paginatedMarks)?.length !== 0 &&
                                                            paginatedMarks?.map(x => <tr key={`${x?.id}_${courseCode}`} style={{ border: '1px solid black', lineHeight: "8px", fontSize: "12px" }}>
                                                                <td style={{ border: '1px solid black' }}>
                                                                    <input className='border-0 w-100 text-center' style={{ backgroundColor: 'inherit' }} value={x?.id.toUpperCase()}
                                                                        readOnly />
                                                                </td>
                                                                <td style={{ border: '1px solid black' }}>{x?.name}</td>
                                                                <td style={{ border: '1px solid black' }}>{x?.labExperiment}</td>
                                                                <td style={{ border: '1px solid black' }}>{x?.labViva}</td>
                                                                <td style={{ border: '1px solid black' }}>
                                                                    {
                                                                        x?.labExperiment && x?.labViva
                                                                            ?
                                                                            x?.labExperiment + x?.labViva
                                                                            :
                                                                            <>
                                                                                {
                                                                                    x?.labViva ? x?.labViva : x?.labExperiment
                                                                                }
                                                                            </>
                                                                    }

                                                                </td>
                                                                <td>{x?.remarks}</td>
                                                            </tr>)
                                                        }

                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {
                                    marks.type === 'project'
                                    &&
                                    <div className='container'>
                                        <div className='container-fluid rounded  my-5 ' >
                                            <div className='p-2 '>
                                                <Table responsive bordered className='text-center' style={{ border: '1px solid black' }}>
                                                    <col width="20%" />
                                                    <col width="40%" />
                                                    <col width="30%" />
                                                    <thead>
                                                        <tr style={{ border: '1px solid black' }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                            {/* <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Performance (70%)</th> */}
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Presentation and Viva <br />(30 marks)
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {
                                                            marks?.studentsMarks?.map(x => <tr key={x?.id}>
                                                                <td style={{ border: '1px solid black' }}>
                                                                    <input className='border-0 w-100 text-center text-uppercase' style={{ backgroundColor: 'inherit' }} value={x?.id.toUpperCase()}
                                                                        readOnly />
                                                                </td>
                                                                <td style={{ border: '1px solid black' }}>{x?.studentProfileId?.firstName + ' ' + x?.studentProfileId?.lastName}</td>
                                                                {/* <td style={{ border: '1px solid black' }}>{x?.class_marks_project}</td> */}
                                                                <td style={{ border: '1px solid black' }}>{x?.projectPresentation}</td>
                                                            </tr>)
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>
                                }

                                {

                                    currentPageNumber === numberOfPages
                                    &&
                                    <span className='fw-bold ms-4 ps-2' style={{ fontSize: "12px" }}>Note: All columns must be filed up and numbers must be rounded off. *Means "Failed Previously or Improvement."</span>
                                }

                                {
                                    currentPageNumber === numberOfPages
                                    &&
                                    <div className="d-flex w-100 ms-4 ps-2 mt-3" style={{ fontSize: "12px" }}>
                                        <div className=''>
                                            <p>Signature of </p>
                                        </div>

                                        <div className='d-flex flex-column ms-2'>

                                            <span>1. .................................................................. Chairman, Examination Committee</span>
                                            <span>2. ................................................................. Member, Examination Committee</span>
                                            <span>3. ................................................................. Member, Examination Committee</span>

                                        </div>

                                    </div>
                                }
                            </div>
                            {/* <div className='container d-flex justify-content-between ms-2 pe-4'>
                                <div className="w-25">
                                    <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                                    <p className='text-center'>Signature of Exam Committee Chairman</p>
                                </div>
                                <div className="w-25">
                                    <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                                    <p className='text-center'>Chairman</p>
                                </div>
                            </div> */}

                            <div className='d-flex align-items-center justify-content-center mt-2'>
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
            }

        </div>
    );
};

export default MarksAssignModal;