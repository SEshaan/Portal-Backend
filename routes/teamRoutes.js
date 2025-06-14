import express from "express";
import {createTeam,joinTeam,leaveTeam,kickMember,transferLeadership, deleteTeam, getTeamInfo} from "../controllers/teamController.js";
const router = express.Router();
router.post("/create", createTeam);
router.post("/join", joinTeam);
router.post("/leave", leaveTeam);
router.post("/kick",kickMember);
router.post("/transfer-leadership", transferLeadership);
router.post("/delete",deleteTeam)
router.get("/info/:regId", getTeamInfo);
//this one is crazy coz its dynamic shieeeet
//accepts a regno. as a param and then it returns the
export default router;
