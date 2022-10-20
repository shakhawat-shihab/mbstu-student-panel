import React from 'react';
import { useState } from 'react';
import CountUp from 'react-countup';
import ScrollTrigger from 'react-scroll-trigger';
import './Counter.css';

const Counter = () => {
    const [counterOn, setCounterOn] = useState(false);
    return (
        <div className=''>
            <div className="container mx-auto shadow-lg mt-3 mb-5 p-3 border border-outline-danger rounded">
                <ScrollTrigger onEnter={() => setCounterOn(true)} onExit={() => setCounterOn(false)}>
                    <div className="counter-section">

                        <div className='mb-3'>
                            {counterOn && <div className='fs-4 text-center'>
                                <CountUp end={220} suffix="+" duration={1} className="text-success" />
                                <p className='text-danger'>Current Teachers</p>
                            </div>}

                        </div>
                        <div className='mb-3'>
                            {counterOn && <div className='fs-4 text-center'>
                                <CountUp end={950} suffix="+" duration={1} className="text-success" />
                                <p className="text-danger">Current Students</p>
                            </div>}

                        </div>
                        <div className='mb-3'>
                            {counterOn && <div className='fs-4 text-center'>
                                <CountUp end={3280} suffix="+" duration={1} className="text-success" />
                                <p className="text-danger">Total Visitors</p>
                            </div>}

                        </div>
                        <div className='mb-3'>
                            {counterOn && <div className='fs-4 text-center'>
                                <CountUp end={9970} suffix="+" duration={1} className="text-success" />
                                <p className="text-danger">Total visits</p>
                            </div>}

                        </div>

                    </div>
                </ScrollTrigger>
            </div>
            {/* <CountUp end={100} duration={50} /> */}
        </div>
    );
};

export default Counter;