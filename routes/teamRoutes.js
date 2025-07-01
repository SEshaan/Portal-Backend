import express from "express";
import {
  createTeam,
  joinTeam,
  leaveTeam,
  kickMember,
  transferLeadership,
  deleteTeam,
  getTeamInfo,
  updateSubmission,
  getMyTeam
} from "../controllers/teamController.js";
import { requireLeader, protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/create", protect, createTeam);
router.post("/join", protect, joinTeam);
router.post("/leave", protect, leaveTeam);
router.post("/kick", protect, requireLeader, kickMember);
router.post(
  "/transfer-leadership",
  protect,
  requireLeader,
  transferLeadership
);
router.post("/delete", protect, requireLeader, deleteTeam);
router.get("/info/:regId", protect, getTeamInfo);
//accepts a regno. as a param and then it returns the
router.patch("/:id/submission", protect, requireLeader, updateSubmission);
router.get("/me",protect,getMyTeam);
export default router;
