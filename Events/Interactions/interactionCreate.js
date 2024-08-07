const { CommandInteraction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: "interactionCreate",

    execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return

        const command = client.commands.get(interaction.commandName)

        if (!command) {
            interaction.reply({ content: "Comando desatualizado!" })
        }



        const nimekaiEmbed = new EmbedBuilder()
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTitle(`Meus comandos são restritos!`)
            .setDescription(`Eu sou um bot exclusivo do **[Nimekai](https://discord.gg/45xxKJYZvr)**, todos os meus comandos podem apenas serem usados lá!`)
            .setColor('DarkPurple')

        if (interaction?.guild?.id !== "1169057766204244049") return interaction.reply({ content: `<@${interaction.user.id}>`, embeds: [nimekaiEmbed], ephemeral: true })

        try {
            command.execute(interaction, client)
        } catch (e) {
            interaction.reply({ content: 'Algo deu errado!', ephemeral: true })
            return console.log(e)
        }

    }
}