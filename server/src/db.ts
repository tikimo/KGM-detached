import * as mongoose from "mongoose";
import {blacklistSchema} from "./models/blacklistSchema";
import {guildPointsSchema} from "./models/guildPointsSchema";
import {playerPointsSchema} from "./models/playerPointsSchema";
import {logSchema} from "./models/logSchema";
import {telegramSchema} from "./models/telegramSchema";
import {IS_DEVELOPMENT_MODE} from "./development-mode";

let mongoURI = 'mongodb+srv://user:pass@mongodb.net/'
let dbName = IS_DEVELOPMENT_MODE ? 'dev': 'prod';

export const BlacklistModel = mongoose.model('blacklist', blacklistSchema);
export const GuildPointsModel = mongoose.model('guildpoints', guildPointsSchema);
export const PlayerPointsModel = mongoose.model('playerpoints', playerPointsSchema);
export const LogModel = mongoose.model('log', logSchema);
export const TelegramModel = mongoose.model('telegram', telegramSchema);

export async function initDb() {
    mongoose.set('strictQuery', true);
    console.log('Initialising DB connection...');
    await mongoose.connect(mongoURI, {
        dbName: dbName
    }, (error) => {
        error ? console.log(error) : console.log('DB connection initiated.');
    });
}
