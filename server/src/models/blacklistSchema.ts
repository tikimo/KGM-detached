import * as mongoose from 'mongoose';

export const blacklistSchema = new mongoose.Schema({
  gamerTag: String,
  telegramId: String,
  banned: Boolean,
});
