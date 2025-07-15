import Team from "../models/Team.js";
import User from "../models/User.js";

export const createTeam = async (req, res) => {
  const { teamName } = req.body;
  const user = req.user;

  try {
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (user.teamId) {
      return res.status(400).json({ message: "You are already in a team" });
    }

    const existingTeam = await Team.findOne({ name: teamName });
    if (existingTeam) {
      return res.status(400).json({ message: "Team name already taken" });
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
    res.status(500).json({ message: "Failed to create team" });
  }
};

export const joinTeam = async (req, res) => {
  const { teamName } = req.body;
  const user = req.user;

  try {
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (user.teamId) {
      return res.status(400).json({ message: "You are already in a team" });
    }

    const team = await Team.findOne({ name: teamName });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.members.length >= 4) {
      return res.status(400).json({ message: "Team is full. (max 4 members)" });
    }

    team.members.push(user._id);
    user.teamId = team._id;
    await Promise.all([team.save(), user.save()]);

    res.status(200).json({ message: "Joined team successfully" });
  } catch (err) {
    console.error("Join team error:", err.message);
    res.status(500).json({ message: "Failed to join team" });
  }
};

export const leaveTeam = async (req, res) => {
  const user = req.user;

  try {
    if (!user || !user.teamId) {
      return res.status(400).json({ message: "User not in a team" });
    }

    const team = await Team.findById(user.teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    if (team.members.length <= 2) {
      return res
        .status(400)
        .json({ message: "A team must have at least 2 members" });
    }

    if (user.isLeader) {
      return res.status(400).json({ message: "Leader cannot leave." });
    }

    team.members = team.members.filter(
      (memberId) => memberId.toString() !== user._id.toString()
    );
    user.teamId = null;
    await Promise.all([team.save(), user.save()]);

    res.status(200).json({ message: "Successfully left the team" });
  } catch (err) {
    console.error("Leave team error:", err.message);
    res.status(500).json({ message: "Failed to leave team" });
  }
};

export const kickMember = async (req, res) => {
  const { memberRegId } = req.body;
  const leader = req.user;

  try {
    if (!leader || !leader.isLeader || !leader.teamId) {
      return res
        .status(403)
        .json({ message: "Only a team leader can kick members" });
    }

    const member = await User.findOne({ regId: memberRegId.toUpperCase() });

    if (
      !member ||
      !member.teamId ||
      member.teamId.toString() !== leader.teamId.toString()
    ) {
      return res.status(400).json({ message: "Member not in the same team" });
    }

    if (leader._id.toString() === member._id.toString()) {
      return res.status(400).json({ message: "Leader cannot kick themselves" });
    }

    const team = await Team.findById(leader.teamId);

    if (team.members.length <= 2) {
      return res
        .status(400)
        .json({ message: "Team must have at least 2 members" });
    }

    team.members = team.members.filter(
      (memberId) => memberId.toString() !== member._id.toString()
    );
    member.teamId = null;
    await Promise.all([team.save(), member.save()]);

    res.status(200).json({ message: "Member kicked successfully" });
  } catch (err) {
    console.error("Kick member error:", err.message);
    res.status(500).json({ message: "Failed to kick member" });
  }
};

export const transferLeadership = async (req, res) => {
  const { newLeaderRegId } = req.body;
  const currentLeader = req.user;

  try {
    if (!currentLeader || !currentLeader.isLeader || !currentLeader.teamId) {
      return res
        .status(403)
        .json({ message: "Only the current leader can transfer leadership" });
    }

    const newLeader = await User.findOne({
      regId: newLeaderRegId.toUpperCase(),
    });

    if (
      !newLeader ||
      !newLeader.teamId ||
      newLeader.teamId.toString() !== currentLeader.teamId.toString()
    ) {
      return res
        .status(400)
        .json({ message: "New leader must be in the same team" });
    }

    if (currentLeader._id.toString() === newLeader._id.toString()) {
      return res.status(400).json({ message: "You are already the leader" });
    }

    currentLeader.isLeader = false;
    newLeader.isLeader = true;
    await Promise.all([currentLeader.save(), newLeader.save()]);

    res.status(200).json({ message: "Leadership transferred successfully" });
  } catch (err) {
    console.error("Transfer error:", err.message);
    res.status(500).json({ message: "Failed to transfer leadership" });
  }
};

export const deleteTeam = async (req, res) => {
  const leader = req.user;

  try {
    if (!leader || !leader.isLeader || !leader.teamId) {
      return res
        .status(403)
        .json({ message: "Only the team leader can delete the team" });
    }

    const team = await Team.findById(leader.teamId).populate("members");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    await Promise.all(
      team.members.map(async (member) => {
        member.teamId = null;
        member.isLeader = false;
        await member.save();
      })
    );

    await Team.findByIdAndDelete(team._id);

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error("Delete team error:", err.message);
    res.status(500).json({ message: "Failed to delete team" });
  }
};

export const getTeamInfo = async (req, res) => {
  const user = req.user;

  try {
    if (!user || !user.teamId) {
      return res.status(404).json({ message: "You are not in a team" });
    }

    const team = await Team.findById(user.teamId).populate(
      "members",
      "name regId isLeader"
    );

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.status(200).json({
      teamName: team.name,
      teamId: team._id,
      members: team.members,
    });
  } catch (err) {
    console.error("Team info error:", err.message);
    res.status(500).json({ message: "Failed to fetch team info" });
  }
};


export const updateSubmission = async (req, res) => {
  const teamId = req.params.id;
  const { link } = req.body;
  const userId = req.user._id;

  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const isMember = team.members.some(
      (m) => m.toString() === userId.toString()
    );
    if (!isMember) {
      return res.status(403).json({ message: "You are not part of this team" });
    }

    team.submissionLink = link;
    await team.save();

    res.status(200).json({ message: "Submission link updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

