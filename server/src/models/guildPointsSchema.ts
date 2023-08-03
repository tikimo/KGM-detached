import * as mongoose from 'mongoose';
import { Guild } from '../../shared/types.shared';

export const guildPointsSchema = new mongoose.Schema({
  name: String,
  points: Number,
  log: [{ name: String, points: Number, gameId: String }],
});
