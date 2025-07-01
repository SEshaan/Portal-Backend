import Team from "../models/Team.js";
import User from "../models/User.js";

export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("members", "name regId isLeader");
    res.status(200).json(teams);
  } catch (err) {
    console.error("Error fetching teams:", err.message);
    res.status(500).json({ message: "Failed to fetch teams" });
  }
};

export const deleteTeamById = async (req, res) => {
  const { teamId } = req.params;
  try {
    const team = await Team.findById(teamId).populate("members");
    if (!team) return res.status(404).json({ message: "Team not found" });

    for (const member of team.members) {
      member.teamId = null;
      member.isLeader = false;
      await member.save();
    }

    await Team.findByIdAndDelete(teamId);
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error("Delete team error:", err.message);
    res.status(500).json({ message: "Failed to delete team" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select(
      "name regId teamId isLeader isAdmin"
    );
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

export const toggleAdminStatus = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.status(200).json({
      message: `User is now ${user.isAdmin ? "an admin" : "not an admin"}`,
    });
  } catch (err) {
    console.error("Toggle admin error:", err.message);
    res.status(500).json({ message: "Failed to toggle admin status" });
  }
};

export const removeUserFromTeam = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user || !user.teamId) {
      return res.status(400).json({ message: "User not in a team" });
    }

    const team = await Team.findById(user.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Remove user from team
    team.members = team.members.filter(
      (memberId) => memberId.toString() !== user._id.toString()
    );
    await team.save();

    user.teamId = null;
    user.isLeader = false;
    await user.save();

    res.status(200).json({ message: "User removed from team" });
  } catch (err) {
    console.error("Remove user error:", err.message);
    res.status(500).json({ message: "Failed to remove user from team" });
  }
};
