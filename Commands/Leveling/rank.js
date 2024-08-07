const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType } = require("discord.js")
const { readDb } = require("../../Data/dbFunctions")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank')
        .setDescription('Visualiza o Ranking de XP do servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .addIntegerOption(option =>
            option.setName('pagina')
                .setDescription('Página do Ranking de economia.')
                .setMinValue(1)
        ),
    async execute(interaction) {

        const db = './Data/xp.json'
        const xpdb = readDb(db)

        const user = interaction.user
        const users = xpdb.users
        const usersLength = users.length

        const filteredUsers1 = users.sort(function (a, b) {
            if (a.xp > b.xp) {
                return -1
            }
            if (a.xp < b.xp) {
                return 1
            }
            return 0
        })


        const isInServer = function (x) {
            let result = false
            interaction.guild.members.cache.forEach(member => {
                if (member.id === x.id) return result = true
            })
            return result
        }


        const filteredUsers = filteredUsers1.filter((user) => isInServer(user))

        const filteredUsersLength = filteredUsers.length

        // const clearLeftUsers = function () {
        //     interaction.guild.members.cache.forEach(member => {
        //         if (!interaction.guild.members.fetch(member.id)) {
        //             if (xpdb.users.indexOf(member.id) >= 0) {
        //                 xpdb.users.splice(xpdb.users.indexOf(member.id), 1)
        //             }
        //         }
        //     })
        // }


        const _MINPAGE = 1
        const _MAXPAGE = Math.ceil((filteredUsersLength - 1) / 10) >= _MINPAGE ? Math.ceil((filteredUsersLength - 1) / 10) : _MINPAGE

        var page = typeof interaction.options.getInteger('pagina') === "number" && interaction.options.getInteger('pagina') <= _MAXPAGE ? interaction.options.getInteger('pagina') : _MINPAGE

        var usersTotais = undefined

        function getUsers(x) {
            var result = ''
            if (x < 1) x = 1
            usersTotais = filteredUsersLength - 1 === 1 ? `É apenas ${filteredUsersLength - 1} usuário total no ranking.` : filteredUsersLength - 1 < 1 ? `Não existem usuários para listar...` : `São ${filteredUsersLength - 1} usuários totais no ranking.`

            function isYou(str, x) {
                if (filteredUsers[x].id === user.id) {
                    return str + ` **(Você)**`
                } else {
                    return str
                }
            }
            for (let i = x * 10 - 9; i <= x * 10; i++) {
                if (i >= filteredUsersLength) {
                    result = result === '' ? '*Vazio.*' : result
                } else if (filteredUsersLength === 0) {
                    result = ''
                } else {
                    const mention = `<@${filteredUsers[i - 1].id}>`
                    const id = i

                    result = result + isYou(`\n**${id}#** • Nível: __**${filteredUsers[i - 1].lvl.toLocaleString()}**__ • ${mention}`, i - 1) // <a:estrela_nk:1169426803459379231>
                }
            }
            result = result === '' ? '*Vazio.*' : result
            return result
        }


        const embed = new EmbedBuilder()
            .setAuthor({ name: '⋆ 🌸 Nimekai 🌸 ⋆', iconURL: 'https://i.imgur.com/EMV93sU.gif' })
            .setTitle('Ranking de XP')
            .setColor('#5f00ff')
            .setDescription(getUsers(page))
            .setFooter({ text: `${usersTotais} • (Página ${page}/${_MAXPAGE})` })
            .setTimestamp()

        const backward = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('1248682961469964388')
            .setCustomId('backward')

        const forward = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('1248682290297700362')
            .setCustomId('forward')

        const row = new ActionRowBuilder()
            .addComponents([backward, forward])


        const sent = await interaction.reply({ content: `${user}`, embeds: [embed], components: _MAXPAGE === 1 ? [] : [row] })

        const collector = sent.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120_000 })

        try {

            if (_MAXPAGE !== 1) {
                collector.on('collect', async x => {
                    if (x.customId !== 'forward' && x.customId !== 'backward') return collector.stop()
                    if (x.user.id !== interaction.user.id) {
                        return x.reply({ content: `<@${x.user.id}> Esse botão não é para você! Mas você pode ver também usando \`/rank\`.`, ephemeral: true })
                    }

                    if (x.customId === 'backward') {
                        if (page === _MINPAGE) {
                            page = _MAXPAGE
                        } else {
                            page = page - 1
                        }

                        embed.setDescription(getUsers(page))

                        await x.update({ embeds: [embed.setDescription(getUsers(page)).setFooter({ text: `${usersTotais} • (Página ${page}/${_MAXPAGE})` })] })


                    } else if (x.customId === 'forward') {

                        if (page >= _MAXPAGE) {
                            page = _MINPAGE
                        } else {
                            page = page + 1
                        }

                        await x.update({ embeds: [embed.setDescription(getUsers(page)).setFooter({ text: `${usersTotais} • (Página ${page}/${_MAXPAGE})` })] })
                    }
                })

            }
        } catch (e) {
            return collector.stop()
        }



    }
}