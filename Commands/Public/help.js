const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Embed, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, ButtonComponent } = require("discord.js")


module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Exibe uma lista contendo todos os meus comandos!')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction) {

        // 
        // 
        // 
        //         DESATUALIZADO!
        // 
        // 
        // 
        // 
        // 


        const embed = new EmbedBuilder()
            .setAuthor({ name: 'Ajuda para você!', iconURL: 'https://cdn.discordapp.com/avatars/1119652468373065820/8d7f09990155fb7a7eae251e324d2b4b.png' })
            .setTitle(`Lista de Comandos`)
            .setColor(`#6530ff`)
            .setDescription(`Meus comandos ainda estão em desenvolvimento, em breve terão muitos comandos! Mas por enquanto pode ser que algum comando não funcione corretamente...`)
            .addFields(
                { name: 'Help', value: '\`/help\` - Comando utilizado para exibir a lista de comandos.' },
                { name: 'Avatar', value: '\`/avatar usuário:@Usuário visível:True/False\` - Comando utilizado para exibir a foto de perfil de algum usuário ou bot.' },
                { name: 'Ping', value: '\`/ping\` - Comando utilizado para ver a latência dos meus comandos.' },
                { name: 'Jokenpo', value: '\`/jokenpo usuário:@Usuário\` - Comando utilizado para jogar Pedra, Papel e Tesoura contra alguém.' },
                { name: 'Dado', value: '\`/dado lados:(Número)\` - Esse comando rola um dado de 6 lados, ou quantos lados especificados.' },
                { name: 'Clear', value: '\`/clear ou /purge quantidade:(Número) usuário:@Usuário\` - Comando utilizado para apagar mensagens em massa do chat.' },
            )


        const agradecer = new ButtonBuilder()
            .setCustomId('agradecer')
            .setEmoji('❤')
            .setLabel('Agradecer')
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder().addComponents([agradecer])

        const sent = await interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds: [embed],
            components: [row],
            ephemeral: true
        })

        const collector = sent.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300000 })

        collector.on('collect', i => {
            if (i.user.id === interaction.user.id) {
                i.reply({ content: `<@${interaction.user.id}> por nada!`, ephemeral: true })
            } else {
                i.reply({ content: `Esse botão não é para você!`, ephemeral: true })
            }
        })

    }
}