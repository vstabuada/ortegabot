const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { readDb } = require('../../Data/dbFunctions.js');
const { loadDatabases } = require("../../Data/dbHandler.js");
const { writeFile } = require("../../Files/fileFunctions.js");

const dbs = loadDatabases()

const choices = []

dbs.forEach(x => {
    choices.push({ name: x.name, value: JSON.stringify(x) })
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('database-view')
        .setDescription('Visualiza um banco de dados.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('Nome do banco de dados.')
                .addChoices(choices)
                .setRequired(true)

        ),
    async execute(interaction) {
        const db = JSON.parse(interaction.options.getString('nome'))
        const dbPath = db.path
        const dbName = db.name.toLowerCase()

        try {
            const json = JSON.stringify(readDb(dbPath), null, 2)
            const message = `> **${dbName}.json**\n\`\`\`json\n${json}\n\`\`\``
            if (message.length <= 2000) {
                return interaction.reply({ content: message, ephemeral: true })
            } else {
                try {
                    writeFile(readDb(dbPath), dbName, 'txt')
                    return interaction.reply({ content: 'Esse banco de dados é muito grande para ser enviado por mensagem!', ephemeral: true, files: [`./Files/${dbName}.txt`] })
                } catch (e) {
                    console.log(e)
                }
            }
        } catch (e) {
            console.log(e.message)
        }
    }
}