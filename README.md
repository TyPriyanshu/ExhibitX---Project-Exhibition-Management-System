
# ExhibitX — Project Exhibition Management System (v2)

### What's in this (no-hosting) package
- Project type selection: **Web / ML / Data Science / IoT / Other** (+ custom type when "Other").
- **Team members** in Add Project.
- **Judge signup requires secret** (default: `ExhibitX`, env: `JUDGE_SECRET`).
- Project cards show **screenshots** (image URL).
- **Leaderboard** (by average score).
- **Report PDF** with project info, team, judge names, scores.
- **Confirmation Slip PDF** with QR, ticket, date, team.
- **Admin sets exhibition date**; judges cannot score before that date.
- **Judges can see every project**.
- MongoDB models for Users, Projects, Scores.
- Local run instructions below.

## Run locally
### Backend
```
cd backend
cp .env.example .env   # edit if needed
npm install
npm run dev
```
### Frontend
```
cd ../frontend
npm install
npm run dev
```
Open http://localhost:5173 (VITE_API is set to http://localhost:5000/api).

## Notes
- Make someone admin by updating `role` in MongoDB Compass.
- Change judge secret via backend `.env` (JUDGE_SECRET).
