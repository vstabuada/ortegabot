const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { readDb, writeDb } = require('../../Data/dbFunctions.js')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('contador')
        .setDescription('Conta quantas vezes esse comando foi utilizado.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const db = './Data/contador.json'
        const obj = readDb(db) ?? {}
        const prevObj = obj

        try {
            writeDb({ ...obj, counter: obj.counter ? obj.counter + 1 : 1 }, db)
            return interaction.reply({ content: `Antes:\n\`\`\`json\n${JSON.stringify(prevObj, null, 2)}\n\`\`\`\nDepois:\n\`\`\`json\n${JSON.stringify(readDb(db), null, 2)}\n\`\`\``, ephemeral: true })
        } catch (e) {
            console.log(e.message)
        }
    }
}