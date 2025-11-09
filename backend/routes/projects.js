
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect(['student','admin']), async (req, res) => {
  try {
    const { title, description, tools, imageUrl, projectType, customType, teamMembers, githubUrl } = req.body;
    const ticketNo = 'TKT-' + uuidv4().split('-')[0].toUpperCase();
    const exhibitionDate = process.env.EXHIBITION_DATE || '2025-12-15';
    const payload = { ticketNo, title, exhibitionDate };
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(payload));

    const project = await Project.create({
      title, description, tools, imageUrl,
      studentId: req.user.id, studentName: req.user.name,
      ticketNo, qrDataUrl, exhibitionDate,
      projectType, customType, teamMembers, githubUrl
    });

    res.json(project);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const q = type ? { projectType: type } : {};
    const projects = await Project.find(q).sort({ createdAt: -1 });
    res.json(projects);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/getUrls', async (req, res) => {
  try {
    const data = await Project.find();

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No URLs found" });
    }

    const urls = data.map(proj => proj.githubUrl);

    return res.status(200).json({ urls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/getDetails', async (req, res) => {
  try {
    const data = await Project.find();

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const details = data.map(proj => ({
      title: proj.title,
      description: proj.description,
      tools: proj.tools,
      projectType: proj.projectType
    }));

    return res.status(200).json({ details });
  } catch (error) {
    console.error("Error fetching details:", error);
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Aggregated report for all projects (JSON)
router.get('/reports/all-json', protect(['admin','judge']), async (req, res) => {
  try {
    const projects = await Project.find().sort({ avgScore: -1 });
    res.json(projects);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


export default router;
