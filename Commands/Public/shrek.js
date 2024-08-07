const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shrek')
        .setDescription('Mostra o Shrek.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        interaction.reply({ content: `${interaction.user}`, ephemeral: true, files: ['./Images/shrek.jpg'] })
    }
}