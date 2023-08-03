import {Player} from "../shared/types.shared";
import {LogModel} from "./db";


type LogEntry = {
    topic: string,
    player: Player
    content: string
};

// Timestamp is used internally for coherency
type CommitEntry = LogEntry & {
    timeStamp: Date // milliseconds elapsed since the UNIX epoch
}

export class Logger {
    private commits: CommitEntry[] = []
    private readonly gameId: string;

    constructor(gameId: string) {
        this.gameId = gameId;
    }

    commit(entry: LogEntry) {
        let c: CommitEntry = {
            topic: entry.topic,
            player: entry.player,
            content: entry.content,
            timeStamp: new Date()
        }
        this.commits.push(c)
    }

    commitWithTimeStamp(entry: CommitEntry) {
        this.commits.push(entry);
    }

    async push() {
        let logString = ""

        // Gather the log to one string
        for (let c of this.commits) {
            let appendString = `[${c.timeStamp.toLocaleString()}] [${c.player.name} | ${c.player.guild}] [${c.topic}]: ${c.content}\n`
            logString += appendString;
        }

        await new LogModel({
            gameId: this.gameId,
            log: logString
        })
            .save()
            .then(
                success => {
                this.commits = []
                console.log(`Saved log to db successfully for game id: ${this.gameId}`)
            },
                error => {
                console.log(`Could not save log for game id: ${this.gameId}. Error:\n${error}`)
            });
    }

    unCommit(entry: CommitEntry) {
        let removableElementIndex = this.commits.findIndex(e => e.timeStamp == entry.timeStamp)
        this.commits.splice(removableElementIndex, 1)
    }

    getCommits(): CommitEntry[] {
        return this.commits;
    }

    // Get commits from DB. This can be used for telegram admin bot
    async getLog(gameId: string, cb: (result: any) => void) {
        LogModel.findOne({gameId: gameId}, (error: any, result: any) => {
            cb(result)
        })
    }
}


