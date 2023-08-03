import * as mongoose from 'mongoose';

export const playerPointsSchema = new mongoose.Schema({
  guildName: String,
  playerName: String,
  playerIP: String,
  pointsDelta: Number,
  movementDelta: Number,
  timeStamp: Date
});
