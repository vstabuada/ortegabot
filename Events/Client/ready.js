const { Client, ActivityType } = require('discord.js')
const { readDb, writeDb } = require('../../Data/dbFunctions.js')

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log(`${client.user.username} está online!`)

        const chapasjsonurl = './Data/chapas.json'
        const chapasjson = readDb(chapasjsonurl)
        chapasjson.managing = []
        chapasjson.liveInvites = []
        writeDb(chapasjson, chapasjsonurl)

        const xpjsonurl = './Data/xp.json'
        const xpjson = readDb(xpjsonurl)
        xpjson.onCooldown = []
        writeDb(xpjson, xpjsonurl)

        const economydburl = './Data/economy.json'
        const economydb = readDb(economydburl)
        economydb.onCooldown = []
        writeDb(economydb, economydburl)

        const rpgdburl = './Data/rpg.json'
        const rpgdb = readDb(rpgdburl)
        rpgdb.inDungeon = []
        writeDb(rpgdb, rpgdburl)


        setInterval(() => {

            const economydburl = './Data/economy.json'
            const economydb = readDb(economydburl)
            economydb.onCooldown = []
            writeDb(economydb, economydburl)

            const xpjsonurl = './Data/xp.json'
            const xpjson = readDb(xpjsonurl)
            xpjson.onCooldown = []
            writeDb(xpjson, xpjsonurl)

        }, 300000)
    }
}