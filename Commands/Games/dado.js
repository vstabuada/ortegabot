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
        ),
    async execute(interaction){

        let lados = interaction.options.getInteger('lados')

        if(typeof lados !== Number) lados = 6

        function getResult(x){
            return Math.floor(Math.random() * (x - 2 + 1) + 2)
        }


        const embed = new EmbedBuilder()
        .setTitle('Dado')
        .setDescription(`O dado caiu e deu **${getResult(lados)}**!`)
        .setTimestamp()
        .setColor('#6530ff')
        .setFooter({ text: `Dado de ${lados} lados.` })

        const reroll = new ButtonBuilder()
        .setCustomId('reroll')
        .setEmoji('🔃')
        .setLabel('Rodar novamente')
        .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder().addComponents([reroll])

        const sent = await interaction.reply({content: `<@${interaction.user.id}>`, embeds: [embed], components: [row]})

        const collector = sent.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300000 })

        collector.on('collect', i => {
            if (i.user.id === interaction.user.id) {
                i.reply({content:`<@${interaction.user.id}>`, embeds: [embed.setDescription(`O dado caiu e deu **${getResult(lados)}**!`)]})
            } else {
                i.reply({content:`Esse botão não é para você!`, ephemeral: true})
            }
        })
    }
}