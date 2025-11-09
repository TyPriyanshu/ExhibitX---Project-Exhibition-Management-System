
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import AddProject from './pages/AddProject.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import JudgeDashboard from './pages/JudgeDashboard.jsx'
import ProjectDetail from './pages/ProjectDetail.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import AdminSettings from './pages/AdminSettings.jsx'
import NavBar from './components/NavBar.jsx'

const isAuthed = () => !!localStorage.getItem('token');
const role = () => localStorage.getItem('role') || '';

const Protected = ({ children, allow=[] }) => {
  if (!isAuthed()) return <Navigate to="/login" />;
  if (allow.length && !allow.includes(role())) return <Navigate to="/" />;
  return children;
};

function App(){
  return (
    <BrowserRouter>
      <NavBar />
      <div className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<UserDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/add" element={<Protected allow={['student','admin']}><AddProject /></Protected>} />
          <Route path="/judge" element={<Protected allow={['judge','admin']}><JudgeDashboard /></Protected>} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/admin" element={<Protected allow={['admin']}><AdminSettings /></Protected>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
