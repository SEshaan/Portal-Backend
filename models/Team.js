import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, //team name 
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submissionLink: { type: String, default: null },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);
export default Team;
