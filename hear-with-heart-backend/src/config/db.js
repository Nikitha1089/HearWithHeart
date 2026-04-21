const mongoose = require('mongoose');

async function connectDB(uri) {
  if (!uri) {
    throw new Error('Missing MONGODB_URI in backend/.env');
  }

  await mongoose.connect(uri);
  return mongoose.connection;
}

module.exports = connectDB;
