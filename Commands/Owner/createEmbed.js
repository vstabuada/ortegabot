const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { readDb, writeDb } = require('../../Data/dbFunctions')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-embed')
        .setDescription('Envia uma mensagem específica em um canal específico.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addNumberOption(option =>
            option.setName('id')
                .setDescription('Embed ID')
                .setMinValue(0)
                .setMaxValue(100)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('author')
                .setDescription('author')
        )
        .addStringOption(option =>
            option.setName('authoricon')
                .setDescription('authoricon')
        )
        .addStringOption(option =>
            option.setName('title')
                .setDescription('title')
        )
        .addStringOption(option =>
            option.setName('titleurl')
                .setDescription('titleurl')
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('description')
        )
        .addStringOption(option =>
            option.setName('color')
                .setDescription('color')
        )
        .addStringOption(option =>
            option.setName('imageurl')
                .setDescription('imageurl')
        )
        .addStringOption(option =>
            option.setName('thumbnailurl')
                .setDescription('thumbnailurl')
        )
        .addStringOption(option =>
            option.setName('footer')
                .setDescription('footer')
        )
        .addStringOption(option =>
            option.setName('footericon')
                .setDescription('footericon')
        ),
    async execute(interaction) {

        const id = interaction.options.getNumber('id')
        const author = interaction.options.getString('author')
        const authoricon = interaction.options.getString('authoricon')
        const title = interaction.options.getString('title')
        const titleurl = interaction.options.getString('titleurl')
        const description = interaction.options.getString('description')
        const color = interaction.options.getString('color')
        const imageurl = interaction.options.getString('imageurl')
        const thumbnailurl = interaction.options.getString('thumbnailurl')
        const footer = interaction.options.getString('footer')
        const footericon = interaction.options.getString('footericon')



        const embed = new EmbedBuilder()
            .setAuthor({ name: author, iconURL: authoricon })
            .setTitle(title)
            .setURL(titleurl)
            .setDescription(description)
            .setColor(color)
            .setImage(imageurl)
            .setThumbnail(thumbnailurl)
            .setFooter({ text: footer, iconURL: footericon })

        const embedsJson = readDb('./Data/embeds.json') || { embeds: [] }

        console.log(readDb('./Data/embeds.json'))
        console.log(embedsJson)
        console.log(embedsJson.embeds)

        embedsJson.embeds.push({ id: id, embed: embed.toJSON() })
        console.log(embedsJson)
        writeDb(embedsJson, './Data/embeds.json')

        interaction.reply({ content: 'teste', embeds: [embed] })
    }

}