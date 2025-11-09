
import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function ProjectCard({ project }){
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="glass rounded-2xl p-4 shadow-soft">
      <div className="flex gap-4">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title} className="w-28 h-28 object-cover rounded-xl" />
        ) : (
          <div className="w-28 h-28 rounded-xl bg-slate-700 grid place-items-center text-slate-300">No Image</div>
        )}
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{project.title}</h3>
          <div className="text-xs text-slate-300 mt-1">Type: {project.projectType}{project.projectType==='Other' && project.customType ? ` (${project.customType})` : ''}</div>
          <p className="text-sm text-slate-300 line-clamp-2 mt-1">{project.description}</p>
          <div className="mt-2 text-xs text-slate-300">Tools: {project.tools?.join(', ')}</div>
          <div className="mt-2 text-xs">
            <span className="px-2 py-1 rounded-lg bg-slate-700/70">Ticket: {project.ticketNo}</span>
            <span className="ml-2 px-2 py-1 rounded-lg bg-slate-700/70">Avg: {project.avgScore?.toFixed(1) || 0} ⭐</span>
          </div>
          <Link to={`/project/${project._id}`} className="inline-block mt-3 text-cyan-300 hover:underline">View Details →</Link>
        </div>
      </div>
    </motion.div>
  )
}
