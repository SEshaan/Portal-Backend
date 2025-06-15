import express from "express";
import {
  createTeam,
  joinTeam,
  leaveTeam,
  kickMember,
  transferLeadership,
  deleteTeam,
  getTeamInfo,
} from "../controllers/teamController.js";
import { requireLeader, requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/create", requireAuth, createTeam);
router.post("/join", requireAuth, joinTeam);
router.post("/leave", requireAuth, leaveTeam);
router.post("/kick", requireAuth, requireLeader, kickMember);
router.post(
  "/transfer-leadership",
  requireAuth,
  requireLeader,
  transferLeadership
);
router.post("/delete", requireAuth, requireLeader, deleteTeam);
router.get("/info/:regId", requireAuth, getTeamInfo);
//accepts a regno. as a param and then it returns the
export default router;
