
import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/set-exhibition-date', protect(['admin']), async (req, res) => {
  try {
    const { exhibitionDate } = req.body;
    process.env.EXHIBITION_DATE = exhibitionDate;
    res.json({ message: 'Exhibition date set', exhibitionDate });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
