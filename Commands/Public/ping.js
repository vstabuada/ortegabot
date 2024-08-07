const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Events } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Veja a latência dos meus comandos.")
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction) {
        const sent = await interaction.reply({ content: `<a:loading:1119711364089397268>  *Pingando*`, ephemeral: false, fetchReply: true })
        await interaction.editReply(`Meu ping é de **${sent.createdTimestamp - interaction.createdTimestamp}**ms!`)
    }
}