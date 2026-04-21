const jwt = require('jsonwebtoken');

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((cookies, part) => {
    const [rawName, ...rawValue] = part.split('=');
    const name = rawName?.trim();

    if (!name) return cookies;

    cookies[name] = decodeURIComponent(rawValue.join('=').trim());
    return cookies;
  }, {});
}

function signToken(user, secret) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      username: user.username,
      email: user.email
    },
    secret,
    { expiresIn: '7d' }
  );
}

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    createdAt: user.createdAt
  };
}

function authenticateToken(secret) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const [, bearerToken] = header.split(' ');
    const cookies = parseCookies(req.headers.cookie || '');
    const token = cookies.authToken || bearerToken;

    if (!token) {
      return res.status(401).json({ message: 'Missing authorization token.' });
    }

    try {
      req.user = jwt.verify(token, secret);
      return next();
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token.' });
    }
  };
}

module.exports = {
  authenticateToken,
  parseCookies,
  sanitizeUser,
  signToken
};
