import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import ResumeForm from './components/resume';
import LoginPage from './components/LoginPage';
import CoverLetterPage from './components/CoverLetterPage';

function App() {
    const [userToken, setUserToken] = useState(localStorage.getItem('token') || null);
    const [username, setUsername] = useState(localStorage.getItem('username') || null);
    const [userObject, setUserObject] = useState({});
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUsername = localStorage.getItem('username');

        if (storedToken) setUserToken(storedToken);
        if (storedUsername) setUsername(storedUsername);
    }, []);
    const handleLogin = (token, username) => {
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);

        setUserToken(token);
        setUsername(username);

        console.log('User logged in:', username);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        setUserToken(null);
        setUsername(null);

        console.log('User logged out');
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
                                username={username} 
                                handleLogout={handleLogout}
                            />
                        }
                    />
                    
                    <Route 
                        path = "/cover-letter"
                        element = {<CoverLetterPage userToken={userToken} username ={username}/>}
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
