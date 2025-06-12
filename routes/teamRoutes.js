import express from "express";
import { createTeam, joinTeam , leaveTeam} from "../controllers/teamController.js";

const router = express.Router();
router.post("/create", createTeam);
router.post("/join", joinTeam);
router.post("/leave", leaveTeam);

export default router;
