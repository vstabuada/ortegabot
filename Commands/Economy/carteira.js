const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const { readDb } = require("../../Data/dbFunctions")
const { read } = require("fs")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('carteira')
        .setDescription('Visualiza a sua carteira ou a carteira de alguém.')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('A pessoa que você quer ver a carteira.')
        ),
    async execute(interaction) {

        const db = './Data/economy.json'
        const economyDb = readDb(db)

        const user = interaction.options.getUser('usuario') || interaction.user

        const isInServer = function (x) {
            let result = false
            interaction.guild.members.cache.forEach(member => {
                if (member.id === x.id) return result = true
            })
            return result
        }

        if (!isInServer(user)) return interaction.reply({ content: 'Esse usuário não está no servidor!', ephemeral: true })

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

        const userWallet = economyDb.users[userIndex]


        const filteredUsers1 = users.sort(function (a, b) {
            if (a.gold > b.gold) {
                return -1
            }
            if (a.gold < b.gold) {
                return 1
            }
            return 0
        })

        const filteredUsers = filteredUsers1.filter((user) => isInServer(user))

        const rank = getUserIndex(filteredUsers) + 1

        const { emojis } = readDb()

        const walletEmbed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setTitle(`Carteira Digital`)
            .setDescription(`**${rank}#** no Ranking.`)
            .setColor('Blurple')
            .addFields(
                { name: 'Ouro:', value: `${emojis.gold} ${userWallet.gold.toLocaleString()}`, inline: true },
                { name: 'Diamantes:', value: `${emojis.diamond} ${userWallet.diamond.toLocaleString()}`, inline: true },
                { name: 'Nimekoins:', value: `${emojis.nimekoin} ${userWallet.nimekoin.toLocaleString()}`, inline: true },
            )
            .setTimestamp()

        interaction.reply({ content: `${interaction.user}`, embeds: [walletEmbed] })

    }
}