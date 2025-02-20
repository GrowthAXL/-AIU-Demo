import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    organizing_university: { type: String, required: true },
    tournament: { type: String, required: true },
    tournament_start_date: { type: String, required: true },
    tournament_end_date: { type: String, required: true },
    section: { type: String, required: true },
    position: { type: String, required: true },
    name_of_event: { type: String, required: false },
    name_of_university: { type: String, required: true },
    name_of_team_player: { type: String, required: true },
    certificate_number: { type: String, required: true, unique: true },
    aadhar_number: { type: String, required: true },
    txid: { type: String, required: false },
    nonce: { type: String, required: false },
    hash: { type: String, required: false },
    resource_id: { type: String, required: false },
  },
  { timestamps: true }
);

export const CertificateModel = mongoose.model(
  "Certificate",
  certificateSchema
);
