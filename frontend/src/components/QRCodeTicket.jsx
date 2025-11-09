
import React from 'react'

export default function QRCodeTicket({ project }){
  if(!project) return null;
  return (
    <div className="glass rounded-2xl p-4">
      <div className="text-lg font-semibold">Confirmation Slip</div>
      <div className="text-sm mt-1">Ticket No: {project.ticketNo}</div>
      <div className="text-sm">Exhibition Date: {project.exhibitionDate}</div>
      <div className="text-sm">Project Type: {project.projectType}{project.projectType==='Other' && project.customType ? ` (${project.customType})` : ''}</div>
      <div className="text-sm">Team Members: {project.teamMembers?.join(', ')}</div>
      <div className="mt-3">
        <img src={project.qrDataUrl} alt="QR" className="w-40 h-40" />
      </div>
    </div>
  )
}
