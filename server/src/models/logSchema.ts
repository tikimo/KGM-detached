import * as mongoose from 'mongoose';

export const logSchema = new mongoose.Schema({
    gameId: String,
    log: String,
});
