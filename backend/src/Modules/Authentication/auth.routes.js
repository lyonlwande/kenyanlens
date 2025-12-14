import express from 'express';
import { loginController, registerController, refreshController, logoutController } from './auth.controller.js';
import { getMeController } from './auth.controller.js';
import { requireAuth } from './auth.middleware.js';
const router = express.Router();


router.post('/login', loginController);
router.post('/register', registerController);
router.post('/refresh', refreshController);
router.post('/logout', logoutController);

// GET /me - get current authenticated user
router.get('/me', requireAuth, getMeController);

export default router;
