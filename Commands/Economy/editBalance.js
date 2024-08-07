const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Embed } = require("discord.js")
const { readDb, writeDb } = require("../../Data/dbFunctions")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('editbalance')
        .setDescription('Edita o saldo do banco digital de alguém.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('A pessoa que você quer editar o saldo do banco.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('moeda')
                .setDescription('Qual moeda você quer editar?')
                .setRequired(true)
                .addChoices(
                    { name: 'Ouro', value: 'gold' },
                    { name: 'Diamante', value: 'diamond' },
                    { name: 'Nimekoin', value: 'nimekoin' },
                )
        )
        .addStringOption(option =>
            option.setName('modulo')
                .setDescription('O que você quer fazer?')
                .setRequired(true)
                .addChoices(
                    { name: 'Adicionar', value: 'add' },
                    { name: 'Remover', value: 'sub' },
                    { name: 'Definir', value: 'set' },
                )
        )
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Quantidade que você quer editar.')
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(999999999)
        ),
    async execute(interaction, client) {

        const db = './Data/economy.json'
        const economyDb = readDb(db)
        const Emojis = readDb().emojis

        const user = interaction.options.getUser('usuario')

        if (user.id === client.user.id) return interaction.reply({ content: 'Eu não tenho uma conta bancária, bobinho(a)...', ephemeral: true })
        if (user.bot) return interaction.reply({ content: 'BOTs não têm contas bancárias, baka...', ephemeral: true })

        const getUserIndex = function (users) {
            let userIndex
            users.forEach(x => {
                if (x.id === user.id) userIndex = economyDb.users.indexOf(x)
            })
            return userIndex
        }
        const users = economyDb.users

        if (getUserIndex(users) === undefined) return interaction.reply({ content: `Esse usuário não tem uma conta no banco digital!`, ephemeral: true })

        const userIndex = getUserIndex(users)


        const moeda = interaction.options.getString('moeda')
        const module = interaction.options.getString('modulo')
        const quantity = interaction.options.getInteger('quantidade')

        const successEmbed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setColor('Green')
            .setTitle('Editado com sucesso!')
            .setTimestamp()

        const desc = function (emojiMoeda) {
            switch (module) {
                case "add":
                    return `Foi adicionado uma quantia de ${emojiMoeda} \`${quantity.toLocaleString()}\` na conta de ${user}!`
                case "sub":
                    return `Foi removido uma quantia de ${emojiMoeda} \`${quantity.toLocaleString()}\` da conta de ${user}!`
                case "set":
                    return `Foi definido uma quantia de ${emojiMoeda} \`${quantity.toLocaleString()}\` na conta de ${user}!`
            }
        }

        switch (moeda) {
            case "gold":
                switch (module) {
                    case "add":
                        economyDb.users[userIndex].gold += quantity
                        writeDb(economyDb, db)
                        successEmbed.setDescription(desc(Emojis.gold))
                        return await interaction.reply({ content: `${interaction.user}`, embeds: [successEmbed] })
                    case "sub":
                        if (economyDb.users[userIndex].gold < quantity) return interaction.reply({ content: 'Você está tentando remover mais do que esse usuário tem!', ephemeral: true })
                        economyDb.users[userIndex].gold -= quantity
                        writeDb(economyDb, db)
                        successEmbed.setDescription(desc(Emojis.gold))
                        return interaction.reply({ content: `${interaction.user}`, embeds: [successEmbed] })

                    case "set":
                        economyDb.users[userIndex].gold = quantity
                        writeDb(economyDb, db)
                        successEmbed.setDescription(desc(Emojis.gold))
                        return interaction.reply({ content: `${interaction.user}`, embeds: [successEmbed] })
                }
                break
            case "diamond":
                switch (module) {
                    case "add":
                        economyDb.users[userIndex].diamond += quantity
                        writeDb(economyDb, db)
                        successEmbed.setDescription(desc(Emojis.diamond))
                        return await interaction.reply({ content: `${interaction.user}`, embeds: [successEmbed] })
                    case "sub":
                        if (economyDb.users[userIndex].diamond < quantity) return interaction.reply({ content: 'Você está tentando remover mais do que esse usuário tem!', ephemeral: true })
                        economyDb.users[userIndex].diamond -= quantity
                        writeDb(economyDb, db)
                        successEmbed.setDescription(desc(Emojis.diamond))
                        return interaction.reply({ content: `${interaction.user}`, embeds: [successEmbed] })

                    case "set":
                        economyDb.users[userIndex].diamond = quantity
                        writeDb(economyDb, db)
                        successEmbed.setDescription(desc(Emojis.diamond))
                        return interaction.reply({ content: `${interaction.user}`, embeds: [successEmbed] })
                }
                break
            case "nimekoin":
                switch (module) {
                    case "add":
                        economyDb.users[userIndex].nimekoin += quantity
                        writeDb(economyDb, db)
                        successEmbed.setDescription(desc(Emojis.nimekoin))
                        return await interaction.reply({ content: `${interaction.user}`, embeds: [successEmbed] })
                    case "sub":
                        if (economyDb.users[userIndex].nimekoin < quantity) return interaction.reply({ content: 'Você está tentando remover mais do que esse usuário tem!', ephemeral: true })
                        economyDb.users[userIndex].nimekoin -= quantity
                        writeDb(economyDb, db)
                        successEmbed.setDescription(desc(Emojis.nimekoin))
                        return interaction.reply({ content: `${interaction.user}`, embeds: [successEmbed] })

                    case "set":
                        economyDb.users[userIndex].nimekoin = quantity
                        writeDb(economyDb, db)
                        successEmbed.setDescription(desc(Emojis.nimekoin))
                        return interaction.reply({ content: `${interaction.user}`, embeds: [successEmbed] })
                }
                break
        }
    }
}