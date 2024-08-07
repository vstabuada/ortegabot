const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Embed, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")


module.exports = {
    data: new SlashCommandBuilder()
    .setName('jokenpo')
    .setDescription('Jogue Jokenpô com seus amigos!')
    .addUserOption(option =>
        option.setName('usuário')
        .setDescription('Com quem você quer jogar?')
        .setRequired(true)
        )
    .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),


    async execute(interaction){

        const user = interaction.options.getUser('usuário')

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.user.username}  VS  ${user.username}` })
        .setTitle('Jokenpô! 👊')
        .setDescription(`Qual você escolhe? <@${interaction.user.id}>`)
        .setColor('#6530ff')
        .setTimestamp()
        .setFooter({ text: '❌ Player 1 | ❌ Player 2'})

        const pedra = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel('Pedra')
        .setEmoji('👊')
        .setCustomId('pedra')

        const papel = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel('Papel')
        .setEmoji('✋')
        .setCustomId('papel')

        const tesoura = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel('Tesoura')
        .setEmoji('✌')
        .setCustomId('tesoura')

        const cancelar = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel('Cancelar')
        .setEmoji('✖')
        .setCustomId('cancelar')

        const row = new ActionRowBuilder()
        .addComponents([pedra, papel, tesoura, cancelar])

        if(interaction.options.getUser('usuário').id === interaction.user.id) return await interaction.reply({content: 'Não tem como jogar jokenpô consigo mesmo!'})

        const sent = await interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds: [embed],
            components: [row],
        })



        const collectorFilter = x => x.user.id === interaction.user.id
        const collectorFilter2 = y => y.user.id === user.id
        try {
            const confirmation = await sent.awaitMessageComponent({filter: collectorFilter, time: 60_000 })

            if(confirmation.customId === 'pedra' || confirmation.customId === 'papel' || confirmation.customId === 'tesoura') {
                var player1 = confirmation.customId
                await confirmation.update({ content: `<@${user.id}>`, embeds: [embed.setDescription(`Qual você escolhe? <@${user.id}>`).setFooter({ text: '✅ Player 1 | ❌ Player 2'})], components: [row.setComponents([pedra, papel, tesoura])] })
            } else if (confirmation.customId === 'cancelar') {
                await confirmation.update({ content: 'Cancelado por pedido do usuário!', embeds: [], components: [] })
            }
        } catch (e) {
            await interaction.editReply({ content: 'Jokenpô cancelado. (Demorou demais!)', components: [], embeds: []})
        }
        
        try{
            const confirmation2 = await sent.awaitMessageComponent({filter: collectorFilter2, time: 60_000})

            if(confirmation2.customId === 'pedra' || confirmation2.customId === 'papel' || confirmation2.customId === 'tesoura') {
                var player2 = confirmation2.customId
                var winner = null

                if(player1 == 'pedra') player1 = '👊'
                if(player2 == 'pedra') player2 = '👊'
                if(player1 == 'papel') player1 = '✋'
                if(player2 == 'papel') player2 = '✋'
                if(player1 == 'tesoura') player1 = '✌'
                if(player2 == 'tesoura') player2 = '✌'

                if(player1 == player2){
                    const empate = new EmbedBuilder()
                    .setColor('Yellow')
                    .setTitle('😉 Empate!')
                    .setDescription('Dizem que duas mentes geniais pensam igual...')
                    .setFooter({ text: `${player1} Player 1 (${interaction.user.username}) | ${player2} Player 2 (${user.username})` })
                    .setTimestamp()



                    await confirmation2.update({ content: `Entre <@${interaction.user.id}> e <@${user.id}>`, embeds: [empate], components: []})
                } else{
                    var winner = null
                    if(player1 == '👊' && player2 == '✋') winner = user
                    if(player1 == '👊' && player2 == '✌') winner = interaction.user
                    if(player1 == '✋' && player2 == '👊') winner = interaction.user
                    if(player1 == '✋' && player2 == '✌') winner = user
                    if(player1 == '✌' && player2 == '👊') winner = user
                    if(player1 == '✌' && player2 == '✋') winner = interaction.user

                    if(player1 == 'pedra') player1 = '👊'
                    if(player2 == 'pedra') player2 = '👊'
                    if(player1 == 'papel') player1 = '✋'
                    if(player2 == 'papel') player2 = '✋'
                    if(player1 == 'tesoura') player1 = '✌'
                    if(player2 == 'tesoura') player2 = '✌'

                    const winnerEmbed = new EmbedBuilder()
                    .setColor('Green')
                    .setDescription(`👑 | <@${winner.id}> é o grande vencedor!`)
                    .setAuthor({ name: winner.username, iconURL: winner.displayAvatarURL() })
                    .setFooter({ text: `${player1} Player 1 (${interaction.user.username}) | ${player2} Player 2 (${user.username})` })
                    .setTimestamp()
                    
                    await confirmation2.update({ content: `Entre <@${interaction.user.id}> e <@${user.id}>`, embeds: [winnerEmbed], components: [] })
                }
            }
        } catch (e) {
            await interaction.editReply({ content: 'Jokenpô cancelado. (Demorou demais!)', components: [], embeds: []})
        }
    }
}