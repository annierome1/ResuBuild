import React from 'react';

const StepNavigation = ({ currentStep, totalSteps, nextStep, prevStep }) => {
    return (
        <div className='step-navigation'>
            {currentStep > 1 && <button onClick={prevStep}>Previous</button>}
            {currentStep < totalSteps && <button onClick={nextStep}>Next</button>}
        </div>
    );
};

export default StepNavigation;
