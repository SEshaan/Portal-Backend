import express from "express";
import {
  getAllTeams,
  deleteTeamById,
  getAllUsers,
  toggleAdminStatus,
  removeUserFromTeam,
} from "../controllers/adminController.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, requireAdmin); 
// ^^ remember kids, protection is important

router.get("/teams", getAllTeams);
router.delete("/teams/:teamId", deleteTeamById);
router.get("/users", getAllUsers);
router.patch("/users/:userId/toggle-admin", toggleAdminStatus);
router.patch("/users/:userId/remove-from-team", removeUserFromTeam);

export default router;
