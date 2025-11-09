
import express from 'express';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

function isAfterOrEqualToday(dateStr){
  const today = new Date();
  const d = new Date(dateStr);
  return today >= new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Judge rates a project
router.post('/:projectId', protect(['judge','admin']), async (req, res) => {
  try {
    const { score, feedback } = req.body;
    const { projectId } = req.params;
    const p = await Project.findById(projectId);
    if(!p) return res.status(404).json({ message: 'Project not found' });

    // Block scoring before exhibition date
    if (!isAfterOrEqualToday(p.exhibitionDate)) {
      return res.status(400).json({ message: 'Scoring is locked until exhibition date' });
    }

    // Check if this judge already scored
    const already = p.scores.find(s => String(s.judgeId) === req.user.id);
    if (already) return res.status(400).json({ message: 'You already scored this project' });

    p.scores.push({ judgeId: req.user.id, judgeName: req.user.name, score, feedback });
    // recompute aggregate
    const total = p.scores.reduce((a,b)=>a + (b.score||0), 0);
    p.scoresCount = p.scores.length;
    p.avgScore = p.scoresCount ? total / p.scoresCount : 0;
    await p.save();

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
