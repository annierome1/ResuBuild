import React, { useEffect } from 'react';
import './ResumePrev.css';

// Use React.forwardRef to forward the ref properly
const ResumePreview = React.forwardRef(({ userObject, isOverflowing }, ref) => {
    // Function to check for overflow
    const checkContentOverflow = () => {
        if (!ref?.current) return;

        const resumeContainer = ref.current;
        const containerHeight = resumeContainer.offsetHeight; // Defined height (1056px)
        const contentHeight = resumeContainer.scrollHeight; // Actual content height

        console.log({ containerHeight, contentHeight });
    };
    
    // Check overflow on mount and when content changes
    useEffect(() => {
        checkContentOverflow();
    }, [userObject]);

    const sortedExperiences = [...userObject.experience].sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate) : new Date(0); // Treat null dates as earliest
        const dateB = b.startDate ? new Date(b.startDate) : new Date(0);
        return dateB - dateA; // Descending order
    });

    return (
        <div>
         <div ref ={ref} className='resume-container'>
            <div className='header'>
                <h1>{userObject.firstName} {userObject.lastName}</h1>
                <div className='contact'>
                    <p>{userObject.email}</p>
                    <p>{userObject.phone}</p>
                    <p>{userObject.website}</p>
                    <p>{userObject.location}</p>
                </div>
            </div>
            <div className='section'>
                <h2>Work Experience</h2>
                {sortedExperiences.map((exp, index) => (
                    <div key={index} className='experience-item'>
                    <div className='company-title'>
                        <h3>{exp.company}</h3>
                        <p className='title'>{exp.title}</p>
                    </div>
                        <div className='dates-location'>
                            <span className='dates'>
                                {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : ''} - {exp.currentlyWorking ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString() : ''}
                            </span>
                            <div className='location'>{exp.location}</div>
                        </div>
                        <ul className='description'>
                            {exp.description.map((desc, idx) => <li key={idx}>{desc}</li>)}
                        </ul>
                    </div>
                ))}
            </div>
            <div className='section'>
            <h2>Education</h2>
                <div className='education-item'>
                    <div className='uni'>
                        <h3>{userObject.uni}</h3>
                        <p className='title'>{userObject.degree}</p>
                    </div>
                    <div className='grad-details'>
                        <p className='grad-date'>{userObject.gradDate ? new Date(userObject.gradDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}</p>
                        <p className='city'>{userObject.city}</p>
                    </div>
                    <ul className='description'>
                    {userObject.gpaEntries && userObject.gpaEntries.map((gpaEntry, idx) => (
                            <li key={idx}><strong>GPA:</strong> {gpaEntry}</li>
                        ))}
                        {userObject.extracurriculars && userObject.extracurriculars.length > 0 && (
                            <li><strong>Clubs and Extracurriculars:</strong> {userObject.extracurriculars.join(';  ')}</li>
                        )}
                        
                    </ul>
                </div>
            </div>
            <div className='section'>
                <h2>Skills & Courses Taken</h2>
                <ul className='description'>
                    <ul className = "skills-courses"> 

                    {userObject.certifications && userObject.certifications.length > 0 && (
                        <li><strong>Certifications:</strong> {userObject.certifications.join('; ')}</li>
                    )}
                    {userObject.skills && userObject.skills.length > 0 && (
                        <li><strong>Skills:</strong> {userObject.skills.join('; ')}</li>
                    )}
                    {userObject.courses && userObject.courses.length > 0 && (
                        <li><strong>Courses Taken:</strong> {userObject.courses.join('; ')}</li>
                    )}
                    </ul>
                </ul>
            </div>
        </div>
           {/* Warning for overflow */}
           {isOverflowing && (
                <div style={{ color: 'red', marginTop: '10px' }}>
                    Your resume exceeds the one-page limit. Please reduce the content to fit within a single page.
                </div>
            )}
        </div>
    );
});

export default ResumePreview;