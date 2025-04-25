import React, { useEffect } from 'react';
import './ResumePrev.css';

const ResumePreview = React.forwardRef((
  { userObject = {}, isOverflowing, sectionOrder = ['experience','projects','education','skills'] },
  ref
) => {
  // Ensure these are always arrays
  const experiences = Array.isArray(userObject.experience) ? userObject.experience : [];
  const projects    = Array.isArray(userObject.projects)   ? userObject.projects   : [];

  // Overflow check (unchanged)
  const checkContentOverflow = () => {
    if (!ref?.current) return;
    const resumeContainer = ref.current;
    console.log({
      containerHeight: resumeContainer.offsetHeight,
      contentHeight:   resumeContainer.scrollHeight
    });
  };

  useEffect(checkContentOverflow, [userObject]);

  return (
    <div>
      <div ref={ref} className='resume-container'>
        {/* Header */}
        <div className='header'>
          <h1>{userObject.firstName} {userObject.lastName}</h1>
          {userObject.statement && <p className='statement'>{userObject.statement}</p>}
          <div className='contact'>
            {[
              userObject.email,
              userObject.phone,
              userObject.website && (
                <a
                  href={userObject.website.startsWith('http')
                    ? userObject.website
                    : `https://${userObject.website}`
                  }
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
              ))
            }
          </div>
        </div>

        {/* Dynamically render each section in the desired order */}
        {sectionOrder.map(sectionKey => {
          switch (sectionKey) {

            case 'experience':
              return (
                <div key="experience" className="section">
                  <h2>Work Experience</h2>
                  {experiences.map((exp, idx) => (
                    <div key={idx} className='experience-item'>
                      <div className="company-title">
                        <h3>{exp.company}</h3>
                        <p className='title'>{exp.title}</p>
                        <ul className='description'>
                          {(exp.description || []).map((desc, i2) => (
                            <li key={i2}>{desc}</li>
                          ))}
                        </ul>
                      </div>
                      <div className='dates-location'>
                        <span className='dates'>
                          {[
                            exp.startDate && new Date(exp.startDate).toLocaleDateString(),
                            exp.currentlyWorking
                              ? 'Present'
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
                  {projects.map((project, idx) => (
                    <div key={idx} className="project-item">
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
                        {(project.description || []).length > 0
                          ? (project.description || []).map((d, i2) => <li key={i2}>{d}</li>)
                          : <li>No description available</li>
                        }
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
                    <div className="edu-left">
                      <h3>{userObject.uni}</h3>
                      <p className="degree">{userObject.degree}</p>
                    </div>
                    <div className="edu-right">
                      {userObject.gradDate && (
                        <p className="grad-date">
                          {new Date(userObject.gradDate)
                            .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                            .replace(/(\w+)\s(\d{4})/, '$1, $2')}
                        </p>
                      )}
                      {userObject.city && <p className="city">{userObject.city}</p>}
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

        {/* Overflow warning */}
        {isOverflowing && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            Your resume exceeds the one-page limit. Please reduce the content.
          </div>
        )}
      </div>
    </div>
  );
});

export default ResumePreview;
