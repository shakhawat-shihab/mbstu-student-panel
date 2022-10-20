import React from 'react';
import { FaHandPointRight, FaPhoneAlt, FaEnvelope, FaFacebook } from "react-icons/fa";
import { AiFillInstagram, AiFillTwitterCircle, AiFillYoutube } from "react-icons/ai";
import './Footer.css'
const Footer = () => {
    return (
        <div className="footer-bg">
            <div className="container">
                <div className="row m-0 py-3 px-2">
                    <div className="col-sm-12 col-md-12 col-lg-12">
                        <div className="row row-cols-lg-5 mt-4">
                            <div className="col-sm-12 col-md-4 my-2">
                                <h5 className="text-warning">The University</h5>
                                <ul className="list-unstyled mt-3" style={{ fontSize: "14px" }}>
                                    <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> About MBSTU</a></li>
                                    <li className="mb-3"><a href=''><FaHandPointRight className="fas fa-hand-point-right me-2" /> Admin Bodies</a></li>
                                    {/* <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> Regent board</a></li> */}
                                    <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> Office & section</a></li>
                                    <li><a href="#"><FaHandPointRight className="fas fa-hand-point-right me-2" /> Exam Result</a></li>
                                </ul>
                            </div>
                            <div className="col-sm-12 col-md-4 my-2">
                                <h5 className="text-warning">Academic</h5>
                                <ul className="list-unstyled mt-3" style={{ fontSize: "14px" }}>
                                    <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> Departments</a></li>
                                    <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> Undergraduate Program</a></li>
                                    <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> Postgraduate Program</a></li>
                                    {/* <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> Academic Council</a></li>
                                    <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> Academic Calendar</a></li> */}
                                </ul>

                            </div>
                            <div className="col-sm-12 col-md-4 my-2">
                                <h5 className="text-warning">Useful Link</h5>
                                <ul className="list-unstyled mt-3" style={{ fontSize: "14px" }}>
                                    <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> Payment System</a></li>
                                    <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> Notice Board</a></li>
                                    <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> FAQ</a></li>

                                </ul>
                            </div>
                            {/* <div className="col-sm-12 col-md-6 col-lg-2 my-2">
                                <h5 className="text-warning">Campus</h5>
                                <ul className="list-unstyled mt-3" style={{ fontSize: "14px" }}>
                                    <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> Library</a></li>
                                    <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> Medical</a></li>
                                    <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> Clubs</a></li>
                                    <li className="mb-3"><a href="" target='_blank' rel='noreferrer'><FaHandPointRight className="fas fa-hand-point-right me-2" /> Transport</a></li>

                                </ul>
                            </div> */}
                            <div className="col-sm-12 col-md-4 my-2 text-white">
                                <h5 className="text-warning">Contact</h5>
                                <ul className="list-unstyled  mt-3" style={{ fontSize: "14px" }}>
                                    <li>Mawlana Bhashani Science and Technology University (MBSTU), Bangladesh <br /> <br /></li>
                                    <li> <FaPhoneAlt className="me-1" />  +88-01315-213553</li><br />
                                    <li><FaEnvelope className="me-1" /> cse@mbstu.ac.bd</li>
                                </ul>
                            </div>
                            <div className="col-sm-12 col-md-4 my-2">
                                <h5 className="text-warning">Follow Us On</h5>
                                <div className="mt-4 d-felx">
                                    <a href="https://www.twitter.com" target='_blank' rel='noreferrer'> <AiFillTwitterCircle className="me-2 text-white follow-icon-twt " style={{ fontSize: '35px' }} /></a>
                                    <a href="https://www.facebook.com" target='_blank' rel='noreferrer' ><FaFacebook className="me-2 text-white follow-icon-fb " style={{ fontSize: '30px' }} /></a>
                                    <a href="https://www.youtube.com" target='_blank' rel='noreferrer' ><AiFillYoutube className="me-2 text-white follow-icon-yt " style={{ fontSize: '40px' }} /></a>
                                    <a href="https://www.instagram.com" target='_blank' rel='noreferrer' ><AiFillInstagram className="me-2 text-white follow-icon-insta " style={{ fontSize: '40px' }} /></a>
                                    {/* <a href="https://www.youtube.com"><i style={iconStyle} className="fab fa-youtube-square me-2"></i></a> */}
                                    {/* <a href="https://www.instagram.com"><i style={iconStyle} className="fab fa-instagram-square"></i></a> */}
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* copyright  */}
                    <p className="mt-5 text-center text-white m-0 fs-5">
                        &copy; 2022 - 2027 | All Rights Reserved by <span style={{ color: "red" }}> CSE MBSTU</span>
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Footer;