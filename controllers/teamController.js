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

export const kickMember = async (req, res) => {
  const { leaderRegId, memberRegId } = req.body;

  try {
    const leader = await User.findOne({ regId: leaderRegId.toUpperCase() });
    const member = await User.findOne({ regId: memberRegId.toUpperCase() });

    if (!leader || !leader.isLeader || !leader.teamId) {
      return res
        .status(403)
        .json({ error: "Only a team leader can kick members" });
    }

    if (
      !member ||
      !member.teamId ||
      member.teamId.toString() !== leader.teamId.toString()
    ) {
      return res.status(400).json({ error: "Member not in the same team" });
    }

    if (leader._id.toString() === member._id.toString()) {
      return res.status(400).json({ error: "Leader cannot kick themselves" });
    }

    const team = await Team.findById(leader.teamId);

    if (team.members.length <= 2) {
      return res
        .status(400)
        .json({ error: "Team must have at least 2 members" });
    }

    // Remove member
    team.members = team.members.filter(
      (memberId) => memberId.toString() !== member._id.toString()
    );
    await team.save();

    member.teamId = null;
    await member.save();

    res.status(200).json({ message: "Member kicked successfully" });
  } catch (err) {
    console.error("Kick member error:", err.message);
    res.status(500).json({ error: "Failed to kick member" });
  }
};

export const transferLeadership = async (req, res) => {
  const { currentLeaderRegId, newLeaderRegId } = req.body;

  try {
    const currentLeader = await User.findOne({
      regId: currentLeaderRegId.toUpperCase(),
    });
    const newLeader = await User.findOne({
      regId: newLeaderRegId.toUpperCase(),
    });

    if (!currentLeader || !currentLeader.isLeader || !currentLeader.teamId) {
      return res
        .status(403)
        .json({ error: "Only the current leader can transfer leadership" });
    }

    if (
      !newLeader ||
      !newLeader.teamId ||
      newLeader.teamId.toString() !== currentLeader.teamId.toString()
    ) {
      return res
        .status(400)
        .json({ error: "New leader must be in the same team" });
    }

    if (currentLeader._id.toString() === newLeader._id.toString()) {
      return res.status(400).json({ error: "You are already the leader" });
    }

    // Transfer leadership
    currentLeader.isLeader = false;
    newLeader.isLeader = true;

    await currentLeader.save();
    await newLeader.save();

    res.status(200).json({ message: "Leadership transferred successfully" });
  } catch (err) {
    console.error("Transfer error:", err.message);
    res.status(500).json({ error: "Failed to transfer leadership" });
  }
};

export const deleteTeam = async (req, res) => {
  const { leaderRegId } = req.body;

  try {
    const leader = await User.findOne({ regId: leaderRegId.toUpperCase() });

    if (!leader || !leader.isLeader || !leader.teamId) {
      return res
        .status(403)
        .json({ error: "Only the team leader can delete the team" });
    }

    const team = await Team.findById(leader.teamId).populate("members");

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Remove teamId from all members
    for (const member of team.members) {
      member.teamId = null;
      member.isLeader = false;
      await member.save();
    }

    await Team.findByIdAndDelete(team._id);

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error("Delete team error:", err.message);
    res.status(500).json({ error: "Failed to delete team" });
  }
};

export const getTeamInfo = async (req, res) => {
  const { regId } = req.params;

  try {
    const user = await User.findOne({ regId: regId.toUpperCase() });

    if (!user || !user.teamId) {
      return res.status(404).json({ error: "User not in a team" });
    }

    const team = await Team.findById(user.teamId).populate(
      "members",
      "name regId isLeader"
    );

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.status(200).json({
      teamName: team.name,
      teamId: team._id,
      members: team.members,
    });
  } catch (err) {
    console.error("Team info error:", err.message);
    res.status(500).json({ error: "Failed to fetch team info" });
  }
};
