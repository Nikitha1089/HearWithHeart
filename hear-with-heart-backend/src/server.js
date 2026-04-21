require('dotenv').config();

const createApp = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET in backend/.env');
}

async function start() {
  try {
    await connectDB(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    const app = createApp({ jwtSecret: JWT_SECRET });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
