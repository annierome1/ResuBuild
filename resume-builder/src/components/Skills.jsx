import React from 'react';
import InputItem from './inputitems';

const Step4 = ({ userObject, handleChange, addSkill, addCertification, addCourse, handleSkillChange, handleCertificationChange, handleCourseChange, removeSkill, removeCertification, removeCourse }) => {
    return (
        <div className='step'>
            <h2>Skills & Courses Taken</h2>

            <div className='certifications'>
                <h3>Certifications</h3>
                {userObject.certifications && userObject.certifications.map((cert, index) => (
                    <div key={index} className='certification-item'>
                        <InputItem className='certification' onChange={(e) => handleCertificationChange(index, e.target.value)} label={`Certification ${index + 1}`} placeholder='Enter Certification' name={`certification-${index}`} value={cert} />
                        <button className = 'rbutton' type = 'button' onClick={() => removeCertification(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addCertification}>Add Certification</button>
            </div>

            <div className='skills'>
                <h3>Skills</h3>
                {userObject.skills && userObject.skills.map((skill, index) => (
                    <div key={index} className='skill-item'>
                        <InputItem className='skill' onChange={(e) => handleSkillChange(index, e.target.value)} label={`Skill ${index + 1}`} placeholder='Enter Skill' name={`skill-${index}`} value={skill} />
                        <button className = 'rbutton' type='button' onClick={() => removeSkill(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addSkill}>Add Skill</button>
            </div>

            <div className='courses'>
                <h3>Relevant Courses Taken</h3>
                {userObject.courses && userObject.courses.map((course, index) => (
                    <div key={index} className='course-item'>
                        <InputItem className='course' onChange={(e) => handleCourseChange(index, e.target.value)} label={`Course ${index + 1}`} placeholder='Enter Course' name={`course-${index}`} value={course} />
                        <button className='rbutton' type='button' onClick={() => removeCourse(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addCourse}>Add Course</button>
            </div>
        </div>
    );
};

export default Step4;
