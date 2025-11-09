
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function JudgeDashboard(){
  const [projects, setProjects] = useState([])
  const [err, setErr] = useState('')

  useEffect(()=>{
    (async()=>{
      try{
        const { data } = await axios.get(import.meta.env.VITE_API+'/projects')
        setProjects(data)
      }catch(e){ setErr('Failed to load') }
    })()
  },[])

  return (
    <div className="mt-6 min-h-screen">
      <motion.h1 initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} className="text-3xl font-bold mb-4">
        Judge Panel
      </motion.h1>
      {err && <div className="text-red-400">{err}</div>}
      <div className="grid gap-4">
        {projects.map(p => (
          <div key={p._id} className="glass rounded-2xl p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{p.title}</div>
              <div className="text-xs text-slate-300">Type: {p.projectType}{p.projectType==='Other' && p.customType ? ` (${p.customType})` : ''}</div>
              <div className="text-xs text-slate-300">Ticket: {p.ticketNo} • Avg: {p.avgScore?.toFixed(1) || 0} ⭐</div>
            </div>
            <Link to={`/project/${p._id}`} className="px-3 py-1 rounded-xl bg-cyan-500/90 hover:bg-cyan-400 text-black">Score</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
