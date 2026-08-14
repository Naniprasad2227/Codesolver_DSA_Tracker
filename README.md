# CodeSolver — Master DSA. One Problem at a Time.

Production-ready DSA roadmap and progress-tracking web application built with **React**, **Express**, and **MongoDB**.

---

## 🌟 Overview

CodeSolver is a **topic-wise DSA roadmap and progress tracker** featuring separated **User** and **Admin** dashboards.
- Users browse problems by topic, click through to the original **LeetCode** or **GeeksforGeeks** problem, solve it there, return to CodeSolver, mark it as solved, and track their personal progress starting at 0%.
- Administrators access global analytics, user management, and problem catalog curation.

---

## 🧭 Dashboard Roles & Access

### 1. 👤 User Dashboard (`/dashboard`)
- **Independent Zero-State**: Newly registered users always start with **0 solved**, **0% progress**, **0 day streak**, and unchecked boxes.
- **Topic-Wise Roadmap**: 16 curated topics (186 problems) covering fundamental to advanced DSA.
- **Real-Time Solves**: Instant checkboxes with optimistic UI and live progress bar calculation.
- **Difficulty Breakdown**: Track Easy, Medium, and Hard personal metrics.
- **Personal Bookmarks**: Star problems for revision before interviews.
- **Direct Links**: Official LeetCode and GeeksforGeeks buttons opening in new tabs.

### 2. 🛡️ Admin Dashboard (`/admin`)
- **Platform Analytics**: Global metrics including total registered users, catalog problem count, total solves recorded across all users, and average solves per user.
- **Top Solved Problems**: Real-time rank of most solved questions across the community.
- **User Management**: Inspect all registered users, promote/demote roles (`user` ↔ `admin`), and delete user accounts with cascading data cleanup.
- **Problem Catalog Curation**: Add new problems (title, topic, difficulty, LeetCode/GFG URLs), edit existing problems, or remove problems.
- **Role-Based Security**: Protected with `AdminRoute` on the frontend and `adminMiddleware` on the backend API.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router v6, Lucide Icons, Vanilla CSS Design System
- **Backend**: Node.js, Express, JWT Authentication, Cookie-Parser, CORS
- **Database**: MongoDB with Mongoose ODM

---

## 🚀 Quick Start

### 1. Start Dev Server
```bash
npm run dev
```
- Client: `http://localhost:5173`
- Backend API: `http://localhost:3001`

### 2. Database Scripts
- **Seed Problem Catalog (16 topics, 186 problems)**:
  ```bash
  npm run seed
  ```
- **Export Problem Catalog to JSON & CSV**:
  ```bash
  node server/db/export_dataset.js
  ```

---

## 📄 License
MIT License
