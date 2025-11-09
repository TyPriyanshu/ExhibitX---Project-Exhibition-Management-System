import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import jsPDF from 'jspdf'

export default function AddProject() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [tools, setTools] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [projectType, setProjectType] = useState('Web')
  const [customType, setCustomType] = useState('')
  const [teamMembers, setTeamMembers] = useState([''])
  const [project, setProject] = useState(null)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [githubUrl, setGithubUrl] = useState('')

  const addMember = () => setTeamMembers([...teamMembers, ''])
  const changeMember = (i, val) => {
    const next = [...teamMembers]
    next[i] = val
    setTeamMembers(next)
  }

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const { data } = await axios.post(
        import.meta.env.VITE_API + '/projects',
        {
          title,
          description,
          tools: tools
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          imageUrl,
          projectType,
          customType,
          teamMembers: teamMembers.map((m) => m.trim()).filter(Boolean),
          githubUrl
        },
        {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        }
      )
      setProject(data)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      console.error(e)
      setErr(e.response?.data?.message || e.message || 'Failed')
    } finally {
      setLoading(false)
    }
  }

  const downloadSlip = async () => {
    if (!project) return

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    let y = 60

    // Title
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Project Confirmation Slip', pageWidth / 2, y, { align: 'center' })

    y += 40

    // Project details
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Project Title: ${project.title}`, 60, y); y += 20
    pdf.text(
      `Project Type: ${project.projectType}${
        project.projectType === 'Other' && project.customType
          ? ` (${project.customType})`
          : ''
      }`,
      60,
      y
    ); y += 20
    pdf.text(`Ticket No: ${project.ticketNo}`, 60, y); y += 20
    pdf.text(`Exhibition Date: ${project.exhibitionDate}`, 60, y); y += 20
    pdf.text(`Github URL: ${project.githubUrl}`, 60, y); y += 20
    pdf.text(`Team Members: ${project.teamMembers?.join(', ')}`, 60, y); y += 40

    // Add QR code
    if (project.qrDataUrl) {
      pdf.text('QR Code:', 60, y)
      pdf.addImage(project.qrDataUrl, 'PNG', 60, y + 10, 120, 120)
    }

    // Add screenshot
    if (project.imageUrl) {
      pdf.text('Project Screenshot:', 220, y)
      pdf.addImage(project.imageUrl, 'PNG', 220, y + 10, 250, 180)
    }

    // Save PDF
    pdf.save(`Confirmation_${project.ticketNo}.pdf`)
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 gap-6 mt-6">
      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-2xl shadow-soft"
      >
        <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
        {err && <div className="text-red-400 text-sm mb-2">{err}</div>}
        <form onSubmit={submit} className="grid gap-3">
          <input
            className="bg-slate-800 rounded-xl p-3 outline-none"
            placeholder="Project Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            rows="5"
            className="bg-slate-800 rounded-xl p-3 outline-none"
            placeholder="Project Explanation"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="bg-slate-800 rounded-xl p-3 outline-none"
            placeholder="Tools (comma separated)"
            value={tools}
            onChange={(e) => setTools(e.target.value)}
          />
          <select
            className="bg-slate-800 rounded-xl p-3 outline-none"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
          >
            <option>Web</option>
            <option>ML</option>
            <option>Data Science</option>
            <option>IoT</option>
            <option>Other</option>
          </select>
          {projectType === 'Other' && (
            <input
              className="bg-slate-800 rounded-xl p-3 outline-none"
              placeholder="Custom Project Type"
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
            />
          )}
          <div className="bg-slate-800 rounded-xl p-3">
            <div className="font-semibold mb-2">Team Members</div>
            {teamMembers.map((m, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  className="flex-1 bg-slate-700 rounded-lg p-2 outline-none"
                  placeholder={`Member ${i + 1} Name`}
                  value={m}
                  onChange={(e) => changeMember(i, e.target.value)}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addMember}
              className="mt-1 text-sm text-cyan-300"
            >
              + Add member
            </button>
          </div>
          <input
            className="bg-slate-800 rounded-xl p-3 outline-none"
            placeholder="Github repository url"
            type='text'
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />
          <input
            className="bg-slate-800 rounded-xl p-3 outline-none"
            placeholder="Screenshot/Image URL"
            type='text'
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <button
            disabled={loading}
            className="mt-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl p-3"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </motion.div>

      {/* Confirmation Slip Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {project && (
          <div id="confirmation-slip" className="glass rounded-2xl p-6">
            <div className="text-2xl font-bold">Confirmation Slip</div>
            <div className="mt-2">
              Project: <b>{project.title}</b>
            </div>
            <div className="text-sm">
              Type: {project.projectType}
              {project.projectType === 'Other' && project.customType
                ? ` (${project.customType})`
                : ''}
            </div>
            <div className="text-sm">Ticket: {project.ticketNo}</div>
            <div className="text-sm">Exhibition Date: {project.exhibitionDate}</div>
            <div className="text-sm">
              Team: {project.teamMembers?.join(', ')}
            </div>
            <div className="mt-3">
              <img src={project.qrDataUrl} className="w-40 h-40" />
            </div>
            <button
              onClick={downloadSlip}
              className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl p-3"
            >
              Download Confirmation PDF
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
