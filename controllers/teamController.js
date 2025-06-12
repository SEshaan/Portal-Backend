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

export const joinTeam = async (req, res) => {
  const { teamName, regId } = req.body;

  try {
    const user = await User.findOne({ regId: regId.toUpperCase() });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.teamId) {
      return res.status(400).json({ error: "You are already in a team" });
    }

    const team = await Team.findOne({ name: teamName });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    if (team.members.length >= 4) {
      return res.status(400).json({ error: "Team is full. (max 4 members)" });
    }

    team.members.push(user._id);
    await team.save();

    user.teamId = team._id;
    await user.save();

    res.status(200).json({ message: "Joined team successfully" });
  } catch (err) {
    console.error("Join team error:", err.message);
    res.status(500).json({ error: "Failed to join team" });
  }
};

export const leaveTeam = async (req, res) => {
  const { regId } = req.body;

  try {
    const user = await User.findOne({ regId: regId.toUpperCase() });

    if (!user || !user.teamId) {
      return res.status(400).json({ error: "User not in a team" });
    }

    const team = await Team.findById(user.teamId);

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (team.members.length <= 2) {
      return res
        .status(400)
        .json({ error: "A team must have at least 2 members" });
    }

    if (user.isLeader) {
      return res.status(400).json({ error: "Leader cannot leave." });
    }

    // Remove user from team
    team.members = team.members.filter(
      (memberId) => memberId.toString() !== user._id.toString()
    );
    await team.save();

    // Clear user's team info
    user.teamId = null;
    await user.save();

    res.status(200).json({ message: "Successfully left the team" });
  } catch (err) {
    console.error("Leave team error:", err.message);
    res.status(500).json({ error: "Failed to leave team" });
  }
};
