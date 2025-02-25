import React, { useState } from "react";
import "./header.css";

const Header = ({ username, handleLogout, navigate, saveToBackend, resumeList, selectedResume, setSelectedResume, loadSelectedResume, fetchResumeList }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <header style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 20px",
            borderBottom: "2px solid #ddd",
            backgroundColor: "#fff",
            boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
        }}>
            <h1 style={{ margin: 0 }}>Resume Builder</h1>

            {/* Buttons Container */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <button onClick={() => navigate("/cover-letter")} className="nav-btn">
                    Generate Cover Letter
                </button>
                <button onClick={saveToBackend} className="nav-btn">
                    Save Progress
                </button>
                <button onClick={() => setSelectedResume("")} className="nav-btn">
                    ➕ New Resume
                </button>

                {/* Resume Selection */}
                <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <select 
                    className="border px-3 py-2 rounded-md"
                    value={selectedResume}
                    onChange={(e) => setSelectedResume(e.target.value)}
                >
                    <option value="">Select a resume</option>
                    {/* Resume List from Backend */}
                    {fetchResumeList.map((resume) => (
                        <option key={resume._id} value={resume.resumeName}>{resume.resumeName}</option>
                    ))}
                </select>
                    <button onClick={loadSelectedResume} className="nav-btn">Load</button>
                </div>

                {/* Profile Dropdown */}
                <div className="profile-dropdown">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="profile-btn">
                        👤 {username || "Guest"}
                    </button>
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <button onClick={handleLogout}>Logout</button>
                            
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
