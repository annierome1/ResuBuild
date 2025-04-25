import React, {useState, useRef, useEffect} from 'react';
import Step1 from './Personal';
import Step2 from './Experience';
import Step3 from './Education';
import Step4 from './Skills';
import Step5 from './Projects';
import ResumePreview from './ResumePrev';
import StepNavigation from './Nav';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Login from './Login';
import { useNavigate } from 'react-router-dom';

console.log('Login:', Login);


const ResumeForm = () => {
    const [userToken, setUserToken] = useState(localStorage.getItem('token') || null);
    const [username, setUsername] = useState(localStorage.getItem('username') || null);
    const [resumeList, setResumeList] = useState([]);
    const [selectedResume, setSelectedResume] = useState("");
    const [userObject, setUserObject] = useState(() => {
        const savedData = localStorage.getItem('userObject');
        return savedData ? JSON.parse(savedData) : {
            username: username || "",
            resumeName: "",
            experience: [{ title: '', company: '', startDate: null, endDate: null, location: '', description: [''], currentlyWorking: false }],
            projects: [{ title: '', description: [''], company: '' }],
            gradDate: null,
            extracurriculars: [],
            statement: "",
            gpaEntries: [],
            skills: [],
            certifications: [],
            interests: [],
            courses: [],
        };
    });

    const [sectionOrder, setSectionOrder] = useState([
        'experience',
        'projects',
        'education',
        'skills'
      ]);
      
      const moveSectionUp = (sectionKey) => {
        setSectionOrder((prevOrder) => {
          const index = prevOrder.indexOf(sectionKey);
          if (index <= 0) return prevOrder;
          const newOrder = [...prevOrder];
          [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
          return newOrder;
        });
      };
      
      const moveSectionDown = (sectionKey) => {
        setSectionOrder((prevOrder) => {
          const index = prevOrder.indexOf(sectionKey);
          if (index === -1 || index === prevOrder.length - 1) return prevOrder;
          const newOrder = [...prevOrder];
          [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
          return newOrder;
        });
      };
      



    
    const [currentStep, setCurrentStep] = useState(1);
    const resumeRef = useRef();
    const [isOverflowing, setIsOverflowing] = useState(false);
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    

    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    

    //Auto-save progress to local storage
    useEffect(()=> {
        localStorage.setItem('userObject', JSON.stringify(userObject));
    }, [userObject]);

    useEffect(() =>{
        if (userToken && username){
            fetchResumeList(userToken);
        }
    }, [userToken, username]);

    const saveToBackend = async (token) => {
        if (!token) {
            alert('Please log in to save your progress.');
            return;
        }
    
        const trimmedResumeName = userObject.resumeName?.trim() || "";
        if (!trimmedResumeName) {
            alert('Please enter a valid resume name before saving.');
            return;
        }
    
        if (!username) {
            alert("Error: Username is missing. Please log in again.");
            return;
        }
    
        try {
            const userObjectWithOrder = {
                ...userObject,
                sectionOrder // ✅ Include current section order
            };
    
            const requestBody = {
                username,
                resumeName: trimmedResumeName,
                userObject: userObjectWithOrder
            };
    
            const response = await fetch('/api/resume/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });
    
            const responseData = await response.json();
            if (response.ok) {
                alert('Resume saved successfully!');
            } else {
                alert(`Failed to save resume: ${responseData.error || "Unknown error"}`);
            }
        } catch (error) {
            console.error('Error saving resume:', error);
        }
    };
    
    
    
    
    
    const fetchResumeList = async (token) => {
        if (!token) return;

        try {
            const response = await fetch(`/api/resume/list?username=${username}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await response.json();

            if (response.ok && data.length > 0) {
                setResumeList(data);
            } else {
                setResumeList([]);
            }
        } catch (error) {
            console.error("Error fetching resumes:", error);
        }
    };

    const loadSelectedResume = async () => {
        if (!userToken || !selectedResume) {
            alert("Please select a resume to load.");
            return;
        }
    
        try {
            const response = await fetch(`/api/resume/load?username=${username}&resumeName=${selectedResume}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${userToken}` },
            });
    
            const data = await response.json();
            if (response.ok) {
                const loadedUserObject = data.userObject;
    
                setUserObject(loadedUserObject);
    
                //  Set section order from loaded data or fallback to default
                if (loadedUserObject.sectionOrder) {
                    setSectionOrder(loadedUserObject.sectionOrder);
                } else {
                    setSectionOrder(['experience', 'projects', 'education', 'skills']);
                }
    
                alert(`Resume "${selectedResume}" loaded successfully!`);
            } else {
                alert("Failed to load resume.");
            }
        } catch (error) {
            console.error("Error loading resume:", error);
        }
    };
    
    
    


    const handleLogout = () => {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userObject'); // Clear saved resume data
    
        // Reset state
        setUserToken(null);
        setUsername(null);
        setUserObject({
            experience: [
                { title: '', company: '', startDate: null, endDate: null, location: '', description: [''], currentlyWorking: false }
            ],
            gradDate: null,
            extracurriculars: [],
            gpaEntries: [],
            skills: [],
            certifications: [],
            interests: []
        });
    
        alert('You are now logged out!');
    };
    

    const createNewResume = () => {
    
        const blankResume = {
            resumeName: "",
            experience: [{ title: '', company: '', startDate: null, endDate: null, location: '', description: [''], currentlyWorking: false }],
            projects: [{ title: '', description: [''], company: '' }],
            gradDate: null,
            extracurriculars: [],
            statement: "",
            gpaEntries: [],
            skills: [],
            certifications: [],
            interests: []
        };
    
        setUserObject((prevState) => {
            return { ...blankResume }; 
        });
    
        setSelectedResume(""); 
        localStorage.removeItem("userObject"); 
    
        alert("New resume created! You can start fresh.");
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
    
    const handleProjectChange = (index, key, value) => {
        setUserObject(prevState => {
            const newProjects = [...prevState.projects];
    
            if (key.startsWith('description')) {
                const descIndex = key.split('[')[1].split(']')[0]; // Extract index from 'description[0]'
                newProjects[index].description = newProjects[index].description || []; // Ensure it's an array
                newProjects[index].description[descIndex] = value;
            } else {
                newProjects[index] = { ...newProjects[index], [key]: value };
            }
    
            return { ...prevState, projects: newProjects };
        });
    };
    
    const handleProjectDescriptionChange = (projIndex, descIndex, value) => {
        setUserObject(prevState => {
            const newProjects = [...prevState.projects];
            newProjects[projIndex].description[descIndex] = value;
            return { ...prevState, projects: newProjects };
        });
    };
    
    
    const addProject = () => {
        setUserObject(prevState => ({
            ...prevState,
            projects: [
                ...prevState.projects,
                { title: '', description: [], technologies: '', link: '' } // Ensure description is an array
            ]
        }));
    };
    
    const removeProject = (projIndex) => {
        setUserObject(prevState => ({
            ...prevState,
            projects: prevState.projects.filter((_, index) => index !== projIndex)
        }));
    };
    
    const addProjectDescription = (projIndex) => {
        setUserObject(prevState => {
            const newProjects = [...prevState.projects];
            newProjects[projIndex].description = newProjects[projIndex].description || []; // Ensure it's an array
            newProjects[projIndex].description.push('');
            return { ...prevState, projects: newProjects };
        });
    };
    
    
    const removeProjectDescription = (projIndex, descIndex) => {
        setUserObject(prevState => {
            const newProjects = [...prevState.projects];
            if (Array.isArray(newProjects[projIndex].description)) {
                newProjects[projIndex].description.splice(descIndex, 1);
            }
            return { ...prevState, projects: newProjects };
        });
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
        setUserObject((prevState) => ({
            ...prevState,
            courses: prevState.courses ? [...prevState.courses, ""] : [""] // ✅ Ensure courses exists
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
    
    const checkContentOverflow = () => {
        if (!resumeRef?.current) return;
    
        const resumeContainer = resumeRef.current;
        const header = resumeContainer.querySelector('.header');
        const sections = resumeContainer.querySelectorAll('.section');
    
        let totalContentHeight = 0;
    
        // Include header height
        if (header) {
            const headerRect = header.getBoundingClientRect();
            totalContentHeight += headerRect.height; // Include full height (with margins/padding)
            console.log("Header height with margins/padding:", headerRect.height);
        }
    
        // Add heights of all sections
        sections.forEach((section, index) => {
            const sectionRect = section.getBoundingClientRect();
            totalContentHeight += sectionRect.height;
    
            console.log(`Section ${index + 1}:`, {
                height: sectionRect.height,
                content: section.innerHTML.trim().slice(0, 100),
            });
        });
    
        // Adjust threshold if necessary
        const containerHeight = 1002; 
        console.log({
            containerHeight,
            totalContentHeight,
        });
    
        // Update overflow state
        setIsOverflowing(totalContentHeight > containerHeight);
    };

    const [isSaveAsModalOpen, setSaveAsModalOpen] = useState(false);
    const [newResumeName, setNewResumeName] = useState('');
    const handleSaveAsNew = async () => {
        const name = newResumeName.trim();
        if (!name) return alert('Please enter a name.');
      
        const clone = { ...userObject, resumeName: name };
        try {
          const res = await fetch('/api/resume/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({ username, resumeName: name, userObject: clone }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Save failed');
      
          // update local state
          setUserObject(clone);
          setSelectedResume(name);
          await fetchResumeList(userToken);
      
          alert(`Saved as new resume: "${name}"`);
          setSaveAsModalOpen(false);
        } catch (err) {
          console.error(err);
          alert(err.message);
        }
      };
      

    
    
    
    
    
    
    

    useEffect(() => {
        // Check overflow initially
        console.log("Overflow");
        checkContentOverflow();

        // Set up a MutationObserver for real-time detection
        const observer = new MutationObserver(() => checkContentOverflow());
        if (resumeRef.current) {
            observer.observe(resumeRef.current, {
                childList: true,
                subtree: true,
                characterData: true,
            });
        }

        // Cleanup the observer
        return () => observer.disconnect();
    }, []);


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

            Object.assign(input.style, originalStyle);
            // Convert canvas to image data
            const imgData = canvas.toDataURL('image/jpeg', 0.7);
            console.log("Captured Canvas Dimensions:");
            console.log("Canvas Width:", canvas.width, "px");
            console.log("Canvas Height:", canvas.height, "px");
    
            
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
    
    const dropdownButtonStyle = {
        width: "100%",
        padding: "10px",
        backgroundColor: "#cbcbcb",
        border: "none",
        borderRadius: "5px",
        textAlign: "center",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        marginBottom: "5px",
        transition: "background 0.2s ease",
    };
    
    
    


    const formPreviewContainerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        height: '110%',
        width: '100%', 
        flexGrow: 1,
    };

    const formContainerStyle = {
        padding: '20px',
        maxWidth: "40%",
        border: '1px solid #ddd',
        borderRadius: '5px',
        backgroundColor: '#d7dbd8',
        flex: 1, 
        height: '1056',
        boxSizing: 'border-box',
        overflowY: 'auto', 
    };

    const previewContainerStyle = {
        width: "816px",
        height: "1056px",
        padding: '10px',
        flex: 1, 
        boxSizing: 'border-box',
        overflowY: 'auto', 
    };
    const buttonStyle = {
        marginTop: '20px',
        alignSelf: 'flex-end',
    };

    const moveItemUp = (key, index) => {
        if (index === 0) return;
        const updated = [...userObject[key]];
        [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        setUserObject(prev => ({ ...prev, [key]: updated }));
    };
    
    const moveItemDown = (key, index) => {
        if (index === userObject[key].length - 1) return;
        const updated = [...userObject[key]];
        [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
        setUserObject(prev => ({ ...prev, [key]: updated }));
    };


    {/*This is the issue*/}
    const handleDeleteResume = async () => {
        if (!selectedResume) {
          return alert('No resume selected to delete.');
        }
        if (!window.confirm(`Really delete "${selectedResume}"? This cannot be undone.`)) {
          return;
        }
      
        try {
          const response = await fetch('/api/resume/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({
              username,
              resumeName: selectedResume,
            }),
          });
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Delete failed');
      
          // Remove it locally
          setResumeList(prev => prev.filter(r => r.resumeName !== selectedResume));
          setSelectedResume('');
          // Reset the form to a blank resume (or whatever you prefer)
          createNewResume();
      
          alert(`Deleted resume "${data.resumeName || selectedResume}".`);
        } catch (err) {
          console.error('Delete failed', err);
          alert(`Could not delete resume: ${err.message}`);
        }
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
                

                <span style={{ marginRight: "15px" }}>
                    {userToken && username ? `Welcome, ${username}!` : "Welcome!"}
                </span>
                <button onClick={openModal} style={{ marginLeft: "10px" }}>
                    About
                </button>

                {userToken ? (
                    <>
                        

                        {/* Resume Selection Dropdown */}
                        {resumeList.length > 0 ? (
                            <div style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}>
                                <select
                                    onChange={(e) => setSelectedResume(e.target.value)}
                                    style={{
                                        padding: "8px",
                                        borderRadius: "5px",
                                        border: "1px solid #ccc",
                                    }}
                                    value={selectedResume || ""}
                                >
                                    <option value="">Select a resume to load</option>
                                    {resumeList.map((resume) => (
                                        <option key={resume._id} value={resume.resumeName}>
                                            {resume.resumeName}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={loadSelectedResume}
                                    style={{
                                        marginLeft: "10px",
                                        padding: "8px 12px",
                                        backgroundColor: "#007bff",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                    disabled={!selectedResume}
                                >
                                    Load Resume
                                </button>
                            </div>
                        ) : (
                            <span style={{ marginLeft: "10px" }}>No saved resumes</span>
                        )}
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

                
                {/* Dropdown Menu */}
                <div style={{ position: "relative" }}>
                            <button
                                style={{
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    border: "none",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    transition: "background 0.3s ease",
                                }}
                                onClick={() => setDropdownOpen(!isDropdownOpen)}
                            >
                                Actions ▼
                            </button>

                            {isDropdownOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "45px",
                                        right: "0",
                                        backgroundColor: "white",
                                        borderRadius: "10px",
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                        zIndex: 1000,
                                        padding: "10px",
                                        width: "200px",
                                    }}
                                >
                                    <button
                                        onClick={() => saveToBackend(userToken)}
                                        style={dropdownButtonStyle}
                                    >
                                        Save Progress
                                    </button>
                                    <button
                                        onClick={createNewResume}
                                        style={{ ...dropdownButtonStyle, backgroundColor: "#28a745" }}
                                    >
                                        New Resume
                                    </button>
                                    <button
                                        onClick={() => {
                                        setDropdownOpen(false);
                                        setNewResumeName('');
                                        setSaveAsModalOpen(true);
                                        }}
                                        style={dropdownButtonStyle}
                                    >
                                        Save As New…
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            handleDeleteResume();
                                        }}
                                        style={{ 
                                            ...dropdownButtonStyle, 
                                            backgroundColor: '#dc3545', 
                                            color: 'white',
                                            marginTop: '0.5rem'
                                        }}
                                        >
                                        Delete Resume
                                        </button>

                                    <button
                                        onClick={() => navigate("/cover-letter")}
                                        style={dropdownButtonStyle}
                                    >
                                        Generate Cover Letter
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            ...dropdownButtonStyle,
                                            backgroundColor: "#dc3545",
                                            color: "white",
                                        }}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                        {/* Save As New Modal */}
                        {isSaveAsModalOpen && (
                        <div style={modalOverlayStyle}>
                            <div style={modalContentStyle}>
                            <h2>Save As New Resume</h2>
                            <input
                                type="text"
                                placeholder="Enter new resume name"
                                value={newResumeName}
                                onChange={e => setNewResumeName(e.target.value)}
                                style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => setSaveAsModalOpen(false)} style={{ marginRight: '10px' }}>
                                Cancel
                                </button>
                                <button onClick={handleSaveAsNew} style={{ backgroundColor: '#28a745', color: 'white' }}>
                                Save
                                </button>
                            </div>
                            </div>
                        </div>
                        )}
            </header>

            {/* Modal */}
            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <h2>About the app</h2>
                        <p>
                            This dynamic, one-page resume builder is designed with simplicity in mind—just what many employers are looking for today. 
                            Create and preview your resume in real-time! <br /><br /> 
                            Need a cover letter? Have ChatGPT curate a custom cover letter for you based on the job description and the resume you have created. 
                            <br /><br /> 
                            Reach out to me if you find bugs!!
                        </p>

                        <p>
                            Developed by{" "}
                            <a href="https://www.anniecaroline.com/" target="_blank" rel="noopener noreferrer">
                                Annie Rome
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
                            moveItemUp={moveItemUp}
                            moveItemDown={moveItemDown}
                            
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
                    {currentStep === 5 && (
                        <Step5
                            userObject={userObject}
                            handleProjectChange={handleProjectChange}
                            addProject={addProject}
                            removeProject={removeProject}
                            addProjectDescription={addProjectDescription}
                            removeProjectDescription={removeProjectDescription}
                            handleProjectDescriptionChange={handleProjectDescriptionChange}
                            moveItemUp={moveItemUp}
                            moveItemDown={moveItemDown}
                        
                        />
                    )}

                    <StepNavigation
                        currentStep={currentStep}
                        totalSteps={5}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                    <div style={{ marginTop: '20px' }}>
                    <h3>Reorder Sections</h3>
                    {sectionOrder.map((sectionKey, index) => (
                        <div key={sectionKey} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ flex: 1, textTransform: 'capitalize' }}>{sectionKey}</span>
                        <button onClick={() => moveSectionUp(sectionKey)} disabled={index === 0}>↑</button>
                        <button onClick={() => moveSectionDown(sectionKey)} disabled={index === sectionOrder.length - 1}>↓</button>
                        </div>
                    ))}
                    </div>

                </div>
                <div style={previewContainerStyle} ref={resumeRef}>
                <ResumePreview
                    ref={resumeRef}
                    userObject={userObject}
                    isOverflowing={isOverflowing}
                    sectionOrder = {sectionOrder}
                />
                </div>
            </div>
            <button style={buttonStyle}
                onClick={generatePDF}
                disabled={isOverflowing}>
                Download as PDF
            </button>
        </div>
    );
}

export default ResumeForm;
