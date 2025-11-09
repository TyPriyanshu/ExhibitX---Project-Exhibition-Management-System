
import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [err,setErr]=useState('')

  const submit = async (e)=>{
    e.preventDefault()
    setErr('')
    try{
      const { data } = await axios.post(import.meta.env.VITE_API+'/auth/login',{ email,password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('role', data.role)
      localStorage.setItem('name', data.name)
      window.location.href = '/'
    }catch(e){ setErr(e.response?.data?.message || 'Login failed') }
  }

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="h-[85vh] flex justify-center items-center">
      <div className='h-[60vh] w-[35vw] glass p-6 rounded-2xl shadow-soft'>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
      {err && <div className="mb-2 text-red-400 text-sm">{err}</div>}
      <form onSubmit={submit} className="grid gap-3">
        <input className="bg-slate-800 rounded-xl p-3 outline-none" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="bg-slate-800 rounded-xl p-3 outline-none" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="mt-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl p-3">Login</button>
      </form>
      <div className="text-sm mt-3">No account? <a className="text-cyan-300" href="/signup">Signup</a></div>
      </div>
    </motion.div>
  )
}
