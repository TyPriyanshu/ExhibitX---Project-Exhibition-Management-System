
import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

export default function Signup(){
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [role,setRole]=useState('student')
  const [judgeSecret,setJudgeSecret]=useState('')
  const [msg,setMsg]=useState('')
  const [err,setErr]=useState('')
  const [check,setCheck]=useState(false)
  const [otp, setOtp]=useState('')

  const submit = async (e)=>{
    e.preventDefault()
    setErr(''); setMsg('')
    if(!check){
      try{
        await axios.post(import.meta.env.VITE_API+'/auth/register',{ name,email,role, judgeSecret })
        setMsg('Otp send!')
        setCheck(true)
        }
      catch(e){
        setErr(e.response?.data?.message || 'Signup failed')
      }
    }else{
      try {
        await axios.post(import.meta.env.VITE_API+'/auth/verify-otp', {email,password,otp})
        setMsg('Registered! You can login now.')
        setCheck(true)
      } catch (e) {
        setErr(e.response?.data?.message || 'Signup failed')
      }
    }
  }

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="max-w-md h-screen mx-auto mt-10 ">
      <div className='glass p-6 rounded-2xl shadow-soft'>
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
      {msg && <div className="text-green-400 text-sm mb-2">{msg}</div>}
      {err && <div className="text-red-400 text-sm mb-2">{err}</div>}
      <form onSubmit={submit} className="grid gap-3">
        <input className="bg-slate-800 rounded-xl p-3 outline-none" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="bg-slate-800 rounded-xl p-3 outline-none" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="bg-slate-800 rounded-xl p-3 outline-none" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="bg-slate-800 rounded-xl p-3 outline-none" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="judge">Judge (requires secret)</option>
        </select>
        {role==='judge' && (
          <input className="bg-slate-800 rounded-xl p-3 outline-none" placeholder="Judge Secret Code" value={judgeSecret} onChange={e=>setJudgeSecret(e.target.value)} />
        )}

        {check && 
          <input value={otp} onChange={(e)=> setOtp(e.target.value)} className="bg-slate-800 rounded-xl p-3 outline-none" placeholder='Enter Valid OTP' />
        }
        <button className="mt-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl p-3">Create account</button>
      </form>
      <div className="text-sm mt-3">Already have an account? <a className="text-cyan-300" href="/login">Login</a></div>
      </div>
    </motion.div>
  )
}
