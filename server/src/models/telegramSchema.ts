import * as mongoose from 'mongoose';

export const telegramSchema = new mongoose.Schema({
    telegramId: String,
    registeredCode: String,
    admin: Boolean,
    gamerTag: String,
});