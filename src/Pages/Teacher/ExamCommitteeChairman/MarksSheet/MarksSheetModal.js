import React, { useEffect, useState } from 'react';
// import html2pdf from 'html2pdf.js';
import { FaDownload } from 'react-icons/fa';
import { Button, Modal, Pagination, Table, Spinner } from 'react-bootstrap';
import useAuth from '../../../../Hooks/useAuth';
import checkDepartmentName from '../../../../Functions/DeptCodeToDeptName';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MarksSheetModal = (props) => {
    const { user } = useAuth();
    // const allInfo = props.allInfo;
    const { showModal, setShowModal, courseTitle, courseCode, credit, processedMarks, semesterInfo } = props;
    // console.log("checking processsed === ", processedMarks);
    const [isPaginationComplete, setIsPaginationComplete] = useState(false);
    //for pagination add the following para
    const [numberOfPages, setNumberOfPages] = useState(1);
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [pages, setPages] = useState([]);
    const [paginatedMarks, setPaginatedMarks] = useState([]);
    const numberOfStudentPerPage = 25;


    useEffect(() => {
        let pageCount = parseInt(processedMarks?.marks?.length / numberOfStudentPerPage);
        if (processedMarks?.marks?.length % numberOfStudentPerPage != 0) {
            pageCount += 1;
        }
        setNumberOfPages(pageCount)
        const array = []
        for (let i = 1; i <= pageCount; i++) {
            array.push(i);
        }
        console.log('array ', array)
        setPages(array);
    }, [processedMarks, showModal])

    useEffect(() => {

        const selectedtedMarks = processedMarks?.marks?.slice(numberOfStudentPerPage * (currentPageNumber - 1), currentPageNumber * numberOfStudentPerPage)
        setPaginatedMarks(selectedtedMarks)
        setIsPaginationComplete(true);
    }, [currentPageNumber, showModal])

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
            pdfDOC.save(`${courseCode.toUpperCase()}_marks.pdf`);
        });
        //const selected = document.getElementById('selectedPortion');
        // window.open(invoice);
        // return false;
        //html2pdf().from(selected).save(`${courseCode}_marks.pdf`);

    }


    console.log("pagiiiiii === ", paginatedMarks);

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
                            <div id="selectedPortion" className='px-4 py-2 mt-2'>
                                <div className='d-flex flex-row-reverse mb-4'>
                                    <small>Page {currentPageNumber} of {numberOfPages}</small>
                                </div>
                                {currentPageNumber === 1
                                    &&
                                    <>
                                        <div className='mt-4'>
                                            <h5 className='text-uppercase text-center mb-1 mt-2'>Mawlana Bhashani Science and Technology university</h5>
                                            <h6 className='text-center'>Santosh,Tangail-1902</h6>
                                        </div>
                                        <div>
                                            <h6 className='text-center'>{semesterInfo?.name} {semesterInfo?.degree} Final Examination</h6>
                                        </div>
                                        <div className=''>
                                            <h6 className='text-center mb-1'>Department of {checkDepartmentName(user?.department)}</h6>
                                        </div>

                                        <div className='container'>
                                            <div className='mt-4 mx-4 d-flex justify-content-between'>
                                                <div className='d-flex flex-column'>
                                                    <span className='fw-bold'>Course Code: {courseCode?.toUpperCase()}</span>
                                                    <span className='fw-bold'>Course Title: {courseTitle}</span>
                                                </div>
                                                <div className='d-flex flex-column'>
                                                    <span className='fw-bold'>Credit Hour: {credit}</span>
                                                    <span className='fw-bold'>Full Marks: 100</span>
                                                </div>
                                            </div>
                                        </div>
                                    </>

                                }
                                {
                                    processedMarks?.type === 'theory'
                                    &&
                                    <div className='container'>
                                        <div className='container my-1 ' >
                                            <div className='p-3 '>
                                                <Table responsive striped hover className='text-center' style={{ border: "1px solid black" }}>
                                                    <thead>
                                                        <tr style={{ fontSize: "12px" }} >
                                                            <th style={{ borderTop: "0", textAlign: "center", verticalAlign: "middle" }} rowSpan="2" >Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} rowSpan="2">Name of the Candidates</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} rowSpan="2">Status</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} colSpan="3">Theory</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} rowSpan="2">Total Marks <br /> (100%)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} rowSpan="2">Letter Grade <br /> (LG)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} rowSpan="2">Grade Point <br /> (GP)</th>
                                                        </tr>
                                                        <tr style={{ fontSize: "12px" }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Participation <br /> (10%)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Test / Assignment (20%)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Final Examination <br /> (70%)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Object.keys(paginatedMarks).length !== 0 &&
                                                            paginatedMarks?.map(x => <tr key={x?._id} style={{ border: "1px solid black", lineHeight: "8px", fontSize: "12px" }}>
                                                                <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.id}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.name}</td>
                                                                <td style={{ border: "1px solid black" }}> <i>{x?.isPaid ? 'Paid' : 'Unpaid'}</i> </td>
                                                                <td style={{ border: "1px solid black" }}>{x?.theoryAttendance}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.ctAvg}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.theoryWritten}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.totalMarks}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.lg}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.gp}</td>
                                                            </tr>)
                                                        }
                                                    </tbody>
                                                </Table>
                                                <span className='fw-bold' style={{ fontSize: "12px" }}>Note: All columns must be filed up and numbers must be rounded off. *Means "Failed Previously or Improvement."</span>
                                            </div>



                                        </div>
                                    </div>
                                }
                                {
                                    processedMarks?.type === 'lab'
                                    &&
                                    <div className='container'>
                                        <div className='container my-1' >
                                            <div className='p-3 '>
                                                <Table responsive striped bordered hover className='text-center' style={{ border: "1px solid black" }}>
                                                    <thead>
                                                        <tr style={{ border: "1px solid black", fontSize: "12px" }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} rowSpan="2">Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} rowSpan="2">Name of the Candidates</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} rowSpan="2">Status</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} colSpan="2">Lab/Sessional</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} rowSpan="2"> <br />Total Marks <br /> (100%)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} rowSpan="2"> <br />Letter Grade <br /> (LG)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }} rowSpan="2"> <br />Grade Point <br /> (GP)</th>
                                                        </tr>
                                                        <tr style={{ fontSize: "12px" }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Final Practical exam/sessional & Viva-voce <br /> (40+10=50%)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Lab Attendance, Lab Report & Quiz Examination <br /> (10+20+20=50%)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            Object.keys(paginatedMarks)?.length !== 0 &&
                                                            paginatedMarks?.map(x => <tr key={x?._id} style={{ border: "1px solid black", lineHeight: "8px", fontSize: "12px" }}>
                                                                <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.id}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.name}</td>
                                                                <td style={{ border: "1px solid black" }}>  <i>{x?.isPaid ? 'Paid' : 'Unpaid'}</i>  </td>

                                                                <td title={'By ' + x?.labExperimentBy} style={{ border: "1px solid black" }}>{x?.labExamMark}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.labClassMark}</td>

                                                                <td style={{ border: "1px solid black" }}>{x?.totalMarks}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.lg}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.gp}</td>

                                                            </tr>)
                                                        }
                                                    </tbody>
                                                </Table>
                                                <span className='fw-bold' style={{ fontSize: "12px" }}>Note: All columns must be filed up and numbers must be rounded off. *Means "Failed Previously or Improvement."</span>
                                            </div>

                                        </div>
                                    </div>
                                }
                                {
                                    processedMarks?.type === 'project'
                                    &&
                                    <div className='container'>
                                        <div className='container my-1 ' >
                                            <div className='p-3 '>
                                                <Table responsive bordered className='text-center' style={{ border: "1px solid black" }}>
                                                    <thead>
                                                        <tr style={{ border: "1px solid black" }}>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Student Id</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Name</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Class Performance<br />(70 marks)</th>
                                                            <th style={{ border: "1px solid black", textAlign: "center", verticalAlign: "middle" }}>Presentation and Viva<br /> (30 marks)</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            processedMarks?.marks?.map(x => <tr key={x?.id} style={{ border: "1px solid black" }}>
                                                                <td className='text-uppercase' style={{ border: "1px solid black" }}>{x?.id}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.name}</td>
                                                                <td style={{ border: "1px solid black" }}>{x?.projectClassPerformance}</td>
                                                                <td title={x?.projectPresentationBy} style={{ border: "1px solid black" }}>{x?.projectPresentation}</td>
                                                            </tr>)
                                                        }
                                                    </tbody>
                                                </Table>
                                                <span className='fw-bold' style={{ fontSize: "12px" }}>Note: All columns must be filed up and numbers must be rounded off. *Means "Failed Previously or Improvement."</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    currentPageNumber === numberOfPages
                                    &&
                                    <div className="d-flex w-100 ms-5" style={{ fontSize: "12px" }}>
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
                            <p className='text-center'>Signature of Chairman</p>
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

export default MarksSheetModal;