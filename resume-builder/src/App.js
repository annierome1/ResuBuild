import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResumeForm from './components/resume';
import PopUp from './components/Contact'; // Assuming you created Modal in components folder

function App() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Open and close modal functions
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <Router>
            <div className='App'>
                {/* Button to trigger the "About Me" modal */}
                <button onClick={openModal} style={{ margin: '20px' }}>
                    About Me
                </button>

                {/* Routes for your app */}
                <Routes>
                    <Route path='/' element={<ResumeForm />} />
                </Routes>

                {/* "About Me" Modal */}
                <PopUp isOpen={isModalOpen} onClose={closeModal} title="About Me">
                    <p>Developed by Annie Rome</p>
                    <p>
                        Check out my portfolio here:{" "}
                        <a href="https://portfolio1-yksj.vercel.app/" target="_blank" rel="noopener noreferrer">
                            My Portfolio
                        </a>
                    </p>
                </PopUp>
            </div>
        </Router>
    );
}

export default App;
