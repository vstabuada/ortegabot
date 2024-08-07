const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, ComponentType } = require("discord.js")
const { readDb, writeDb } = require("../../Data/dbFunctions")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('levelingroles')
        .setDescription('Edita os cargos de nível do servidor.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option.setName('modulo')
                .setDescription('O que você quer fazer?')
                .setRequired(true)
                .addChoices(
                    { name: 'Adicionar', value: 'add' },
                    { name: 'Remover', value: 'remove' },
                    { name: 'Editar', value: 'edit' },
                    { name: 'Listar', value: 'list' },
                )
        )
        .addRoleOption(option =>
            option.setName('cargo')
                .setDescription('Qual cargo você quer adicionar/remover/editar?')
        )
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Nível requisitado para conseguir o cargo.')
                .setMinValue(1)
                .setMaxValue(1000000)
        ),
    async execute(interaction, client) {

        const db = './Data/xp.json'
        const xpdb = readDb(db)

        const { user } = interaction
        const roles = xpdb.levelRoles

        const module = interaction.options.getString('modulo')
        const role = interaction.options.getRole('cargo')
        const level = interaction.options.getInteger('level')

        const successEmbed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setColor('Green')
            .setTimestamp()


        const checkRole = function () {
            let roleIndex = -1
            roles.forEach(x => {
                if (x.id === role.id) roleIndex = roles.indexOf(x)
            })
            return roleIndex
        }


        const checkedRole = role ? checkRole() : -1


        switch (module) {
            case "add":

                if (!role || !level) return interaction.reply({ content: 'Para adicionar um cargo você precisa selecionar o cargo e atribuir o nível dele!', ephemeral: true })
                if (checkedRole >= 0) return interaction.reply({ content: 'Esse cargo já foi adicionado antes! Se quiser mudar o nível dele pode editá-lo.', ephemeral: true })
                const newRole = {
                    id: role.id,
                    level: level
                }

                xpdb.levelRoles.push(newRole)

                const filteredRoles = xpdb.levelRoles.sort(function (a, b) {
                    if (a.level > b.level) {
                        return 1
                    }
                    if (a.level < b.level) {
                        return -1
                    }
                    return 0
                })

                xpdb.levelRoles = filteredRoles

                writeDb(xpdb, db)

                successEmbed.setTitle(`Cargo adicionado com sucesso!`)
                    .addFields(
                        { name: 'Cargo:', value: `<@&${role.id}>`, inline: true },
                        { name: 'Nível necessário:', value: `${level}`, inline: true },
                    )

                return interaction.reply({ content: `${user}`, embeds: [successEmbed] })

            case "remove":

                if (!role) return interaction.reply({ content: 'Para remover um cargo você precisa selecionar o cargo que quer remover!', ephemeral: true })
                if (checkedRole < 0) return interaction.reply({ content: 'Esse cargo não está na lista de cargos!', ephemeral: true })


                successEmbed.setTitle(`Cargo removido com sucesso!`)
                    .addFields(
                        { name: 'Cargo:', value: `<@&${xpdb.levelRoles[checkRole()].id}>`, inline: true },
                        { name: 'Nível necessário:', value: `${xpdb.levelRoles[checkRole()].level}`, inline: true },
                    )

                xpdb.levelRoles.splice(checkRole(), 1)

                writeDb(xpdb, db)


                return interaction.reply({ content: `${user}`, embeds: [successEmbed] })


            case "edit":

                if (!role || !level) return interaction.reply({ content: 'Para editar o nível necessário de um cargo você precisa selecionar o cargo e atribuir um novo nível!', ephemeral: true })
                if (checkedRole < 0) return interaction.reply({ content: 'Esse cargo não está na lista de cargos!', ephemeral: true })

                xpdb.levelRoles[checkRole()].level = level

                const filteredRoles2 = xpdb.levelRoles.sort(function (a, b) {
                    if (a.level > b.level) {
                        return 1
                    }
                    if (a.level < b.level) {
                        return -1
                    }
                    return 0
                })

                xpdb.levelRoles = filteredRoles2

                writeDb(xpdb, db)

                successEmbed.setTitle(`Cargo editado com sucesso!`)
                    .addFields(
                        { name: 'Cargo:', value: `<@&${xpdb.levelRoles[checkRole()].id}>`, inline: true },
                        { name: 'Nível necessário:', value: `${xpdb.levelRoles[checkRole()].level}`, inline: true },
                    )

                return interaction.reply({ content: `${user}`, embeds: [successEmbed] })


            case "list":

                const _MINPAGE = 1
                const _MAXPAGE = Math.ceil((roles.length) / 10) >= _MINPAGE ? Math.ceil((roles.length) / 10) : _MINPAGE

                var page = _MINPAGE

                var rolesTotais = undefined

                const rolesLength = xpdb.levelRoles.length

                function getRoles(x) {
                    var result = ''
                    if (x < 1) x = 1
                    rolesTotais = rolesLength === 1 ? `Tem apenas ${rolesLength} cargo de nível total.` : rolesLength < 1 ? `Não existem cargos de nível para listar...` : `São ${rolesLength} cargos de nível totais.`


                    for (let i = x * 10 - 9; i <= x * 10; i++) {
                        if (i > rolesLength) {
                            result = result === '' ? '*Vazio.*' : result
                        } else if (rolesLength === 0) {
                            result = ''
                        } else {
                            const mention = `<@&${roles[i - 1].id}>`
                            const id = i

                            result += `\n**${id}#** • Nível necessário: **${roles[i - 1].level.toLocaleString()}** • ${mention}`
                        }
                    }
                    result = result === '' ? '*Vazio.*' : result
                    return result
                }


                const embed = new EmbedBuilder()
                    .setAuthor(readDb().nimekai.embedAuthor)
                    .setTitle('Lista de cargos de nível')
                    .setColor('#5f00ff')
                    .setDescription(getRoles(page))
                    .setFooter({ text: `${rolesTotais} • (Página ${page}/${_MAXPAGE})` })
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

                const collector = sent.createMessageComponentCollector({ ComponentType: ComponentType.Button, time: 120_000 })

                try {

                    if (_MAXPAGE !== 1) {
                        collector.on('collect', async x => {
                            if (x.customId !== 'forward' && x.customId !== 'backward') return collector.stop()
                            if (x.user.id !== interaction.user.id) {
                                return x.reply({ content: `<@${x.user.id}> Esse botão não é para você! Mas você pode ver também usando \`/rankeconomia\`.`, ephemeral: true })
                            }

                            if (x.customId === 'backward') {
                                if (page === _MINPAGE) {
                                    page = _MAXPAGE
                                } else {
                                    page = page - 1
                                }

                                embed.setDescription(getRoles(page))

                                await x.update({ embeds: [embed.setDescription(getRoles(page)).setFooter({ text: `${rolesTotais} • (Página ${page}/${_MAXPAGE})` })] })


                            } else if (x.customId === 'forward') {

                                if (page >= _MAXPAGE) {
                                    page = _MINPAGE
                                } else {
                                    page = page + 1
                                }

                                await x.update({ embeds: [embed.setDescription(getRoles(page)).setFooter({ text: `${rolesTotais} • (Página ${page}/${_MAXPAGE})` })] })
                            }
                        })

                    }
                } catch (e) {
                    return collector.stop()
                }
        }

    }
}