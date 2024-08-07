const discord = require("discord.js")
const config = require("./config.json")
const client = new discord.Client({ intents: ["Guilds", "GuildMessages", "GuildMembers", "GuildPresences"] })
const { SlashCommandBuilder, PermissionFlagsBits, ActivityType } = require('discord.js');
const { loadEvents } = require('./Handlers/eventsHandler')
const { loadCommands } = require('./Handlers/commandHandler')
client.commands = new discord.Collection()

client.login(config.token).then(() => {
    loadEvents(client)
    loadCommands(client)
})

client.on('ready', (x) => {
    const status = client.user.setPresence({
        status: "dnd",
        activities: [{
            type: ActivityType.Custom,
            name: 'Nimekai',
            state: 'Trabalhando no Nimekai ✨'
        }]
    })
})

module.exports = { client }