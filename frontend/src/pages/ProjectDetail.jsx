import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function ProjectDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchErr, setFetchErr] = useState("");
  const reportRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          import.meta.env.VITE_API + "/projects/" + id
        );
        setP(data);
      } catch (e) {
        setFetchErr(e.response?.data?.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function compareProject(title, description, tools, projectType) {
    const res = await axios.post(import.meta.env.VITE_API_FASTAPI + "/compare", {
      title,
      description,
      tools,
      projectType
    });
    alert("Comparison Result: " + res.data.result + "% similarity");
  }

  // const submitScore = async () => {
  //   setErr("");
  //   setMsg("");
  //   if (score === "" || isNaN(score) || score < 0 || score > 10) {
  //     setErr("Please enter a valid score between 0 and 10.");
  //     return;
  //   }
  //   if (!feedback.trim()) {
  //     setErr("Please provide feedback.");
  //     return;
  //   }
  //   try {
  //     await axios.post(
  //       import.meta.env.VITE_API + "/scores/" + id,
  //       { score: Number(score), feedback },
  //       {
  //         headers: { Authorization: "Bearer " + localStorage.getItem("token") },
  //       }
  //     );
  //     setMsg("Score submitted! Refresh to see updated average.");
  //     setScore("");
  //     setFeedback("");
  //   } catch (e) {
  //     setErr(e.response?.data?.message || "Error");
  //   }
  // };

  const downloadReport = async () => {
    if (!reportRef.current) return;

    // Show report before capturing
    reportRef.current.style.display = "block";

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
      });

      const img = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 40; // margin
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 20;

      pdf.addImage(img, "PNG", 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight + 20;
        pdf.addImage(img, "PNG", 20, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Footer
      pdf.setFontSize(10);
      pdf.text("© Exhibition Committee", pageWidth / 2, pageHeight - 20, {
        align: "center",
      });

      pdf.save(`Project_Report_${p.ticketNo}.pdf`);
    } finally {
      // Hide again after capture
      reportRef.current.style.display = "none";
    }
  };

  if (loading) return <div className="mt-6">Loading...</div>;
  if (fetchErr) return <div className="mt-6 text-red-400">{fetchErr}</div>;
  if (!p) return null;

  return (
    <div className="h-screen mt-6">
      {/* Left panel - Project details */}
      <div className="glass rounded-2xl p-5 flex justify-evenly items-center">
        <div>
          <h2 className="text-2xl font-bold">{p.title}</h2>
        <div className="mt-2 text-sm text-slate-300">Ticket: {p.ticketNo}</div>
        <div className="text-sm text-slate-300">
          Exhibition: {p.exhibitionDate}
        </div>
        <div className="text-sm text-slate-300">
          Type: {p.projectType}
          {p.projectType === "Other" && p.customType
            ? ` (${p.customType})`
            : ""}
        </div>
        <div className="mt-2">
          Avg Score: <b>{p.avgScore?.toFixed(1) || 0}</b> ⭐ ({p.scoresCount}{" "}
          votes)
        </div>
        <div className="mt-3">{p.description}</div>
        <div className="mt-3 text-sm text-slate-300">
          Tools: {p.tools?.join(", ")}
        </div>
        <div className="mt-3 text-sm text-slate-300">
          Github: {p.githubUrl}
        </div>
        <div className="mt-4">
          <img
            src={p.imageUrl || "/placeholder.png"}
            alt="Project"
            className="rounded-xl max-h-80 object-cover"
            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          />
        </div>
        </div>

        <div>
          <img src={p.qrDataUrl} alt="QR" className="w-80 h-80 rounded-xl" />
        </div>
        
      </div>
      <div className="mt-5 flex gap-5 glass p-4 rounded-xl">
          <button
            onClick={downloadReport}
            className="bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl p-3 w-full"
          >
            Download Project Report (PDF)
          </button>

          <button
            onClick={()=> compareProject(p.title, p.description, p.tools, p.projectType)}
            className="bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl p-3 w-full"
          >
            Compare
          </button>
        </div>

      {/* Right panel - Judge scoring */}
      {/* <div className="glass rounded-2xl p-5">
        <h3 className="text-xl font-semibold mb-2">Judge Scoring</h3>
        <label className="block text-sm font-medium">Score (0-10)</label>
        <input
          type="number"
          min="0"
          max="10"
          className="bg-slate-800 rounded-xl p-3 outline-none w-full"
          placeholder="Score (0-10)"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        />
        <label className="block text-sm font-medium mt-3">Feedback</label>
        <textarea
          rows="5"
          className="bg-slate-800 rounded-xl p-3 outline-none w-full mt-1"
          placeholder="Feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <button
          onClick={submitScore}
          className="mt-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl p-3 w-full"
        >
          Submit Score
        </button>
        {msg && <div className="text-green-400 text-sm mt-2">{msg}</div>}
        {err && <div className="text-red-400 text-sm mt-2">{err}</div>}

        <div className="mt-5">
          <button
            onClick={downloadReport}
            className="bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl p-3 w-full"
          >
            Download Project Report (PDF)
          </button>
        </div>
      </div> */}

      {/* Hidden report DOM for PDF */}
      <div style={{ display: "none" }} ref={reportRef}>
        <div
          style={{
            width: "800px",
            padding: "30px",
            background: "#fff",
            color: "#000",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
            Exhibition Project Report
          </h1>
          <p>
            <b>Date Generated:</b> {new Date().toLocaleDateString()}
          </p>
          <hr style={{ margin: "15px 0" }} />

          <h2 style={{ marginTop: "10px" }}>{p.title}</h2>
          <p>
            <b>Ticket:</b> {p.ticketNo}
          </p>
          <p>
            <b>Exhibition Date:</b> {p.exhibitionDate}
          </p>
          <p>
            <b>Type:</b> {p.projectType}
            {p.projectType === "Other" && p.customType
              ? ` (${p.customType})`
              : ""}
          </p>
          <p>
            <b>Team Members:</b> {p.teamMembers?.join(", ")}
          </p>
          <p>
            <b>Tools:</b> {p.tools?.join(", ")}
          </p>

          <div style={{ margin: "15px 0" }}>
            <b>Description:</b>
            <p style={{ marginTop: "5px", lineHeight: "1.5" }}>{p.description}</p>
          </div>

          <p>
            <b>Average Score:</b> {p.avgScore?.toFixed(1) || 0} ⭐ (
            {p.scoresCount} votes)
          </p>

          <div style={{ marginTop: "15px" }}>
            <b>Judge Scores:</b>
            <ul style={{ marginTop: "5px" }}>
              {p.scores?.map((s, i) => (
                <li key={i} style={{ marginBottom: "6px" }}>
                  <b>{s.judgeName}</b>: {s.score} / 10
                  <br />
                  <span style={{ fontStyle: "italic" }}>“{s.feedback}”</span>
                </li>
              ))}
            </ul>
          </div>

          {p.imageUrl && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <img
                src={p.imageUrl}
                alt="Project"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  borderRadius: "10px",
                }}
              />
            </div>
          )}

          <footer
            style={{
              marginTop: "40px",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            © Exhibition Committee
          </footer>
        </div>
      </div>
    </div>
  );
}
