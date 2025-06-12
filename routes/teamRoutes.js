import express from 'express'
import { createTeam, joinTeam } from '../controllers/teamController.js';

const router = express.Router();
router.post('/create',createTeam);
router.post('/join',joinTeam);

export default router;