import React, {useState, useRef, useEffect} from 'react';
import Step1 from './Personal';
import Step2 from './Experience';
import Step3 from './Education';
import Step4 from './Skills';
import ResumePreview from './ResumePrev';
import StepNavigation from './Nav';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Login from './Login';
import LoginPage from './LoginPage';
import { useNavigate } from 'react-router-dom';
import PopUp from './Contact';

console.log('Login:', Login);


const ResumeForm = () => {
    const [userToken, setUserToken] = useState(localStorage.getItem('token') || null);
    const [username, setUsername] = useState(localStorage.getItem('username') || null);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [userObject, setUserObject] = useState(() => {
        const savedData = localStorage.getItem('userObject');
        return savedData ? JSON.parse(savedData): {
        experience: [{ title: '', company: '', startDate: null, endDate: null, location: '', description: [''], currentlyWorking: false }],
        gradDate: null,
        extracurriculars: [],
        gpaEntries: [],
        skills: [],
        certifications: [],
        interests: []
        };
    });
    
    const [currentStep, setCurrentStep] = useState(1);
    const resumeRef = useRef();
    const navigate = useNavigate();

    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    

    //Auto-save progress to local storage
    useEffect(()=> {
        localStorage.setItem('userObject', JSON.stringify(userObject));
    }, [userObject]);

    // Save progress to backend
    const saveToBackend = async (token) => {
        if (!token) {
            alert('Please log in to save your progress.');
            return;
        }

        try {
            const response = await fetch('/api/save-resume', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ resumeData: userObject }),
            });

            if (response.ok) {
                alert('Progress saved to your account!');
            } else {
                alert('Failed to save progress.');
            }
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    };

    // Load progress from backend
    const loadFromBackend = async (token) => {
        if (!token) {
            alert('Please log in to load your progress.');
            return;
        }

        try {
            const response = await fetch('/api/get-resumes', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.resumes && data.resumes[0]) {
                    setUserObject(data.resumes[0]);
                }
            } else {
                alert('Failed to load progress.');
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }
    };

    const handleLogin = (token) => {
        setUserToken(token); // Update state
        alert('You are now logged in!');
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token
        setUserToken(null);
        alert('You are now logged out!');
    };

    

    const handleSignUp = async (username, password) => {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                alert('Sign-up successful! Please log in.');
                setIsSigningUp(false); // Redirect to login
            } else {
                const data = await response.json();
                alert(data.error || 'Failed to sign up.');
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
            alert('An error occurred. Please try again.');
        }
    };

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
        setUserObject(prevState => ({
            ...prevState,
            experience: prevState.experience.filter((_, index) => index !== expIndex)
        }));
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

    const addCourse = () => {
        setUserObject(prevState => ({
            ...prevState,
            courses: [...prevState.courses, '']
        }));
    };

    const handleCourseChange = (index, value) => {
        const newCourses = [...userObject.courses];
        newCourses[index] = value;
        setUserObject(prevState => ({ ...prevState, courses: newCourses }));
    };

    const removeCourse = (index) => {
        const newCourses = [...userObject.courses];
        newCourses.splice(index, 1);
        setUserObject(prevState => ({ ...prevState, courses: newCourses }));
    };

    const nextStep = () => setCurrentStep(prevStep => prevStep + 1);
    const prevStep = () => setCurrentStep(prevStep => prevStep - 1);

    const generatePDF = async () => {
        const input = resumeRef.current;
    
        if (!input) {
            console.error("Resume ref not found!");
            return;
        }
    
        try {
            const originalStyle = {
                padding: input.style.padding,
                margin: input.style.margin,
                boxSizing: input.style.boxSizing,
                width: input.style.width,
                height: input.style.height,
                overflow: input.style.overflow,
            };
    
            input.style.padding = '0';
            input.style.margin = '0';
            input.style.boxSizing = 'border-box';
            input.style.width = '8.5in'; 
            input.style.height = '11in'; 
            input.style.overflow = 'visible';
    
         
            const canvas = await html2canvas(input, {
                scale: 2, 
                useCORS: true,
                logging: false,
                scrollX: 0,
                scrollY: 0,
                width: input.offsetWidth, 
                height: input.offsetHeight, 
            });
    
            
            input.style.padding = originalStyle.padding;
            input.style.margin = originalStyle.margin;
            input.style.boxSizing = originalStyle.boxSizing;
            input.style.width = originalStyle.width;
            input.style.height = originalStyle.height;
            input.style.overflow = originalStyle.overflow;
    
            // Convert canvas to image data
            const imgData = canvas.toDataURL('image/jpeg', 0.7);
    
            
            const pdf = new jsPDF('p', 'mm', 'letter');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
    
            // Calculate image dimensions to fit exactly on the page
            const imgWidth = pdfWidth;
            const imgHeight = pdfHeight;
    
            // Add the image to the PDF, filling the entire page
            pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    
            // Save the PDF
            const firstName = userObject?.firstName || 'FirstName'; 
            const lastName = userObject?.lastName || 'LastName'; 
            const fileName = `resume_${firstName}_${lastName}.pdf`;
    
            // Save the PDF with the dynamic filename
            pdf.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };
    
const modalOverlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    };

    const modalContentStyle = {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "8px",
        width: "80%",
        maxWidth: "500px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
    };

    const closeButtonStyle = {
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
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
        flex: 1, 
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto', 
    };

    const previewContainerStyle = {
        padding: '20px',
        
        flex: 1, 
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto', 
    };
    const buttonStyle = {
        marginTop: '20px',
        alignSelf: 'flex-end',
    };
  

    return (
        <div style={{ padding: "20px", height: "100vh" }}>
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    borderBottom: "1px solid #ddd",
                    paddingBottom: "10px",
                }}
            >
                <h1>Resume Builder</h1>
                {username ? (
                    <span style={{ marginRight: "15px" }}></span>
                ) : (
                    userToken && <span style={{ marginRight: "15px" }}></span>
                )}
                {userToken ? (
                    <>
                        <button onClick={handleLogout} style={{ marginRight: "10px" }}>
                            Logout
                        </button>
                        <button
                            onClick={() => saveToBackend(userToken)}
                            style={{ marginRight: "10px" }}
                        >
                            Save Progress
                        </button>
                        <button onClick={() => loadFromBackend(userToken)}>
                            Load Progress
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        style={{
                            backgroundColor: "blue",
                            color: "white",
                            border: "none",
                            padding: "10px 15px",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        Login / Sign Up
                    </button>
                )}
                <button onClick={openModal} style={{ marginLeft: "10px" }}>
                    About Me
                </button>
            </header>

            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h2>About Me</h2>
                        <p>Developed by Annie Rome</p>
                        <p>Sign Up to save your progress, all users are stored in a MongoDB backend with an encrypted password</p>
                        <p>
                            Check out my portfolio here:{" "}
                            <a href="https://www.anniecaroline.com/" target="_blank" rel="noopener noreferrer">
                                My Portfolio
                            </a>
                        </p>
                        <button onClick={closeModal} style={closeButtonStyle}>
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div style={formPreviewContainerStyle}>
                <div style={formContainerStyle}>
                    {currentStep === 1 && <Step1 userObject={userObject} handleChange={handleChange} />}
                    {currentStep === 2 && (
                        <Step2
                            userObject={userObject}
                            handleExperienceChange={handleExperienceChange}
                            handleDescriptionChange={handleDescriptionChange}
                            addExperience={addExperience}
                            addDescription={addDescription}
                            removeDescription={removeDescription}
                            removeExperience={removeExperience}
                        />
                    )}
                    {currentStep === 3 && (
                        <Step3
                            userObject={userObject}
                            handleChange={handleChange}
                            handleDateChange={handleDateChange}
                            addExtracurricular={addExtracurricular}
                            addGPA={addGPA}
                            handleExtracurricularChange={handleExtracurricularChange}
                            handleGPAChange={handleGPAChange}
                            removeExtracurricular={removeExtracurricular}
                            removeGPA={removeGPA}
                        />
                    )}
                    {currentStep === 4 && (
                        <Step4
                            userObject={userObject}
                            handleChange={handleChange}
                            addSkill={addSkill}
                            addCertification={addCertification}
                            addCourse={addCourse}
                            handleSkillChange={handleSkillChange}
                            handleCertificationChange={handleCertificationChange}
                            handleCourseChange={handleCourseChange}
                            removeSkill={removeSkill}
                            removeCertification={removeCertification}
                            removeCourse={removeCourse}
                        />
                    )}
                    <StepNavigation
                        currentStep={currentStep}
                        totalSteps={4}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                </div>
                <div style={previewContainerStyle} ref={resumeRef}>
                    <ResumePreview userObject={userObject} />
                </div>
            </div>
            <button style={buttonStyle} onClick={generatePDF}>
                Download as PDF
            </button>
        </div>
    );
}

export default ResumeForm;
