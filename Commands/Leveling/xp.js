const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js")
const { readDb } = require("../../Data/dbFunctions")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('xp')
        .setDescription('Visualiza seu card de experiência do servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('A pessoa que você quer ver o card de experiência.')
        ),
    async execute(interaction) {

        const db = './Data/xp.json'
        const xpdb = readDb(db)

        const user = interaction.options.getUser('usuario') || interaction.user
        const users = xpdb.users

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
                if (x.id === user.id) userIndex = xpdb.users.indexOf(x)
            })
            return userIndex
        }

        if (getUserIndex(users) === undefined) return interaction.reply({ content: `Esse usuário não tem XP ainda!`, ephemeral: true })

        const userIndex = getUserIndex(users)

        const userData = xpdb.users[userIndex]


        const filteredUsers1 = users.sort(function (a, b) {
            if (a.xp > b.xp) {
                return -1
            }
            if (a.xp < b.xp) {
                return 1
            }
            return 0
        })




        const filteredUsers = filteredUsers1.filter((user) => isInServer(user))

        const rank = getUserIndex(filteredUsers) + 1


        const xpEmbed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setTitle(`Card de XP`)
            .setDescription(`**${rank}#** no Ranking.`)
            .setColor('#00aa66')
            .addFields(
                { name: 'Nível:', value: `<a:estrela_nk:1169426803459379231> __**${userData.lvl.toLocaleString()}**__`, inline: true },
                { name: 'Experiência:', value: `:sparkles: \`${userData.xp.toLocaleString()}\``, inline: true },
            )
            .setTimestamp()



        interaction.reply({ content: `${interaction.user}`, embeds: [xpEmbed] })

    }
}