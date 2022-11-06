import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import {
    Stepper,
    Step,
    useStepper,
    StepNumber,
    StepTitle,
    StepStatus,
    StepDescription,
} from "react-progress-stepper";


const StepProgress = (props) => {
    const { current, applicationView, setApplicationView } = props;
    console.log('current ', current)
    console.log('application view ', applicationView)
    // (m,n)  => m means current step
    const { step, incrementStep, decrementStep } = useStepper(current, 6);

    // const steps = [
    //     { label: "Course Registration", activeColor: "452c3d" },
    //     { label: "Chairman Approval" },
    //     { label: "Hall Provost Approval" },
    //     { label: "Make Payment" },
    //     { label: "Controller Approval" },
    //     { label: "Admit Issue" }
    // ]

    return (
        <div className='container mb-5'>
            <h4 className='text-center'>Course Application Status</h4>
            <div>
                {/* <input type="range" min="0" max="100" onChange={(e) => { console.log(e.target.value) }} /> */}
                <Form.Label >Slide it to view </Form.Label>
                <Form.Range defaultValue={(applicationView - 1) * 20}
                    onChange={(e) => {
                        console.log(e.target.value)
                        if (e.target.value >= 0 && e.target.value <= 12) {
                            setApplicationView(1)
                        }
                        else if (e.target.value > 12 && e.target.value <= 32) {
                            setApplicationView(2)
                        }
                        else if (e.target.value > 32 && e.target.value <= 48) {
                            setApplicationView(3)
                        }
                        else if (e.target.value > 48 && e.target.value <= 70) {
                            setApplicationView(4)
                        }
                        else if (e.target.value > 70 && e.target.value <= 88) {
                            setApplicationView(5)
                        }
                        else if (e.target.value > 88 && e.target.value <= 100) {
                            setApplicationView(6)
                        }
                    }} />
            </div>
            <div className='my-5 '>
                <Stepper step={step}>

                    <Step onClick={() => { console.log('clicked') }} >
                        <StepTitle className='text-danger'>Course Registration </StepTitle>
                        <StepStatus />
                    </Step>
                    <Step>
                        <StepTitle>Chairman Approval </StepTitle>
                        <StepStatus />
                    </Step>
                    <Step>
                        <StepTitle>Hall Approval </StepTitle>
                        <StepStatus />
                        {/* <h3>hjh</h3> */}
                    </Step>
                    <Step>
                        <StepTitle> Payment </StepTitle>
                        <StepStatus />
                        {/* <StepDescription>Description</StepDescription> */}
                    </Step>
                    <Step>
                        {/* <StepNumber /> */}
                        <StepTitle> Academic </StepTitle>
                        <StepStatus />
                        {/* <StepDescription>Description</StepDescription> */}
                    </Step>
                    <Step>
                        {/* <StepNumber /> */}
                        <StepTitle> Admit Card </StepTitle>
                        <StepStatus />
                        {/* <StepDescription>Description</StepDescription> */}
                    </Step>
                </Stepper>

            </div >
        </div>
    );
};

export default StepProgress;

