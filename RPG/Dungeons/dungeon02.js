const { Events, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Embed, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentBuilder, ActionRow, ComponentType, time, SimpleIdentifyThrottler } = require("discord.js")
const { readDb, writeDb } = require('../../Data/dbFunctions.js')

const db = './Data/rpg.json'

const name = "Bosque Amaldiçoado"
const requiredLevel = 5
const color = "#076957"


module.exports = {
    data: {
        name: name,
        level: requiredLevel,
        async play(interaction, player, user) {

            const startEmbed = new EmbedBuilder()
                .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                .setTitle(`Deseja entrar na dungeon?`)
                .setDescription(`**${name}**\nNível mínimo: ${requiredLevel} (Seu nível: ${player.profile.level})`)
                .setColor(color)

            // const yes = new ButtonBuilder()


            interaction.reply({ content: `${user}`, embeds: [startEmbed] })

        }
    }
}