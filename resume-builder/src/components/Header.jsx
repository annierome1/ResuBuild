import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({
  userToken,
  username,
  resumeList,
  selectedResume,
  setSelectedResume,
  loadSelectedResume,
  saveToBackend,
  createNewResume,
  handleDeleteResume,
  handleLogout,
  openModal,
  isDropdownOpen,
  setDropdownOpen,
  isSaveAsModalOpen,
  setSaveAsModalOpen,
  newResumeName,
  setNewResumeName,
  handleSaveAsNew,
  modalOverlayStyle,
  modalContentStyle,
  dropdownButtonStyle,
  closeButtonStyle,
}) {
  const navigate = useNavigate();

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "1px solid #ddd",
          paddingBottom: "10px",
          backgroundColor: "#fff"
        }}
      >
        <h1>ResuBuilder</h1>

        <div style={{ position: "relative", marginLeft: "10px" }}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              borderRadius: "8px",
              cursor: "pointer",
              border: "none",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "background 0.3s ease",
              padding: "8px 12px",
            }}
          >
            Actions ▼
          </button>
          {isDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "45px",
                right: 0,
                backgroundColor: "#fff",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                zIndex: 1000,
                padding: "10px",
                width: "200px",
              }}
            >
              <button onClick={() => saveToBackend(userToken)} style={dropdownButtonStyle}>
                Save Progress
              </button>
              <button onClick={createNewResume} style={{ ...dropdownButtonStyle, backgroundColor: "#28a745", color: "#fff" }}>
                New Resume
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  setNewResumeName("");
                  setSaveAsModalOpen(true);
                }}
                style={dropdownButtonStyle}
              >
                Save As New…
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleDeleteResume();
                }}
                style={{ ...dropdownButtonStyle, backgroundColor: "#dc3545", color: "#fff", marginTop: "0.5rem" }}
              >
                Delete Resume
              </button>
              <button onClick={() => navigate("/cover-letter")} style={dropdownButtonStyle}>
                Generate Cover Letter
              </button>
              <button onClick={handleLogout} style={{ ...dropdownButtonStyle, backgroundColor: "#dc3545", color: "#fff" }}>
                Logout
              </button>
              
            </div>
            
          )}
        </div>

        
        

        {userToken ? (
          resumeList.length > 0 ? (
            <div style={{ display: "flex", alignItems: "center", marginLeft: "10px" }}>
              <select
                value={selectedResume}
                onChange={e => setSelectedResume(e.target.value)}
                style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
              >
                <option value="">Select a resume to load</option>
                {resumeList.map(r => (
                  <option key={r._id} value={r.resumeName}>
                    {r.resumeName}
                  </option>
                ))}
              </select>
              <button
                onClick={loadSelectedResume}
                disabled={!selectedResume}
                style={{
                  marginLeft: "10px",
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  cursor: selectedResume ? "pointer" : "not-allowed",
                }}
              >
                Load Resume
              </button>
            </div>
          ) : (
            <span style={{ marginLeft: "10px" }}>No saved resumes</span>
          )
        ) : (
          <button
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: "blue",
              color: "white",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Login / Sign Up
          </button>
        )}

        
        <span style={{ marginRight: "15px" }}>
          {userToken && username ? `Welcome, ${username}!` : "Welcome!"}
        </span>


        {isSaveAsModalOpen && (
  <div style={modalOverlayStyle}>
    <div style={modalContentStyle}>
      <h2>Save As New Resume</h2>
      <input
        type="text"
        placeholder="Enter new resume name"
        value={newResumeName}
        onChange={e => setNewResumeName(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => setSaveAsModalOpen(false)} style={{ marginRight: "10px" }}>
          Cancel
        </button>
        <button onClick={handleSaveAsNew} style={{ backgroundColor: "#28a745", color: "white", padding: "8px 12px", border: "none", borderRadius: "5px" }}>
          Save
        </button>
      </div>
    </div>
  </div>
)}
      </header>

      {/** About Modal **/}
      <div>
        {/* you can also lift this modal into its own component if you'd like */}
      </div>
    </>
  );
}
