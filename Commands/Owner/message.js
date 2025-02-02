const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { readDb } = require("../../Data/dbFunctions");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('message')
        .setDescription('Envia uma mensagem específica em um canal específico.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('canal')
                .setDescription('Canal destinatário.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mensagem')
                .setDescription('A mensagem que será enviada.')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('embed')
                .setDescription('Qual embed vai usar?')
        ),
    async execute(interaction) {
        const canal = interaction.options.getChannel('canal')
        const mensagem = interaction.options.getString('mensagem')
        const embedID = interaction.options.getNumber('embed')

        const embedsJson = readDb('./Data/embeds.json')

        function getEmbedIndex() {
            let result
            for (let x = 0; x < embedsJson.embeds.length; x++) {
                if (embedsJson.embeds[x].id === embedID) result = x
            }
            return result
        }

        const embedIndex = getEmbedIndex()

        if (embedIndex === undefined) return interaction.reply('Não existe um embed com esse ID!')

        const embedTchola = embedsJson.embeds[embedIndex].embed

        const authorname = embedTchola.author?.name || null
        const authoricon = embedTchola.author?.icon_url || null
        const title = embedTchola.title || null
        const url = embedTchola.url || null
        const description = embedTchola.description || null
        const color = embedTchola.color || null
        const image = embedTchola.image?.url || null
        const thumbnail = embedTchola.thumbnail?.url || null
        const footertext = embedTchola.footer?.text || null
        const footericon = embedTchola.footer?.icon_url || null


        const embed = new EmbedBuilder()
            .setAuthor({ name: authorname, iconURL: authoricon })
            .setTitle(title)
            .setURL(url)
            .setDescription(description)
            .setColor(color)
            .setImage(image)
            .setThumbnail(thumbnail)
            .setFooter({ text: footertext, iconURL: footericon })

        if (canal.type === 0) {
            canal.send({ content: mensagem, embeds: [embed] })
            interaction.reply({ content: 'Mensagem enviada!' })
        } else {
            return interaction.reply({ content: 'Tem que ser um canal de texto!' })
        }

    }

}