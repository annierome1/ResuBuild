import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import ResumeForm from './components/resume';
import PopUp from './components/Contact'; 
import LoginPage from './components/LoginPage';





function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToken, setUserToken] = useState(localStorage.getItem('token') || null);
    const [username, setUsername] = useState(localStorage.getItem('username') || null);
    
    // Handle login and save token
    const handleLogin = (token, username) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        setUserToken(token);
        console.log('User logged in:', token);
    };

    // Handle logout and remove token
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUserToken(null);
        setUsername(null);
    };

    // Open and close modal functions
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ResumeForm
                                userToken={userToken}
                                handleLogout={handleLogout}
                                isModalOpen={isModalOpen}
                                openModal={openModal}
                                closeModal={closeModal}
                            />
                        }
                    />
                    <Route
                        path="/login"
                        element={<LoginPage onLogin={handleLogin} />}
                    />
                </Routes>

                {/* Modal */}
                {isModalOpen && (
                    <PopUp isOpen={isModalOpen} onClose={closeModal} title="About Me">
                        <p>Developed by Annie Rome</p>
                        <p>Sign Up to save your progress, all users are stored in a MongoDB backend with an encrypted password</p>
                        <p>
                            Check out my portfolio here:{" "}
                            <a href="https://www.anniecaroline.com/" target="_blank" rel="noopener noreferrer">
                                My Portfolio
                            </a>
                        </p>
                    </PopUp>
                )}
            </div>
        </Router>

    );
}

export default App;