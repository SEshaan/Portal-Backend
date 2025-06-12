import express from "express";
import { createTeam, joinTeam , leaveTeam, kickMember} from "../controllers/teamController.js";

const router = express.Router();
router.post("/create", createTeam);
router.post("/join", joinTeam);
router.post("/leave", leaveTeam);
router.post("/kick",kickMember);

export default router;
