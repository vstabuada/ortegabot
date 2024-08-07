const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js')
const { client } = require('../../index.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banir algum membro do servidor permanentemente.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('membro')
                .setDescription('Escolha alguém banir do seu servidor.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Motivo do banimento.')
                .setRequired(false)
        ),
    async execute(interaction) {

        const development = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle(`Erro`)
            .setDescription(`Esse comando ainda está em desenvolvimento!`)
        if (null !== 'desenvolvimento') { interaction.reply({ content: `<@${interaction.user.id}>`, embeds: [development] }) }

        const targetUserId = interaction.options.get('membro.value')
        const reason = interaction.options.get('motivo')?.value || `Nenhum motivo foi aplicado.`

        const targetUser = await interaction.guild.members.fetch(targetUserId)



        interaction.deferReply()

        if (!targetUser) {
            await interaction.editReply(`Esse usuário não existe nesse servidor!`)
            return
        }
        if (targetUser.id === interaction.guild.ownerId) {
            await interaction.editReply(`Você está tentando banir o dono do servidor!`)
            return
        }

        if (targetUser.id === interaction.user.id) {
            await interaction.editReply(`Você não pode banir a si mesmo!`)
            return
        }
        if (targetUser.id === client.user.id) {
            await interaction.editReply(`Você não pode me banir comigo mesmo!`)
            return
        }


        const targetUserRolePosition = targetUser.roles.highest.position
        const requestUserRolePosition = interaction.member.roles.highest.position
        const botRolePosition = interaction.guild.members.me.roles.highest.position

        if (targetUserRolePosition == requestUserRolePosition) {
            await interaction.editReply('Você não pode banir esse usuário, ele tem o mesmo cargo que você!')
            return
        }
        if (targetUserRolePosition > requestUserRolePosition) {
            await interaction.editReply('Você não pode banir esse usuário, ele tem um cargo maior que o seu!')
            return
        }
        if (targetUserRolePosition == botRolePosition) {
            await interaction.editReply('Eu não posso banir esse usuário por que ele tem o mesmo cargo que eu!')
            return
        }
        if (targetUserRolePosition > botRolePosition) {
            await interaction.editReply('Eu não posso banir esse usuário por que ele tem um cargo maior que o meu!')
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setColor('#00ff00')
            .setTitle('<:check:1123125625952153611> Usuário banido.')
            .setDescription(`${targetUser.tag} foi banido com sucesso!\nMotivo: "${reason}"`)
            .setTimestamp()

        try {
            await targetUser.ban({ reason })
            await interaction.editReply({ embeds: embed })
        } catch (error) {
            console.log(`Houve um erro enquanto executava um banimento: ${error}`)
            await interaction.editReply('Houve um erro enquanto tentava banir o usuário!')
        }

    }
}