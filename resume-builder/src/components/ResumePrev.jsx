import React, { useEffect } from 'react';
import './ResumePrev.css';

const ResumePreview = React.forwardRef(({ userObject, isOverflowing, sectionOrder = ['experience', 'projects', 'education', 'skills'] }, ref) => {
    const checkContentOverflow = () => {
        if (!ref?.current) return;
        const resumeContainer = ref.current;
        const containerHeight = resumeContainer.offsetHeight;
        const contentHeight = resumeContainer.scrollHeight;
        console.log({ containerHeight, contentHeight });
    };

    useEffect(() => {
        checkContentOverflow();
    }, [userObject]);

    return (
        <div>
            <div ref={ref} className='resume-container'>
                <div className='header'>
                    <h1>{userObject.firstName} {userObject.lastName}</h1>
                    {userObject.statement && <p className='statement'>{userObject.statement}</p>}
                    <div className='contact'>
                        {[
                            userObject.email,
                            userObject.phone,
                            userObject.website && (
                                <a
                                    href={userObject.website.startsWith("http") ? userObject.website : `https://${userObject.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="website-link"
                                >
                                    {userObject.website}
                                </a>
                            ),
                            userObject.location
                        ]
                            .filter(Boolean)
                            .map((item, i, arr) => (
                                <span key={i}>
                                    {item}{i < arr.length - 1 && <span className="divider"> • </span>}
                                </span>
                            ))}
                    </div>
                </div>

                {sectionOrder.map((sectionKey) => {
                    switch (sectionKey) {
                        case 'experience':
                            return (
                                <div key="experience" className="section">
                                    <h2>Work Experience</h2>
                                    {userObject.experience.map((exp, index) => (
                                        <div key={index} className='experience-item'>
                                            <div className="company-title">
                                                <h3>{exp.company}</h3>
                                                <p className='title'>{exp.title}</p>
                                                <ul className='description'>
                                                    {exp.description.map((desc, idx) => (
                                                        <li key={idx}>{desc}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className='dates-location'>
                                            <span className='dates'>
                                                    {[ 
                                                        exp.startDate && new Date(exp.startDate).toLocaleDateString(),
                                                        exp.currentlyWorking ? 'Present' 
                                                        : exp.endDate && new Date(exp.endDate).toLocaleDateString()
                                                    ]
                                                    .filter(Boolean)
                                                    .join(' - ')
                                                    }
                                                    </span>

                                                <div className='location'>{exp.location}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );

                        case 'projects':
                            return (
                                <div key="projects" className="section">
                                    <h2>Projects & Research</h2>
                                    {userObject.projects.map((project, index) => (
                                        <div key={index} className="project-item">
                                            <div className="project-header">
                                                <h3 className="project-title">{project.title}</h3>
                                                {project.link && (
                                                    <div className="project-link">
                                                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                            View Project
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                            <ul className="project-description">
                                                {Array.isArray(project.description) && project.description.length > 0 ? (
                                                    project.description.map((desc, descIndex) => (
                                                        <li key={descIndex}>{desc}</li>
                                                    ))
                                                ) : (
                                                    <li>No description available</li>
                                                )}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            );

                            case 'education':
                                return (
                                  <div key="education" className="section education-section">
                                    <h2>Education</h2>
                                    <div className="education-item">
                                      {/* Left: University & Degree */}
                                      <div className="edu-left">
                                        <h3>{userObject.uni}</h3>
                                        <p className="degree">{userObject.degree}</p>
                                      </div>
                              
                                      {/* Right: Grad Date & City */}
                                      <div className="edu-right">
                                      <p className="grad-date">
                                            {userObject.gradDate
                                                ? new Date(userObject.gradDate)
                                                    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                                    .replace(/(\w+)\s(\d{4})/, '$1, $2')
                                                : ''}
                                            </p>

                                        <p className="city">{userObject.city}</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              

                        case 'skills':
                            return (
                                <div key="skills" className='skill'>
                                    <h2>Skills & Courses Taken</h2>
                                    <ul className='description'>
                                        <ul className="skills-courses">
                                            {userObject.certifications?.length > 0 && (
                                                <li><strong>Certifications:</strong> {userObject.certifications.join('; ')}</li>
                                            )}
                                            {userObject.skills?.length > 0 && (
                                                <li><strong>Skills:</strong> {userObject.skills.join('; ')}</li>
                                            )}
                                            {userObject.courses?.length > 0 && (
                                                <li><strong>Courses Taken:</strong> {userObject.courses.join('; ')}</li>
                                            )}
                                        </ul>
                                    </ul>
                                </div>
                            );

                        default:
                            return null;
                    }
                })}

                {isOverflowing && (
                    <div style={{ color: 'red', marginTop: '10px' }}>
                        Your resume exceeds the one-page limit. Please reduce the content to fit within a single page.
                    </div>
                )}
            </div>
        </div>
    );
});

export default ResumePreview;
