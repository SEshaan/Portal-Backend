import Team from "../models/Team.js";
import User from "../models/User.js";

export const createTeam = async (req, res) => {
  const { teamName, regId } = req.body;

  try {
    const user = await User.findOne({ regId: regId.toUpperCase() });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.teamId) {
      return res.status(400).json({ error: "You are already in a team" });
    }

    const existingTeam = await Team.findOne({ name: teamName });
    if (existingTeam) {
      return res.status(400).json({ error: "Team name already taken" });
    }

    const newTeam = await Team.create({
      name: teamName,
      leader: user._id,
      members: [user._id],
    });

    user.teamId = newTeam._id;
    user.isLeader = true;
    await user.save();

    res.status(201).json({
      message: "Team created successfully",
      teamId: newTeam._id,
    });
  } catch (err) {
    console.error("Create team error:", err.message);
    res.status(500).json({ error: "Failed to create team" });
  }
};
