import React from 'react';
import InputItem from './inputitems';

const Step4 = ({ userObject, handleChange, addSkill, addCertification, addTool, addFramework, addDatabase, addDevOps, addOS, addSoftSkill, addProgrammingLanguage, handleSkillChange, handleCertificationChange, handleToolChange, handleFrameworkChange, handleDatabaseChange, handleDevOpsChange, handleOSChange, handleSoftSkillChange, handleProgrammingLanguageChange, removeSkill, removeCertification, removeTool, removeFramework, removeDatabase, removeDevOps, removeOS, removeSoftSkill, removeProgrammingLanguage }) => {
    return (
        <div className='step'>
            <h2>Skills</h2>

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
                <h3>General Skills</h3>
                {userObject.skills && userObject.skills.map((skill, index) => (
                    <div key={index} className='skill-item'>
                        <InputItem className='skill' onChange={(e) => handleSkillChange(index, e.target.value)} label={`Skill ${index + 1}`} placeholder='e.g., Problem Solving, Team Work' name={`skill-${index}`} value={skill} />
                        <button className = 'rbutton' type='button' onClick={() => removeSkill(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addSkill}>Add Skill</button>
            </div>

            <div className='programming-languages'>
                <h3>Programming Languages</h3>
                {userObject.programmingLanguages && userObject.programmingLanguages.map((skill, index) => (
                    <div key={index} className='skill-item'>
                        <InputItem className='skill' onChange={(e) => handleProgrammingLanguageChange(index, e.target.value)} label={`Language ${index + 1}`} placeholder='e.g., Python, JavaScript, Java' name={`programmingLanguage-${index}`} value={skill} />
                        <button className = 'rbutton' type='button' onClick={() => removeProgrammingLanguage(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addProgrammingLanguage}>Add Programming Language</button>
            </div>

            <div className='frameworks'>
                <h3>Frameworks & Libraries</h3>
                {userObject.frameworks && userObject.frameworks.map((framework, index) => (
                    <div key={index} className='framework-item'>
                        <InputItem className='framework' onChange={(e) => handleFrameworkChange(index, e.target.value)} label={`Framework ${index + 1}`} placeholder='e.g., React, Node.js, Django' name={`framework-${index}`} value={framework} />
                        <button className = 'rbutton' type='button' onClick={() => removeFramework(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addFramework}>Add Framework</button>
            </div>

            <div className='databases'>
                <h3>Databases</h3>
                {userObject.databases && userObject.databases.map((database, index) => (
                    <div key={index} className='database-item'>
                        <InputItem className='database' onChange={(e) => handleDatabaseChange(index, e.target.value)} label={`Database ${index + 1}`} placeholder='e.g., PostgreSQL, MongoDB, MySQL' name={`database-${index}`} value={database} />
                        <button className = 'rbutton' type='button' onClick={() => removeDatabase(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addDatabase}>Add Database</button>
            </div>

            <div className='devops'>
                <h3>DevOps & Cloud</h3>
                {userObject.devops && userObject.devops.map((devops, index) => (
                    <div key={index} className='devops-item'>
                        <InputItem className='devops' onChange={(e) => handleDevOpsChange(index, e.target.value)} label={`DevOps Tool ${index + 1}`} placeholder='e.g., Docker, AWS, Kubernetes' name={`devops-${index}`} value={devops} />
                        <button className = 'rbutton' type='button' onClick={() => removeDevOps(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addDevOps}>Add DevOps Tool</button>
            </div>

            <div className='tools'>
                <h3>Tools & Technologies</h3>
                {userObject.tools && userObject.tools.map((tool, index) => (
                    <div key={index} className='tool-item'>
                        <InputItem className='tool' onChange={(e) => handleToolChange(index, e.target.value)} label={`Tool ${index + 1}`} placeholder='e.g., Git, VS Code, Jira' name={`tool-${index}`} value={tool} />
                        <button className='rbutton' type='button' onClick={() => removeTool(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addTool}>Add Tool</button>
            </div>

            <div className='operating-systems'>
                <h3>Operating Systems</h3>
                {userObject.operatingSystems && userObject.operatingSystems.map((os, index) => (
                    <div key={index} className='os-item'>
                        <InputItem className='os' onChange={(e) => handleOSChange(index, e.target.value)} label={`OS ${index + 1}`} placeholder='e.g., Linux, Windows, macOS' name={`os-${index}`} value={os} />
                        <button className = 'rbutton' type='button' onClick={() => removeOS(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addOS}>Add Operating System</button>
            </div>

            <div className='soft-skills'>
                <h3>Soft Skills</h3>
                {userObject.softSkills && userObject.softSkills.map((skill, index) => (
                    <div key={index} className='soft-skill-item'>
                        <InputItem className='soft-skill' onChange={(e) => handleSoftSkillChange(index, e.target.value)} label={`Soft Skill ${index + 1}`} placeholder='e.g., Leadership, Problem Solving, Communication' name={`softSkill-${index}`} value={skill} />
                        <button className = 'rbutton' type='button' onClick={() => removeSoftSkill(index)}>Remove</button>
                    </div>
                ))}
                <button type='button' onClick={addSoftSkill}>Add Soft Skill</button>
            </div>
        </div>
    );
};

export default Step4;
