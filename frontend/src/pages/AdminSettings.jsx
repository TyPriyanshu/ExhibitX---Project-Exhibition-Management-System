
import React, { useState } from 'react'
import axios from 'axios'

export default function AdminSettings(){
  const [date,setDate] = useState('')
  const [msg,setMsg] = useState('')
  const [err,setErr] = useState('')

  const save = async ()=>{
    setErr(''); setMsg('')
    try{
      const { data } = await axios.post(import.meta.env.VITE_API+'/admin/set-exhibition-date', { exhibitionDate: date }, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
      setMsg('Saved: ' + data.exhibitionDate + '. New projects will use this date.')
    }catch(e){ setErr(e.response?.data?.message || 'Error') }
  }

  return (
    <div className="mt-6 glass rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-3">Admin Settings</h1>
      <label className="block text-sm mb-2">Set Exhibition Date</label>
      <input type="date" className="bg-slate-800 rounded-xl p-3 outline-none" value={date} onChange={e=>setDate(e.target.value)} />
      <button onClick={save} className="ml-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl p-3">Save</button>
      {msg && <div className="text-green-400 mt-2 text-sm">{msg}</div>}
      {err && <div className="text-red-400 mt-2 text-sm">{err}</div>}
      <p className="text-xs text-slate-300 mt-3">Note: Judges cannot score a project until its exhibition date.</p>
    </div>
  )
}
