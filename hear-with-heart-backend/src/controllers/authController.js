const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sanitizeUser, signToken } = require('../utils/auth');

function createAuthController(jwtSecret) {
  function setAuthCookie(res, token) {
    res.cookie('authToken', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Remove legacy path-scoped cookies from earlier versions of the app.
    res.clearCookie('authToken', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/api/auth'
    });
  }

  async function register(req, res) {
    try {
      const { username, email, password } = req.body || {};

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
      }

      const trimmedUsername = username.trim();
      const normalizedEmail = email.trim().toLowerCase();

      if (trimmedUsername.length < 3) {
        return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
      }

      const existingUser = await User.findOne({
        $or: [{ username: trimmedUsername }, { email: normalizedEmail }]
      });

      if (existingUser) {
        return res.status(409).json({ message: 'That username or email is already in use.' });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({
        username: trimmedUsername,
        email: normalizedEmail,
        passwordHash
      });

      const token = signToken(user, jwtSecret);
      setAuthCookie(res, token);

      return res.status(201).json({
        message: 'Registration successful.',
        user: sanitizeUser(user)
      });
    } catch (error) {
      if (error && error.code === 11000) {
        return res.status(409).json({ message: 'That username or email is already in use.' });
      }

      console.error('Register error:', error);
      return res.status(500).json({ message: 'Server error while registering user.' });
    }
  }

  async function login(req, res) {
    try {
      const { identifier, password } = req.body || {};

      if (!identifier || !password) {
        return res.status(400).json({ message: 'Username/email and password are required.' });
      }

      const normalizedIdentifier = identifier.trim();
      const user = await User.findOne({
        $or: [
          { username: normalizedIdentifier },
          { email: normalizedIdentifier.toLowerCase() }
        ]
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid username/email or password.' });
      }

      const passwordMatches = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatches) {
        return res.status(401).json({ message: 'Invalid username/email or password.' });
      }

      const token = signToken(user, jwtSecret);
      setAuthCookie(res, token);

      return res.json({
        message: 'Login successful.',
        user: sanitizeUser(user)
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server error while logging in.' });
    }
  }

  async function me(req, res) {
    try {
      const user = await User.findById(req.user.sub);

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      return res.json({ user: sanitizeUser(user) });
    } catch (error) {
      console.error('Me error:', error);
      return res.status(500).json({ message: 'Server error while loading user.' });
    }
  }

  async function logout(req, res) {
    try {
      res.clearCookie('authToken', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/'
      });

      res.clearCookie('authToken', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/api/auth'
      });

      return res.json({ message: 'Logged out successfully.' });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ message: 'Server error while logging out.' });
    }
  }

  return {
    logout,
    login,
    me,
    register
  };
}

module.exports = createAuthController;
