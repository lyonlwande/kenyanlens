import { login, register, refresh, logout ,getMe } from './auth.service.js';



function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days, match .env
  });
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const userAgent = req.get('user-agent');
    const ip = req.ip;
    const { accessToken, refreshToken, user } = await login(email, password, userAgent, ip);
    setRefreshCookie(res, refreshToken);
    res.json({ token: accessToken, user });
  } catch (err) {
    res.status(401).json({ error: err.message });
    console.error('[LOGIN] Error:', err);
  }
}

export async function registerController(req, res) {
  try {
    const { email, password, username, bio } = req.body;
    const userAgent = req.get('user-agent');
    const ip = req.ip;
    console.log('[SIGNUP] Attempt:', { email, username, ip, userAgent });
    const { accessToken, refreshToken, user } = await register(email, password, username, bio, userAgent, ip);
    setRefreshCookie(res, refreshToken);
    console.log('[SIGNUP] Success:', { user });
    res.json({ token: accessToken, user });
  } catch (err) {
    console.error('[SIGNUP] Error:', err);
    res.status(400).json({ error: err.message });
  }
}

export async function refreshController(req, res) {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) return res.status(401).json({ error: 'No refresh token' });
    const userAgent = req.get('user-agent');
    const ip = req.ip;
    const { accessToken, refreshToken } = await refresh(oldRefreshToken, userAgent, ip);
    setRefreshCookie(res, refreshToken);
    res.json({ token: accessToken });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

export async function logoutController(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) await logout(refreshToken);
    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// GET /me controller
export async function getMeController(req, res) {
  try {
    const user = await getMe(req.user.id);
    console.log('[GET ME] User:', user);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
