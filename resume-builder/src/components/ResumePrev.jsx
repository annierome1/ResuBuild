import React from 'react';
import './ResumePrev.css';

const ResumePreview = ({ userObject }) => {
    return (
        <div className='resume-preview'>
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
                {userObject.experience && userObject.experience.map((exp, index) => (
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
                        {userObject.extracurriculars && userObject.extracurriculars.map((activity, idx) => (
                            <li key={idx}>{activity}</li>
                        ))}
                        
                    </ul>
                </div>
            </div>
            <div className='section'>
                <h2>Certifications, Skills, & Interests</h2>
                <ul className='description'>
                    {userObject.certifications && userObject.certifications.length > 0 && (
                        <li><strong>Certifications:</strong> {userObject.certifications.join('; ')}</li>
                    )}
                    {userObject.skills && userObject.skills.length > 0 && (
                        <li><strong>Skills:</strong> {userObject.skills.join('; ')}</li>
                    )}
                    {userObject.interests && userObject.interests.length > 0 && (
                        <li><strong>Interests:</strong> {userObject.interests.join('; ')}</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ResumePreview;