const { Client, SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js")
const { loadCommands } = require("../../Handlers/commandHandler.js")
const { loadEvents } = require("../../Handlers/eventsHandler.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reload")
        .setDescription("Reinicia seus comandos ou eventos.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName("commands")
                .setDescription("Reinicia meus comandos.")
        )
        .addSubcommand(subcommand =>
            subcommand.setName("events")
                .setDescription("Reinicia meus eventos.")
        ),

    async execute(interaction, client) {

        const { user } = interaction
        const sub = interaction.options.getSubcommand()
        const embed = new EmbedBuilder()
            .setTitle("Desenvolvedor")
            .setColor("DarkPurple")

        if (user.id === "545314209865531398") {
            switch (sub) {
                case "commands": {
                    loadCommands(client)
                    interaction.reply({ embeds: [embed.setDescription("<a:check:1123125625952153611> | Comandos reiniciados!")], ephemeral: true })
                    console.log(`${user.username} reiniciou os comandos.`)
                    break
                }
                case "events": {
                    loadEvents(client)
                    interaction.reply({ embeds: [embed.setDescription("<a:check:1123125625952153611> | Eventos reiniciados!")], ephemeral: true })
                    console.log(`${user.username} reiniciou os eventos.`)
                    break
                }
            }
        } else {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setColor("Red").setDescription("Esse comando é restrito apenas para os meus pais!")], ephemeral: true
            })
        }
    }
}