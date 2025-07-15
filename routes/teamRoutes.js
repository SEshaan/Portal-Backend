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
router.get("/info",protect, getTeamInfo);
router.post("/delete", protect, requireLeader, deleteTeam);
router.patch("/:id/submission", protect, requireLeader, updateSubmission);
export default router;
