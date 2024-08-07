const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Apague mensagens em conjunto facilmente!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Quantidade de mensagens que serão apagadas.')
                .setRequired(true)
                .setMinValue(1)
        )
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('Escolha alguém para apagar apenas as mensagens dessa pessoa.')
                .setRequired(false)
        ),
    async execute(interaction) {


        const development = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle(`Erro`)
            .setDescription(`Esse comando ainda está em desenvolvimento!`)
        if (null !== 'desenvolvimento') { interaction.reply({ content: `<@${interaction.user.id}>`, embeds: [development] }) }


        const { channel, options } = interaction
        const amount = options.getInteger('quantidade')
        const target = options.getUser('usuário')
        const messages = await channel.messages.fetch({
            limit: amount + 1
        })
        const res = new EmbedBuilder()
            .setColor('#6530ff')

        if (target) {
            let x = 0
            const filtered = [];

            (await messages).filter((msg) => {
                if (msg.author.id === target.id && amount > x) {
                    filtered.push(msg)
                    x++
                }
            })

            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`${messages.size} mensagens de ${target.username} foram deletadas com sucesso!`)
                interaction.reply({ embeds: [res], ephemeral: true })
            })
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                res.setDescription(`${messages.size} mensagens foram deletadas com sucesso!`)
                interaction.reply({ embeds: [res], ephemeral: true })
            })
        }
    }
}