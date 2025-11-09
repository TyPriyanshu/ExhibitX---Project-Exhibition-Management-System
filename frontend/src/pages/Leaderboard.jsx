
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Leaderboard(){
  const [projects, setProjects] = useState([])

  useEffect(()=>{
    (async()=>{
      const { data } = await axios.get(import.meta.env.VITE_API+'/projects')
      setProjects(data.sort((a,b)=> (b.avgScore||0) - (a.avgScore||0)))
    })()
  },[])

  return (
    <div className="mt-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <div className="grid gap-3">
        {projects.map((p,idx)=>(
          <div key={p._id} className="glass rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 grid place-items-center">{idx+1}</div>
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-xs text-slate-300">Ticket: {p.ticketNo} • Votes: {p.scoresCount}</div>
              </div>
            </div>
            <div className="text-lg font-bold">{(p.avgScore||0).toFixed(1)} ⭐</div>
          </div>
        ))}
      </div>
    </div>
  )
}
