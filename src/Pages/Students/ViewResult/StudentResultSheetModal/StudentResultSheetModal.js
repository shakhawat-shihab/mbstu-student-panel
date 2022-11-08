import React from 'react';
import html2pdf from 'html2pdf.js';
import { Button, Modal, Table } from 'react-bootstrap';
import { FaDownload } from 'react-icons/fa';
import mbstuLogo from '../../../../images/mbstu-logo.jpg';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './StudentResultSheetModal.css'
import checkDepartmentName from '../../../../Functions/DeptCodeToDeptName';
import checkFacultyame from '../../../../Functions/DeptCodeToFacultyName';

const StudentResultSheetModal = (props) => {
    const { showModal, setShowModal, resultOfASemester, processedSemester, profile } = props;
    const { GPA, courses, creditEarned, creditOffered, semesterName, degree, department } = resultOfASemester;
    // const { degree, department, examFinishDate, resultPublishDate, session, updatedAt } = processedSemester;

    const res = processedSemester?.updatedAt?.split('-') || '';


    const leng = resultOfASemester?.courses?.length;
    // console.log("after-split == ", res);

    const handleDownload = () => {

        // size ====>  resultOfASemester?.courses
        const size = resultOfASemester?.courses;
        let heightAdjust = 0;
        if (size > 8) {
            heightAdjust = -25
        }
        else if (size >= 6 && size <= 8) {
            heightAdjust = -10
        }
        else {
            heightAdjust = 15
        }


        const selected = document.getElementById('selectedPortion');

        const divHeight = selected.clientHeight
        const divWidth = selected.clientWidth
        const ratio = divHeight / divWidth;

        html2canvas(selected, { scale: '5' }).then((canvas) => {
            const imgData = canvas.toDataURL('image/jpeg');

            const pdfDOC = new jsPDF("l", "mm", "a0"); //  use a4 for smaller page

            const width = pdfDOC.internal.pageSize.getWidth();
            let height = pdfDOC.internal.pageSize.getHeight();
            height = ratio * width;
            // console.log(height, width, ratio)
            pdfDOC.addImage(imgData, 'JPEG', 0, 0, width, height + heightAdjust, 'FAST');
            pdfDOC.save(`${semesterName}.pdf`);   //Download the rendered PDF.
        });
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
                    <div id="selectedPortion" className='px-5 py-4'>
                        <div className='row mt-4'>
                            <div className='col-lg-2 mt-3' style={{ fontSize: "10px" }}>
                                <div className='d-flex flex-column'>
                                    <span className='fw-bold'>Note:</span>
                                    <span><span className="fw-bold">LG = </span>Letter Grade</span>
                                    <span><span className="fw-bold">GP = </span>Grade Points</span>
                                    <span><span className="fw-bold">CO = </span>Credit(s) Offered</span>
                                    <span><span className="fw-bold">CE = </span>Credit(s) Earned</span>
                                    <span><span className="fw-bold">TPS = </span>Total Points Secured</span>
                                    <span><span className="fw-bold">GPA </span>(Grade Points Average) = TPS/CE</span>
                                    <span><span className="fw-bold">CGPA = </span>Cumulative Grade Points Average</span>
                                </div>
                            </div>

                            <div className='col-lg-7' >

                                <div className='d-flex flex-column' style={{ fontSize: "12px" }}>
                                    <div className='mb-1 text-center'>
                                        <img src={mbstuLogo} alt="mbstu" style={{ width: "60px", height: "60px", filter: "grayscale(1)" }} className="mb-1" />
                                    </div>
                                    <span className='fw-bold text-center'>Mawlana Bhashani Science and Technology University, Tangail, Bangladesh</span>
                                    <span className='text-center fw-bold'>Grade Sheet For</span>
                                    <span className='text-center'>{semesterName} {degree} Final Examination - {res[0]}</span>
                                    <div className='d-flex mt-4 flex-column mx-auto w-75'>
                                        {/* <div> */}
                                        <span className='mb-1'><span className='fw-bold '>Department: </span>{checkDepartmentName(department)}</span>
                                        <span className='mb-2'><span className='fw-bold '>Faculty: </span>{checkFacultyame(department)}</span>
                                        {/* </div> */}


                                        {/* <div> */}
                                        <span className='mb-1'><span className='fw-bold'>Name of the Candidate: </span>{profile?.firstName + " " + profile?.lastName}</span>
                                        <span className='mb-1'><span className='fw-bold'>Student ID: </span>{profile?.id?.toUpperCase()}</span>
                                        <span className='mb-1'><span className='fw-bold'>Session: </span>{profile?.session}</span>
                                        {/* </div> */}

                                    </div>
                                </div>

                            </div>

                            <div className='col-lg-3 row'>
                                <div className='col-lg-8 mt-1'>
                                </div>
                                <p className="mb-1" style={{ fontSize: "7px" }}>Letter grades and corresponding grade points shall be determined as follows:</p>
                                <Table className='tbl-color ' bordered  >
                                    <col width="60%" />
                                    <col width="30%" />
                                    <col width="10%" />
                                    <thead>
                                        <tr className='fs-tbl'>
                                            <th  >Grade</th>
                                            <th   >GP</th>
                                            <th >LG</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        <tr className='fs-tbl' >
                                            <td  >80% and above</td>
                                            <td  >4.00</td>
                                            <td  >A+</td>
                                        </tr>
                                        <tr className='fs-tbl' >
                                            <td  >75% to less than 80%</td>
                                            <td  >3.75</td>
                                            <td  >A</td>
                                        </tr>
                                        <tr className='fs-tbl' >
                                            <td >70% to less than 75%</td>
                                            <td  >3.50</td>
                                            <td  >A-</td>
                                        </tr>
                                        <tr className='fs-tbl' >
                                            <td  >65% to less than 70%</td>
                                            <td  >3.25</td>
                                            <td  >B+</td>
                                        </tr>
                                        <tr className='fs-tbl' >
                                            <td  >60% to less than 65%</td>
                                            <td  >3.00</td>
                                            <td  >B</td>
                                        </tr>
                                        <tr className='fs-tbl' >
                                            <td  >55% to less than 60%</td>
                                            <td  >2.75</td>
                                            <td >B-</td>
                                        </tr>
                                        <tr className='fs-tbl' >
                                            <td  >50% to less than 55%</td>
                                            <td  >2.50</td>
                                            <td  >C+</td>
                                        </tr>
                                        <tr className='fs-tbl' >
                                            <td >45% to less than 50%</td>
                                            <td >2.25</td>
                                            <td >C</td>
                                        </tr>
                                        <tr className='fs-tbl' >
                                            <td >40% to less than 45%</td>
                                            <td >2.00</td>
                                            <td >D</td>
                                        </tr>
                                        <tr className='fs-tbl' >
                                            <td >Less than 40%</td>
                                            <td >No Grade</td>
                                            <td >F</td>
                                        </tr>
                                        <tr className='fs-tbl' >
                                            <td >Withdrawn</td>
                                            <td >-</td>
                                            <td >W</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                        <div className='mt-3 w-75 mx-auto' >
                            <Table className='tbl-color'  >
                                {/* <col width="10%" />
                                <col width="60%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="5%" />
                                <col width="5%" /> */}
                                <thead>
                                    <tr className='fs-tbl'>
                                        <th >Course Code</th>
                                        <th >Course Title</th>
                                        <th >Credit Hour(s) </th>
                                        <th > LG </th>
                                        <th >GP</th>
                                        <th > GPA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        // const size= resultOfASemester?.courses?.length
                                        resultOfASemester?.courses?.map(x => {
                                            console.log(resultOfASemester?.courses?.indexOf(x))
                                            return (
                                                <tr key={x?.courseCode} className='fs-tbl-marks'>
                                                    <td className='border border-1' >{x?.courseCode.toUpperCase()}</td>
                                                    <td className='border border-1' >{x?.courseTitle}</td>
                                                    <td className='border border-1' >{x.credit}</td>
                                                    <td className='border border-1' >{x.LG}</td>
                                                    <td className='border border-1' >{x.GP}</td>
                                                    {/* <td className='border border-bottom-0 border-top-0'>777</td> */}
                                                    {


                                                        <td className={
                                                            ' ' + (resultOfASemester?.courses?.indexOf(x) == 0) && + ' my-style '
                                                            // +
                                                            // (resultOfASemester?.courses?.indexOf(x) == leng - 1) && +' my-style'
                                                        }


                                                        >
                                                            {
                                                                (resultOfASemester?.courses?.indexOf(x) == leng / 2) &&
                                                                77
                                                            }
                                                        </td>




                                                    }

                                                    {/* {
                                                        resultOfASemester?.courses?.indexOf(x) === 0 &&
                                                        <td rowSpan={`${resultOfASemester?.courses?.length}`}  >{resultOfASemester?.GPA}</td>
                                                    } */}
                                                </tr>)
                                        })
                                    }
                                    {/* {
                                        resultOfASemester?.courses?.map(x => (
                                            <tr key={x?.courseCode} className='fs-tbl'>
                                                <td >{x?.courseCode.toUpperCase()}</td>
                                                <td >{x?.courseTitle}</td>
                                                <td >{x.credit}</td>
                                                <td >{x.LG}</td>
                                                <td >{x.GP}</td>
                                                {
                                                    resultOfASemester?.courses?.indexOf(x) === 0 &&
                                                    <td rowSpan={`${resultOfASemester?.courses?.length}`} >{resultOfASemester?.GPA}</td>
                                                }

                                            </tr>
                                        )
                                        )
                                    }
                                    {
                                        resultOfASemester?.courses?.map(x => (
                                            <tr key={x?.courseCode} className='fs-tbl'>
                                                <td >{x?.courseCode.toUpperCase()}</td>
                                                <td >{x?.courseTitle}</td>
                                                <td >{x.credit}</td>
                                                <td >{x.LG}</td>
                                                <td >{x.GP}</td>
                                                {
                                                    resultOfASemester?.courses?.indexOf(x) === 0 &&
                                                    <td rowSpan={`${resultOfASemester?.courses?.length}`} >{resultOfASemester?.GPA}</td>
                                                }

                                            </tr>
                                        )
                                        )
                                    } */}
                                    {/* {
                                        resultOfASemester?.courses?.map(x => (
                                            <tr key={x?.courseCode} className='fs-tbl'>
                                                <td >{x?.courseCode.toUpperCase()}</td>
                                                <td >{x?.courseTitle}</td>
                                                <td >{x.credit}</td>
                                                <td >{x.LG}</td>
                                                <td >{x.GP}</td>
                                                {
                                                    resultOfASemester?.courses?.indexOf(x) === 0 &&
                                                    <td rowspan={`${resultOfASemester?.courses?.length}`} >{resultOfASemester?.GPA}</td>
                                                }
                                            </tr>
                                        )
                                        )
                                    } */}


                                </tbody>
                            </Table>
                        </div>
                        <div className='row row-cols-lg-3 mt-5 ' style={{ fontSize: "12px" }}>
                            <div className='d-flex flex-column'>
                                <span><span className='fw-bold'>Date of Publications: </span></span>
                                <span><span className='fw-bold'>Date of Issue: </span></span>
                            </div>
                            <div className='d-flex flex-column'>
                                <span><span className='fw-bold'>Credits Offered: </span>{creditOffered}</span>
                                <span><span className='fw-bold'>Credits Earned: </span>{creditEarned}</span>
                                <span><span className='fw-bold'>CGPA: </span></span>
                                <span><span className='fw-bold'>Remarks: </span></span>
                            </div>
                            <div className="ms-5 ps-3 mt-4 w-25">
                                <hr style={{ height: "3px", color: "black", bordr: "none" }} />
                                <p className='text-center'>Conroller of Examinations</p>
                            </div>
                        </div>

                    </div>

                </Modal.Body>
            </Modal>

        </div>
    );
};

export default StudentResultSheetModal;