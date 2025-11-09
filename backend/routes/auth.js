import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'
import dotenv from 'dotenv';
import nodemailer from 'nodemailer'

dotenv.config()

const router = express.Router();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, role, judgeSecret } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already used' });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 300 * 1000);

    if (role === 'judge') {
      const expected = process.env.JUDGE_SECRET || 'ExhibitX';
      if (judgeSecret !== expected) return res.status(400).json({ message: 'Invalid judge secret code' });
    }

    const user = await User.create({ name, email, role: role || 'student', otp, otpExpires });

    await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verification Code',
    text: `Your OTP is ${otp}, it will expire in 5 minutes`,
    });
    res.json({ id: user._id, email: user.email });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
    if (user.otpExpires < Date.now()) return res.status(400).json({ message: 'OTP expired' });

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '7d' });
    res.json({ token, role: user.role, name: user.name });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
