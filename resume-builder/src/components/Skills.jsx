import React from 'react';
import InputItem from './inputitems';

const Step4 = ({ userObject, handleChange, addSkill, addCertification, addInterest, handleSkillChange, handleCertificationChange, handleInterestChange, removeSkill, removeCertification, removeInterest }) => {
    return (
        <div className='step'>
            <h2>Certifications, Skills, & Interests</h2>

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

            <div className='interests'>
                <h3>Interests</h3>
                {userObject.interests && userObject.interests.map((interest, index) => (
                    <div key={index} className='interest-item'>
                        <InputItem className='interest' onChange={(e) => handleInterestChange(index, e.target.value)} label={`Interest ${index + 1}`} placeholder='Enter Interest' name={`interest-${index}`} value={interest} />
                        <button className='rbutton' type='button' onClick={() => removeInterest(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addInterest}>Add Interest</button>
            </div>
        </div>
    );
};

export default Step4;
