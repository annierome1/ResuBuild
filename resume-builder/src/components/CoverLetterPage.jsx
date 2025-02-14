import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CoverLetterPage = ({ userToken, username }) => {
    const [jobDescription, setJobDescription] = useState("");
    const [coverLetter, setCoverLetter] = useState("");
    const [resumeList, setResumeList] = useState([]);
    const [selectedResume, setSelectedResume] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        
        const fetchResumeList = async () => {
            if (!userToken || !username) return;
            try {
                const response = await fetch(`/api/resume/list?username=${username}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${userToken}` },
                });

                const data = await response.json();
                if (response.ok && Array.isArray(data)) {
                    setResumeList(data);
                } else {
                    setResumeList([]);
                }
            } catch (error) {
                console.error("Error fetching resumes:", error);
            }
        };

        fetchResumeList();
    }, [userToken, username]);

    const fetchResumeData = async () => {
        if (!selectedResume) {
            alert("Please select a resume.");
            return;
        }

        try {
            const response = await fetch(`/api/resume/load?username=${username}&resumeName=${selectedResume}`, {
                method: "GET",
                headers: { Authorization: `Bearer ${userToken}` },
            });

            const data = await response.json();
            if (response.ok) {
                generateCoverLetter(data.userObject);
            } else {
                console.error("Failed to retrieve resume.");
            }
        } catch (error) {
            console.error("Error fetching resume:", error);
        }
    };


    const generateCoverLetter = async (resumeData) => {
        if (!jobDescription) {
            alert("Please enter a job description.");
            return;
        }

        

        try {
            const response = await fetch("/api/generate-cover-letter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userToken}`,
                },
                body: JSON.stringify({ resumeData, jobDescription }),
            });

            if (response.ok) {
                const data = await response.json();
                setCoverLetter(data.coverLetter);
            } else {
                alert("Failed to generate cover letter.");
            }
        } catch (error) {
            console.error("Error generating cover letter:", error);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Generate Cover Letter</h1>

            {/* Resume Selection */}
            
            <select 
                value={selectedResume} 
                onChange={(e) => setSelectedResume(e.target.value)}
            >
                <option value="">-- Choose a Resume --</option>
                {resumeList.map((resume) => (
                    <option key={resume._id} value={resume.resumeName}>
                        {resume.resumeName}
                    </option>
                ))}
            </select>

            <button onClick={fetchResumeData} style={{ marginLeft: "10px" }}>
                Use This Resume
            </button>

            <button onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
                Back to Resume
            </button>

            {/* Job Description Input */}
            <textarea
                placeholder="Enter job description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows="5"
                style={{ width: "100%", marginTop: "10px" }}
            ></textarea>

            <button onClick={fetchResumeData} style={{ marginTop: "10px" }}>
                Generate Cover Letter
            </button>

            {/* Display Generated Cover Letter */}
            {coverLetter && (
                <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd", textAlign: "left" }}>
                    <h2>Your Cover Letter:</h2>
                    {coverLetter.split("\n").map((paragraph, index) => (
                        paragraph.trim() !== "" && <p key={index} style={{ marginBottom: "10px", lineHeight: "1.5" }}>{paragraph}</p>
                    ))}
                </div>
            )}

        </div>
    );
};

export default CoverLetterPage;