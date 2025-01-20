import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import ResumeForm from './components/resume';
import LoginPage from './components/LoginPage';

function App() {
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
                            />
                        }
                    />
                    <Route
                        path="/login"
                        element={<LoginPage onLogin={handleLogin} />}
                    />
                </Routes>
            
            </div>
        </Router>

    );
}

export default App;