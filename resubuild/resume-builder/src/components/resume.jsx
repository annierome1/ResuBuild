import React, { useState, useRef } from 'react';
import Step1 from './Personal';
import Step2 from './Experience';
import Step3 from './Education';
import Step4 from './Skills';
import ResumePreview from './ResumePrev';
import StepNavigation from './Nav';
import {useReactToPrint} from 'react-to-print'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const ResumeForm = () => {
    const [userObject, setUserObject] = useState({
        experience: [{ title: '', company: '', startDate: null, endDate: null, location: '', description: [''], currentlyWorking: false }],
        gradDate: null,
        extracurriculars: [],
        gpaEntries: [],
        skills: [],
        certifications: [],
        interests: []
    });
    const [currentStep, setCurrentStep] = useState(1);
    const resumeRef = useRef();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserObject(prevState => ({ ...prevState, [name]: value }));
    };

    const handleDateChange = (name, date) => {
        setUserObject(prevState => ({ ...prevState, [name]: date }));
    };

    const handleExperienceChange = (index, key, value) => {
        const newExperience = [...userObject.experience];
        if (key.startsWith('description')) {
            const descIndex = key.split('[')[1].split(']')[0];
            newExperience[index].description[descIndex] = value;
        } else {
            newExperience[index] = { ...newExperience[index], [key]: value };
        }
        setUserObject(prevState => ({ ...prevState, experience: newExperience }));
    };

    const handleDescriptionChange = (expIndex, descIndex, value) => {
        const newExperience = [...userObject.experience];
        newExperience[expIndex].description[descIndex] = value;
        setUserObject(prevState => ({ ...prevState, experience: newExperience }));
    };

    const addExperience = () => {
        setUserObject(prevState => ({
            ...prevState,
            experience: [...prevState.experience, { title: '', company: '', startDate: null, endDate: null, location: '', description: [''], currentlyWorking: false }]
        }));
    };

    const removeExperience = (expIndex) => {
        const newExperience = [...userObject.experience];
        newExperience.splice(expIndex, 1); // Remove the experience at the specified index
        setUserObject(prevState => ({ ...prevState, experience: newExperience }));
    };

    const addDescription = (index) => {
        const newExperience = [...userObject.experience];
        newExperience[index].description.push('');
        setUserObject(prevState => ({ ...prevState, experience: newExperience }));
    };

    const removeDescription = (expIndex, descIndex) => {
        const newExperience = [...userObject.experience];
        newExperience[expIndex].description.splice(descIndex, 1);
        setUserObject(prevState => ({ ...prevState, experience: newExperience }));
    };

    const addExtracurricular = () => {
        setUserObject(prevState => ({
            ...prevState,
            extracurriculars: [...prevState.extracurriculars, '']
        }));
    };

    const handleExtracurricularChange = (index, value) => {
        const newExtracurriculars = [...userObject.extracurriculars];
        newExtracurriculars[index] = value;
        setUserObject(prevState => ({ ...prevState, extracurriculars: newExtracurriculars }));
    };

    const removeExtracurricular = (index) => {
        const newExtracurriculars = [...userObject.extracurriculars];
        newExtracurriculars.splice(index, 1);
        setUserObject(prevState => ({ ...prevState, extracurriculars: newExtracurriculars }));
    };

    const addGPA = () => {
        setUserObject(prevState => ({
            ...prevState,
            gpaEntries: [...prevState.gpaEntries, '']
        }));
    };

    const handleGPAChange = (index, value) => {
        const newGPAEntries = [...userObject.gpaEntries];
        newGPAEntries[index] = value;
        setUserObject(prevState => ({ ...prevState, gpaEntries: newGPAEntries }));
    };

    const removeGPA = (index) => {
        const newGPAEntries = [...userObject.gpaEntries];
        newGPAEntries.splice(index, 1);
        setUserObject(prevState => ({ ...prevState, gpaEntries: newGPAEntries }));
    };

    const addSkill = () => {
        setUserObject(prevState => ({
            ...prevState,
            skills: [...prevState.skills, '']
        }));
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...userObject.skills];
        newSkills[index] = value;
        setUserObject(prevState => ({ ...prevState, skills: newSkills }));
    };

    const removeSkill = (index) => {
        const newSkills = [...userObject.skills];
        newSkills.splice(index, 1);
        setUserObject(prevState => ({ ...prevState, skills: newSkills }));
    };

    const addCertification = () => {
        setUserObject(prevState => ({
            ...prevState,
            certifications: [...prevState.certifications, '']
        }));
    };

    const handleCertificationChange = (index, value) => {
        const newCertifications = [...userObject.certifications];
        newCertifications[index] = value;
        setUserObject(prevState => ({ ...prevState, certifications: newCertifications }));
    };

    const removeCertification = (index) => {
        const newCertifications = [...userObject.certifications];
        newCertifications.splice(index, 1);
        setUserObject(prevState => ({ ...prevState, certifications: newCertifications }));
    };

    const addInterest = () => {
        setUserObject(prevState => ({
            ...prevState,
            interests: [...prevState.interests, '']
        }));
    };

    const handleInterestChange = (index, value) => {
        const newInterests = [...userObject.interests];
        newInterests[index] = value;
        setUserObject(prevState => ({ ...prevState, interests: newInterests }));
    };

    const removeInterest = (index) => {
        const newInterests = [...userObject.interests];
        newInterests.splice(index, 1);
        setUserObject(prevState => ({ ...prevState, interests: newInterests }));
    };

    const nextStep = () => setCurrentStep(prevStep => prevStep + 1);
    const prevStep = () => setCurrentStep(prevStep => prevStep - 1);

    const generatePDF = async () => {
        const input = resumeRef.current;
        const canvas = await html2canvas(input, { scale: 1.5, useCORS: true, logging: false }); // Adjusted scale
        const imgData = canvas.toDataURL('image/jpeg', 0.75); // Use JPEG format for smaller file size
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('resume.pdf');
    };

    const resumeFormStyle = {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        
    };

    const formPreviewContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        height: '100%',
        width: '100%', 
        flexGrow: 1,
    };

    const formContainerStyle = {
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#d7dbd8',
        flex: 1, // Allows the preview to grow and fill the remaining space
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto', // Adds scroll to the preview if it overflows
    };

    const previewContainerStyle = {
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#d7dbd8',
        flex: 1, // Allows the preview to grow and fill the remaining space
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto', // Adds scroll to the preview if it overflows
    };
    const buttonStyle = {
        marginTop: '20px',
        alignSelf: 'flex-end',
    };

    const handlePrint = useReactToPrint({
        content: () => resumeRef.current,
    });

    return (
        <div style={resumeFormStyle}>
            <div style={formPreviewContainerStyle}>
                <div style={formContainerStyle}>
                    {currentStep === 1 && <Step1 userObject={userObject} handleChange={handleChange} />}
                    {currentStep === 2 && <Step2 userObject={userObject} handleExperienceChange={handleExperienceChange} handleDescriptionChange={handleDescriptionChange} addExperience={addExperience} addDescription={addDescription} removeDescription={removeDescription} removeExperience={removeExperience} />}
                    {currentStep === 3 && <Step3 userObject={userObject} handleChange={handleChange} handleDateChange={handleDateChange} addExtracurricular={addExtracurricular} addGPA={addGPA} handleExtracurricularChange={handleExtracurricularChange} handleGPAChange={handleGPAChange} removeExtracurricular={removeExtracurricular} removeGPA={removeGPA} />}
                    {currentStep === 4 && <Step4 userObject={userObject} handleChange={handleChange} addSkill={addSkill} addCertification={addCertification} addInterest={addInterest} handleSkillChange={handleSkillChange} handleCertificationChange={handleCertificationChange} handleInterestChange={handleInterestChange} removeSkill={removeSkill} removeCertification={removeCertification} removeInterest={removeInterest} />}
                    <StepNavigation currentStep={currentStep} totalSteps={4} nextStep={nextStep} prevStep={prevStep} />
                </div>
        <div style={previewContainerStyle} >
            <ResumePreview userObject={userObject} />
        </div>
            </div>
            <button style={buttonStyle} onClick={generatePDF}>Download as PDF</button>
        </div>
    );
};

export default ResumeForm;