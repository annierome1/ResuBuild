import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ResumeForm from './components/resume';



function App() {
  return (
      <Router>
          <div className='App'>
              <Routes>
                  <Route path='/' element={<ResumeForm />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
