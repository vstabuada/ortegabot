const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Embed, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, ButtonComponent } = require("discord.js")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('dado')
        .setDescription('Rola um dado de 6 lados, ou quantos lados especificados!')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .addIntegerOption(option =>
            option.setName('lados')
                .setDescription('Quantos lados você quer que o dado tenha?')
                .setMinValue(2)
                .setMaxValue(9999999)
        ),
    async execute(interaction) {

        const lados = interaction.options.getInteger('lados') || 6

        function getResult(x) {
            return Math.floor(Math.random() * (x - 2 + 1) + 2)
        }

        let arrs = [`O dado caiu e deu **${getResult(lados)}**!`]

        function getDesc(arr) {
            let result = ''
            arr.forEach(x => { result += `${x}\n` })
            return result
        }

        const embed = new EmbedBuilder()
            .setTitle('Dado')
            .setDescription(getDesc(arrs))
            .setTimestamp()
            .setColor('#6530ff')
            .setFooter({ text: `Dado de ${lados} lados.` })

        const reroll = new ButtonBuilder()
            .setCustomId('reroll')
            .setEmoji('🔃')
            .setLabel('Rodar novamente')
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder().addComponents([reroll])

        const sent = await interaction.reply({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] })

        const collector = sent.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300000 })

        collector.on('collect', i => {
            if (i.user.id === interaction.user.id) {
                if (arrs.length < 10) {
                    arrs.push(`O dado caiu e deu **${getResult(lados)}**!`)
                    i.update({ content: `${interaction.user}`, embeds: [embed.setDescription(getDesc(arrs))] })
                } else {
                    i.reply({ content: `Você atingiu o número máximo de rodadas por comando!`, ephemeral: true })
                }
            } else {
                i.reply({ content: `Esse botão não é para você!`, ephemeral: true })
            }
        })
    }
}