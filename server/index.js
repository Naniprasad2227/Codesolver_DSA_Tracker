const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db/database');
const Topic = require('./models/Topic');
const seedDatabase = require('./db/seed');

const authRoutes = require('./routes/auth');
const topicRoutes = require('./routes/topics');
const problemRoutes = require('./routes/problems');
const progressRoutes = require('./routes/progress');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// Allowed Origins for CORS (localhost + any Vercel deployment domain)
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000'
];

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all valid cross-origin requests with credentials
  },
  credentials: true
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CodeSolver Backend API is active.',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      topics: '/api/topics',
      problems: '/api/problems',
      progress: '/api/progress',
      admin: '/api/admin'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), service: 'CodeSolver Backend' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

// Connect to Database & Start Server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const topicCount = await Topic.countDocuments();
    if (topicCount === 0) {
      console.log('Database empty: Seeding topics and problems...');
      await seedDatabase();
    } else {
      console.log(`Database populated with ${topicCount} topics.`);
    }

    app.listen(PORT, () => {
      console.log(`CodeSolver backend server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
