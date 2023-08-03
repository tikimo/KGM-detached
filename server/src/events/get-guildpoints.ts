import {registerEvent} from "../socket-events";
import {GuildPointsModel} from "../db";


registerEvent('get-guildpoints', (socket) => {
    console.log('Fetching guildpoints from DB...')
    GuildPointsModel.find({}, (error: any, result: any[]) => {
        socket.emit('guildpoints-update', {
            guildPoints: result
        })
    })
})