const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Embed, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Veja sua foto de perfil ou a foto de perfil de alguém!')
        .addUserOption(option =>
            option
                .setName('usuário')
                .setDescription('A pessoa que você quer ver a foto de perfil.'))
        .addBooleanOption(option =>
            option
                .setName('visível')
                .setDescription('Escolha se o comando será visível para todos ou apenas para você.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),



    async execute(interaction) {


        let usuario = interaction.options.getUser('usuário') || interaction.user
        let userAvatar = usuario.displayAvatarURL({ size: 512 })

        const embed = new EmbedBuilder()
            .setTitle(`🖼 Foto de perfil de **${usuario.username}**`)
            .setImage(userAvatar)
            .setColor('#6530ff')
            .setTimestamp()

        const button = new ButtonBuilder()
            .setLabel("Inspecionar")
            .setStyle(ButtonStyle.Link)
            .setURL(usuario.avatarURL({ size: 512 }))

        const row = new ActionRowBuilder().addComponents(button)

        var visible

        if (interaction.options.getBoolean('visível') === true) visible = false
        if (interaction.options.getBoolean('visível') === false) visible = true
        if (!visible) visible = false

        await interaction.reply({
            content: 'Foto gerada com sucesso!',
            embeds: [embed],
            components: [row],
            ephemeral: visible,
            fetchReply: true
        })

    }
}