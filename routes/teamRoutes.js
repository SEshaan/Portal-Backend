import express from "express";
import {createTeam,joinTeam,leaveTeam,kickMember,transferLeadership, deleteTeam } from "../controllers/teamController.js";

const router = express.Router();
router.post("/create", createTeam);
router.post("/join", joinTeam);
router.post("/leave", leaveTeam);
router.post("/kick",kickMember);
router.post("/transfer-leadership", transferLeadership);
router.post("/delete",deleteTeam)

export default router;
