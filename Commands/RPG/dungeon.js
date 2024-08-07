const { Events, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Embed, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentBuilder, ActionRow, ComponentType, time, SimpleIdentifyThrottler } = require("discord.js")
const { readDb, writeDb } = require('../../Data/dbFunctions.js')
const { loadDungeons } = require('../../RPG/RPGHandlers/dungeonHandler.js')
const { fight } = require('../../RPG/Systems/fightSystem.js')



const db = './Data/rpg.json'

const dungeons = loadDungeons()
const choices = []

dungeons.forEach(dungeon => {
    choices.push({ name: `${dungeon.name} (Nível: ${dungeon.level})`, value: dungeons.indexOf(dungeon).toString() })
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rpg-dungeon')
        .setDescription('Sistema de dungeons do NimeWorld.')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .addSubcommand(subcommand =>
            subcommand.setName('listar')
                .setDescription('Lista todas as dungeons descobertas disponíveis.')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('entrar')
                .setDescription('Entra em uma dungeon.')
                .addStringOption(option =>
                    option.setName('dungeon')
                        .setDescription('Qual dungeon você vai entrar?')
                        .setRequired(true)
                        .addChoices(choices)
                )
        ),
    async execute(interaction, client) {
        // interaction.reply({ content: 'Esse comando não está pronto ainda!', ephemeral: true })

        const rpgdb = readDb(db)

        if (rpgdb.inDungeon.indexOf(interaction.user.id) >= 0) return interaction.reply({ content: `Você já está em uma dungeon!`, ephemeral: true })

        const subcommand = interaction.options.getSubcommand()

        const user = interaction.user

        switch (subcommand) {
            case "entrar":

                const selectedDungeon = interaction.options.getString('dungeon')

                const findPlayer = function () {
                    let result
                    readDb(db).players.forEach(x => {
                        if (x.id === interaction.user.id) result = x
                    })
                    return result
                }

                const player = findPlayer()

                if (!player) return interaction.reply({ content: `${user} Você não tem um personagem ainda no NimeWorld!`, ephemeral: true })

                if (dungeons[selectedDungeon].level > player.level) return interaction.reply({ content: `${user} Você não tem nível o suficiente para entrar nessa dungeon.`, ephemeral: true })

                dungeons[selectedDungeon].play(interaction, player, user)



                break
            case "listar":
                interaction.reply({ content: `${user} A lista de dungeons está em manutenção!`, ephemeral: true })
                break
        }


    }
}