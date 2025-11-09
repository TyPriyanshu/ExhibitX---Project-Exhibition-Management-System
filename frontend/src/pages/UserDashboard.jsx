
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import ProjectCard from '../components/ProjectCard.jsx'

export default function UserDashboard(){
  const [projects, setProjects] = useState([])
  const [type, setType] = useState('')

  useEffect(()=>{
    (async()=>{
      const url = new URL(import.meta.env.VITE_API+'/projects')
      if(type) url.searchParams.set('type', type)
      const { data } = await axios.get(url.toString())
      setProjects(data)
    })()
  },[type])

  return (
    <div className="min-h-screen mt-6">
      <motion.h1 initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} className="text-3xl font-bold mb-4">
        Explore Projects
      </motion.h1>
      <div className="mb-4">
        <select value={type} onChange={e=>setType(e.target.value)} className="bg-slate-800 rounded-xl p-2 outline-none">
          <option value="">All Types</option>
          <option>Web</option>
          <option>ML</option>
          <option>Data Science</option>
          <option>IoT</option>
          <option>Other</option>
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {projects.map(p => <ProjectCard key={p._id} project={p} />)}
      </div>
    </div>
  )
}
