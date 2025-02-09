import React from "react";
import InputItem from "./inputitems"; // Adjust path if necessary

const Step5 = ({ userObject, handleProjectChange, handleProjectDescriptionChange, addProject, removeProject, addProjectDescription, removeProjectDescription }) => {
    return (
        <div>
            <h2>Projects</h2>
            {userObject.projects.map((project, index) => (
                <div key={index} className="project-item">
                    <InputItem
                        type="text"
                        placeholder="Project Title"
                        value={project.title}
                        onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                    />
                    <InputItem
                        type="text"
                        placeholder="Project Link (Optional)"
                        value={project.link}
                        onChange={(e) => handleProjectChange(index, "link", e.target.value)}
                    />

                    <h3>Description</h3>
                    {Array.isArray(project.description) ? (
                        project.description.map((desc, descIndex) => (
                            <div key={descIndex} className="description-item">
                                <InputItem
                                    type="text"
                                    placeholder="Description Bullet Point"
                                    value={desc}
                                    onChange={(e) => handleProjectDescriptionChange(index, descIndex, e.target.value)}
                                />
                                <button onClick={() => removeProjectDescription(index, descIndex)}>Remove</button>
                            </div>
                        ))
                    ) : (
                        <p>No descriptions available</p>
                    )}

                    <button onClick={() => addProjectDescription(index)}>Add Bullet Point</button>
                    <button onClick={() => removeProject(index)}>Remove Project</button>
                </div>
            ))}
            <button onClick={addProject}>Add Project</button>
        </div>
    );
};

export default Step5;
