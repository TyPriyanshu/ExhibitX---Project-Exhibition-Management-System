
import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NavBar(){
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return (
    <div className="sticky top-0 z-50 shadow-soft">
      <motion.nav initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="glass">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-wide">Exhibit<span className="text-cyan-400">X</span></Link>
          <div className="flex gap-4 text-sm">
            <Link to="/" className="hover:text-cyan-300">Home</Link>
            {(role=='student' || !role) &&
              <Link to="/add" className="hover:text-cyan-300">Add Project</Link>
            }
            <Link to="/leaderboard" className="hover:text-cyan-300">Leaderboard</Link>
            {(role=='judge' || !role) && 
             <Link to="/judge" className="hover:text-cyan-300">Judge</Link>
            }
            {role==='admin' && <Link to="/admin" className="hover:text-cyan-300">Admin</Link>}
            {!token ? (
              <Link to="/login" className="px-3 py-1 rounded-xl bg-cyan-500/90 hover:bg-cyan-400 text-black">Login</Link>
            ) : (
              <button onClick={()=>{ localStorage.clear(); window.location.href='/'; }} className="px-3 py-1 rounded-xl bg-red-500/90 hover:bg-red-400 text-white">Logout {role && `(${role})`}</button>
            )}
          </div>
        </div>
      </motion.nav>
    </div>
  )
}
