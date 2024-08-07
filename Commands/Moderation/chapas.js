const { Events, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Embed, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentBuilder, ActionRow, ComponentType, time } = require("discord.js")
const { readDb, writeDb } = require('../../Data/dbFunctions.js')
const { readFile, write } = require("fs")
const db = './Data/chapas.json'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chapas')
        .setDescription('Ferramentas das chapas.')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .addSubcommand(subcommand =>
            subcommand
                .setName('criar')
                .setDescription('Registra uma nova chapa.')
                .addStringOption(option =>
                    option.setName('nome')
                        .setDescription('Nome da chapa, nomes maliciosos causarão punições!')
                        .setMaxLength(24)
                        .setMinLength(4)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('cor')
                        .setDescription('Escolha a cor da chapa!')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Vermelho', value: '#ff0000' },
                            { name: 'Verde', value: '#00ff00' },
                            { name: 'Azul', value: '#0000ff' },
                            { name: 'Rosa', value: '#ff5b77' },
                            { name: 'Amarelo', value: '#ffff00' },
                            { name: 'Ciano', value: '#00ffff' },
                            { name: 'Roxo', value: '#5f00ff' },
                            { name: 'Laranja', value: '#ff6600' },
                            { name: 'Marrom', value: '#674000' },
                            { name: 'Bege', value: '#dac8b3' },
                            { name: 'Roxo Claro', value: '#b3b6da' },
                        ))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('excluir')
                .setDescription('Exclui sua própria chapa, você tem que ser presidente de uma chapa para poder excluí-la!')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('convidar')
                .setDescription('Convide um membro para sua chapa!')
                .addUserOption(option =>
                    option.setName('usuario')
                        .setDescription('O membro que será convidado para sua chapa.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sair')
                .setDescription('Sai da sua chapa, você não pode ser presidente dela!')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('info')
                .setDescription('Mostra as informações de uma chapa específica, ou da sua chapa.')
                .addNumberOption(option =>
                    option.setName('id')
                        .setDescription('Diga o ID da chapa que você quer ver as informações.')
                        .setMinValue(1)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('lista')
                .setDescription('Lista todas as chapas existentes.')
                .addIntegerOption(option =>
                    option.setName('pagina')
                        .setDescription('Escolha uma página da lista para ver.')
                        .setMinValue(1)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('transferir')
                .setDescription('Transfere a posse de presidente da sua chapa para outra pessoa.')
                .addUserOption(option =>
                    option.setName('alvo')
                        .setDescription('O usuário que receberá a posse de presidente da sua chapa.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('promover')
                .setDescription('Promove um integrante ao cargo de vice-presidente da sua chapa.')
                .addUserOption(option =>
                    option.setName('alvo')
                        .setDescription('O usuário que será promovido ao cargo de vice-presidente da sua chapa.')
                        .setRequired(true)
                )
        ),

    async execute(interaction, client) {
        const userMention = `<@${interaction.user.id}>`

        // Filtro de usuários banidos

        //lista de usuários banidos:
        const banido = []

        if (banido.indexOf(interaction.user.id) >= 0) return interaction.reply({
            content: `${userMention} Você está **banido** do sistema de chapas! ❌\nContate o suporte por meio do chat <#1205673349150150736> para mais informações.`,
            ephemeral: true
        })

        // Filtro de chat permitido

        const allowedChannels = ["1169062334313021440", "1178020973820248114"]
        let allowedChannelsFeedback = ``
        allowedChannels.forEach(x => {
            allowedChannelsFeedback = allowedChannelsFeedback + `\n<#${x}>`
        })

        if (allowedChannels.indexOf(interaction.channel.id) < 0) return interaction.reply({
            content: `${userMention} Você não pode usar esse comando aqui! Tente em um desses canais:${allowedChannelsFeedback}`,
            ephemeral: true
        })

        // Constantes importantes

        const obj1 = readDb(db)
        const subcommand = interaction.options.getSubcommand()
        const chapas = obj1.chapas
        const user = interaction.user

        // Verificação se a cor passada é um código HEX

        if (subcommand === "criar") {

            const nome = interaction.options.getString('nome')
            const cor = interaction.options.getString('cor') || '#ffffff'
            const presidente = interaction.user.id
            const vice = null
            const errorEmbed = new EmbedBuilder().setColor('#ff0000')

            if (obj1.managing.indexOf(interaction.user.id) >= 0) return interaction.reply({ content: 'Você ainda tem uma interação de gerenciamento de chapa em andamento! Tente novamente em um minuto.', ephemeral: true })


            let nameAlreadyTaken


            chapas.forEach(x => {
                if (x.nome.toLowerCase() == nome.toLowerCase()) return nameAlreadyTaken = true
            })

            if (nameAlreadyTaken) return interaction.reply({ content: `${userMention} Já existe uma chapa com esse nome!`, ephemeral: true })


            const alpnumRegex = new RegExp('[^A-Za-z0-9 ]')

            if (alpnumRegex.test(nome)) return interaction.reply({ content: `${userMention} O nome da chapa pode conter apenas letras, números e espaços!`, ephemeral: true })


            var YouAlreadyPre = false
            var YouAlreadyVic = false
            var YouAlreadyInChapa = false

            chapas.forEach(x => {
                if (x.presidente === interaction.user.id) return YouAlreadyPre = true
            })

            chapas.forEach(x => {
                if (x.vicepresidente === interaction.user.id) return YouAlreadyVic = true
            })

            chapas.forEach(x => {
                for (i = 1; i < x.integrantes.length; i++) {
                    if (x.integrantes[i - 1] === interaction.user.id) return YouAlreadyInChapa = true
                }
            })

            // Feedbacks dos filtros

            if (YouAlreadyPre) return interaction.reply({
                content: userMention,
                embeds: [errorEmbed.setTitle('Você já é presidente de uma chapa!').setDescription('Se quiser criar outra chapa renuncie seu cargo de presidente ou exclua sua chapa primeiro.')],
                ephemeral: true
            })

            if (YouAlreadyVic) return interaction.reply({
                content: userMention,
                embeds: [errorEmbed.setTitle('Você já é vice-presidente de uma chapa!').setDescription('Se quiser criar outra chapa renuncie seu cargo de vice-presidente primeiro.')],
                ephemeral: true
            })

            if (YouAlreadyInChapa) return interaction.reply({
                content: userMention,
                embeds: [errorEmbed.setTitle('Você já está em uma chapa!').setDescription('Saia da sua chapa primeiro se quiser criar uma.')],
                ephemeral: true
            })

            const confirmEmbed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setColor('#555555')
                .setTitle('Você aceita os termos de chapa?')
                .setDescription(`
                Termos de chapa.\n
                \n1 - O nome de sua chapa não pode ser malicioso ou prejudicial, não pode ter conotações sexuais, ser imoral ou ter apologia política.
                \n2 - A sua chapa deve seguir os requisitos para se candidatar ao conselho estudantil: Ter vice-presidente, ter ao menos 4 integrantes para serem distruídos entre 3 cargos de diretor e 1 secretário.
                \n3 - Você deve manter atividade para não ter sua chapa excluída.
                \n4 - A sua chapa pode ser excluída a qualquer momento caso seja encontrada alguma infração pela Staff, você será notificado do motivo.
                \n5 - Você pode ser banido permanentemente do sistema de chapas se quebrar os termos!
                `)
                .setFooter({ text: 'Esses são termos obrigatórios, se não aceitar não poderá ter uma chapa!' })

            const aceitar = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel('Aceitar')
                .setEmoji('✅')
                .setCustomId('aceitar')

            const recusar = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel('Recusar')
                .setEmoji('✖')
                .setCustomId('recusar')

            const row = new ActionRowBuilder()
                .addComponents([aceitar, recusar])


            const sent = await interaction.reply({
                content: userMention,
                embeds: [confirmEmbed],
                components: [row],
                ephemeral: true
            })

            const collectorFilter = x => x.user.id === interaction.user.id

            let creationDate = null

            try {

                obj1.managing.push(interaction.user.id)
                writeDb(obj1, db)


                const confirmation = await sent.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })

                if (confirmation.customId === 'aceitar') {
                    creationDate = new Date()

                    const chapa = {
                        "id": null,
                        "nome": nome,
                        "cor": cor,
                        "presidente": presidente,
                        "vicepresidente": vice,
                        "integrantes": [],
                        "creationDate": creationDate.getTime()
                    }

                    const id = obj1.currentId + 1
                    obj1.currentId++
                    chapa.id = id
                    obj1.chapas.push(chapa)

                    const successEmbed = new EmbedBuilder()
                        .setAuthor({ name: 'Chapa criada com sucesso!', iconURL: 'https://i.imgur.com/6w0EB9X.png' })
                        .setTitle(nome)
                        .setColor(cor)
                        .addFields(
                            { name: 'Presidente:', value: userMention },
                            { name: 'Vice-presidente:', value: '*Nenhum*' },
                            { name: 'Integrantes:', value: '*Nenhum*' },
                        )
                        .setFooter({ text: `ID: ${id} - Criado ${creationDate.toLocaleString()}` })


                    await confirmation.update({ content: `${userMention} Parabéns, sua chapa foi criada com sucesso! hihi`, embeds: [successEmbed], components: [] })


                    obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                    return writeDb(obj1, db)

                } else if (confirmation.customId === 'recusar') {
                    obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                    writeDb(obj1, db)
                    return await confirmation.update({ content: `${userMention} Sua chapa foi cancelada.`, embeds: [], components: [] })

                }
            } catch (e) {
                obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                writeDb(obj1, db)
                await interaction.editReply({ content: 'Cancelado, demorou demais!', embeds: [], components: [], ephemeral: true })
            }



        } else if (subcommand === "excluir") {

            if (obj1.managing.indexOf(interaction.user.id) >= 0) return interaction.reply({ content: 'Você ainda tem uma interação de gerenciamento de chapa em andamento! Tente novamente em um minuto.', ephemeral: true })

            var hasChapa = false

            chapas.forEach(x => {
                if (x.presidente === interaction.user.id) return hasChapa = true
            })

            if (!hasChapa) return interaction.reply({
                content: `${userMention} Você não é presidente de uma chapa! ❌`,
                ephemeral: true
            })

            else {
                var chapaId = undefined
                chapas.forEach(x => {
                    if (x.presidente === interaction.user.id) return chapaId = chapas.indexOf(x)
                })
                if (!chapaId) return interaction.reply('Algo deu errado.')
                else {

                    const deleteEmbed = new EmbedBuilder()
                        .setTitle('Chapa excluída com sucesso!')
                        .setDescription(`A chapa **${chapas[chapaId].nome}** foi excluída com sucesso!`)
                        .setColor('#00ff00')


                    const confirmEmbed = new EmbedBuilder()
                        .setTitle(`Tem certeza que deseja excluir a sua chapa? (${chapas[chapaId].nome})`)
                        .setDescription('Isso não poderá ser revertido depois!!!')
                        .setColor('#ff0000')

                    const excluir = new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel('Sim, exclua!')
                        .setEmoji('🗑️')
                        .setCustomId('excluir')

                    const cancelar = new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setLabel('Cancelar')
                        .setCustomId('cancelar')



                    const row = new ActionRowBuilder()
                        .addComponents([excluir, cancelar])


                    const sent = await interaction.reply({ content: userMention, embeds: [confirmEmbed], components: [row], ephemeral: true })


                    const collectorFilter = x => x.user.id === interaction.user.id

                    try {
                        obj1.managing.push(interaction.user.id)
                        const confirmation = await sent.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })

                        if (confirmation.customId === 'excluir') {
                            await confirmation.update({ content: userMention, embeds: [deleteEmbed], components: [] })

                            obj1.chapas.splice(chapaId, 1)

                            // obj1.chapas.forEach(x => {
                            //     x.id = obj1.chapas.indexOf(x)
                            // })

                            // organizar id de cada chapa!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                            obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)

                            return writeDb(obj1, db)
                        } else if (confirmation.customId === 'cancelar') {
                            obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                            writeDb(obj1, db)
                            return await confirmation.update({ content: `${userMention} A exclusão foi cancelada.`, embeds: [], components: [] })
                        }
                    } catch (e) {
                        obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                        writeDb(obj1, db)
                        await interaction.editReply({ content: 'Cancelado, demorou demais!', ephemeral: true })
                    }
                }
            }
        } else if (subcommand === "convidar") {

            const target = interaction.options.getUser('usuario')
            const targetMention = `<@${target.id}>`

            if (target.id === '1119652468373065820') return interaction.reply({ content: `<@${interaction.user.id}> Desculpa, vou ter que recusar! Não posso fazer parte de chapas...`, ephemeral: true })
            if (target.bot) return interaction.reply({ content: `<@${interaction.user.id}> Você não pode convidar BOTs para participarem de chapas! ❌`, ephemeral: true })

            if (obj1.liveInvites.indexOf(interaction.user.id) >= 0) return interaction.reply({ content: 'Você ainda tem um convite em andamento! Tente novamente em um minuto.', ephemeral: true })
            if (obj1.liveInvites.indexOf(target.id) >= 0) return interaction.reply({ content: `${targetMention} já tem um convite em andamento! Tente novamente em um minuto.`, ephemeral: true })

            if (obj1.managing.indexOf(interaction.user.id) >= 0) return interaction.reply({ content: 'Você ainda tem uma interação de gerenciamento de chapa em andamento! Tente novamente em um minuto.', ephemeral: true })
            if (obj1.managing.indexOf(target.id) >= 0) return interaction.reply({ content: `${targetMention} já tem uma interação de gerenciamento de chapa em andamento! Tente novamente em um minuto.`, ephemeral: true })


            var temChapa = undefined

            chapas.forEach(x => {
                if (x.presidente === interaction.user.id) return temChapa = true
            })

            if (!temChapa) return interaction.reply({
                content: `${userMention} Você não é presidente de uma chapa! ❌`,
                ephemeral: true
            })

            var targetInChapa = false

            chapas.forEach(x => {
                x.integrantes.forEach(y => {
                    if (target.id === y) return targetInChapa = true
                })
                if (target.id === x.presidente) return targetInChapa = true
                if (target.id === x.vicepresidente) return targetInChapa = true
            })

            if (targetInChapa) return interaction.reply({ content: `${userMention} Você não pode convidar membros que já estão em uma chapa!`, ephemeral: true })

            var idChapa = undefined

            chapas.forEach(x => {
                if (x.presidente === interaction.user.id) return idChapa = x.id
            })

            if (!idChapa) return interaction.reply('Algo deu errado.')


            var integrantesField = undefined

            if (chapas[idChapa].integrantes.length > 0) {
                integrantesField = ''
                chapas[idChapa].integrantes.forEach(x => {
                    integrantesField = integrantesField + `\n<@${x}>`
                })
            } else {
                integrantesField = '*Nenhum*'
            }


            const confirmEmbed = new EmbedBuilder()
                .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
                .setColor('#555555')
                .setDescription(`${userMention} Convidou você para participar de sua chapa, você aceita?`)


            const aceito = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel('Aceitar')
                .setEmoji('✅')
                .setCustomId('aceito')

            const recuso = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Recusar')
                .setEmoji('✖')
                .setCustomId('recuso')

            const row = new ActionRowBuilder()
                .addComponents([aceito, recuso])

            const intSuccessEmbed = new EmbedBuilder()
                .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
                .setTitle(`Parabéns, agora você faz parte de uma chapa!`)
                .setColor('#00ff00')
                .addFields(
                    { name: 'Nome da chapa:', value: chapas[idChapa].nome },
                    { name: 'Presidente:', value: `<@${chapas[idChapa].presidente}>` },
                )
                .setFooter({ text: `ID: ${idChapa.toString()}` })

            if (chapas[idChapa].vicepresidente === null) {
                intSuccessEmbed.addFields(
                    { name: 'Vice-presidente:', value: `*Nenhum*` }
                )
            } else {
                intSuccessEmbed.addFields(
                    { name: 'Vice-presidente:', value: `<@${chapas[idChapa].vicepresidente}>` }
                )
            }


            let vice = `<@${chapas[idChapa].vicepresidente}>`

            if (chapas[idChapa].vicepresidente === null) vice = '*Nenhum*'



            if (chapas[idChapa].integrantes.length > 0) {
                intSuccessEmbed.addFields(
                    { name: 'Integrantes:', value: integrantesField }
                )
            } else {
                intSuccessEmbed.addFields(
                    { name: 'Integrantes:', value: `${targetMention} (Você)` }
                )
            }


            var integrantesConfirm = ''


            if (chapas[idChapa].integrantes.length > 0) {
                integrantesConfirm = ''
                chapas[idChapa].integrantes.forEach(x => {
                    integrantesConfirm = integrantesConfirm + `\n<@${x}>`
                })
                integrantesConfirm = integrantesConfirm + `\n${targetMention} (Você vai ser atribuído a esse cargo)`
            } else {
                integrantesConfirm = `*Nenhum* (Você vai ser atribuído a esse cargo)`
            }


            confirmEmbed.addFields(
                { name: 'Nome da chapa:', value: chapas[idChapa].nome },
                { name: 'Presidente:', value: `<@${chapas[idChapa].presidente}>` },
                { name: 'Vice-presidente:', value: vice },
                { name: 'Integrantes:', value: integrantesConfirm }
            )
                .setFooter({ text: `ID: ${idChapa.toString()}` })


            const sent = await interaction.reply({ content: targetMention, embeds: [confirmEmbed], components: [row] })

            const collectorFilter = x => x.user.id === target.id

            try {
                obj1.liveInvites.push(interaction.user.id, target.id)
                obj1.managing.push(interaction.user.id, target.id)
                writeDb(obj1, db)


                const confirmation = await sent.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })

                if (confirmation.customId === 'aceito') {

                    await confirmation.update({ content: targetMention, embeds: [intSuccessEmbed], components: [] })

                    obj1.liveInvites.splice(obj1.liveInvites.indexOf(interaction.user.id), 1)
                    obj1.liveInvites.splice(obj1.liveInvites.indexOf(target.id), 1)
                    obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                    obj1.managing.splice(obj1.managing.indexOf(target.id), 1)

                    obj1.chapas[idChapa].integrantes.push(target.id)

                    return writeDb(obj1, db)

                } else if (confirmation.customId === 'recuso') {
                    obj1.liveInvites.splice(obj1.liveInvites.indexOf(interaction.user.id), 1)
                    obj1.liveInvites.splice(obj1.liveInvites.indexOf(target.id), 1)
                    obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                    obj1.managing.splice(obj1.managing.indexOf(target.id), 1)
                    writeDb(obj1, db)
                    return await confirmation.update({ content: `${userMention} Seu convite foi recusado por **${target.username}**.`, embeds: [], components: [] })
                }
            } catch (e) {
                obj1.liveInvites.splice(obj1.liveInvites.indexOf(interaction.user.id), 1)
                obj1.liveInvites.splice(obj1.liveInvites.indexOf(target.id), 1)
                obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                obj1.managing.splice(obj1.managing.indexOf(target.id), 1)
                writeDb(obj1, db)
                await interaction.editReply({ content: 'Convite cancelado, demorou demais para responder!', embeds: [], components: [] })
            }


        } else if (subcommand === "sair") {
            const user = interaction.user
            const userMention = `<@${user.id}>`
            var chapaID = undefined
            var isPresident = undefined


            if (obj1.managing.indexOf(interaction.user.id) >= 0) return interaction.reply({ content: 'Você ainda tem uma interação de gerenciamento de chapa em andamento! Tente novamente em um minuto.', ephemeral: true })

            chapas.forEach(x => {
                if (x.integrantes.indexOf(user.id) >= 0) return chapaID = [x.id, "integrante"]
                if (x.vicepresidente === user.id) return chapaID = [x.id, "vice"]
                if (x.presidente === user.id) return isPresident = true
            })

            if (isPresident) return interaction.reply({ content: 'Você não pode sair da sua própria chapa! Ao invés disso use `/chapas excluir`.', ephemeral: true })
            if (!chapaID || chapaID.length < 2) return interaction.reply({ content: `<@${user.id}> Você não está em nenhuma chapa!`, ephemeral: true })

            const confirmationEmbed = new EmbedBuilder()
                .setTitle('Você tem certeza que quer sair da sua chapa?')
                .setDescription('Você não poderá voltar para a chapa a menos que o presidente te convide novamente!')
                .setColor('#ff0000')

            const sim = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel('Sim')
                .setEmoji('✅')
                .setCustomId('sim')

            const nao = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel('Não')
                .setEmoji('✖')
                .setCustomId('nao')

            const row = new ActionRowBuilder()
                .addComponents([sim, nao])


            const sent = await interaction.reply({ content: userMention, embeds: [confirmationEmbed], components: [row], ephemeral: true })

            const collectorFilter = x => x.user.id === user.id


            try {
                obj1.managing.push(interaction.user.id)
                writeDb(obj1, db)

                const confirmation = await sent.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })

                if (confirmation.customId === 'sim') {
                    const dono = obj1.chapas[chapaID[0]].presidente
                    switch (chapaID[1]) {
                        case "integrante":
                            obj1.chapas[chapaID[0]].integrantes.splice(obj1.chapas[chapaID[0]].integrantes.indexOf(user.id), 1)

                            client.users.send(dono, { content: `O integrante '**${interaction.user.username}**' saiu da sua chapa!` })

                            break
                        case "vice":
                            obj1.chapas[chapaID[0]].vicepresidente = null

                            client.users.send(dono, { content: `O vice-presidente '**${interaction.user.username}**' saiu da sua chapa!` })

                            break
                    }

                    await confirmation.update({ content: `${userMention} Você saiu da chapa com sucesso!`, embeds: [], components: [] })

                    obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)

                    return writeDb(obj1, db)
                } else if (confirmation.customId === 'nao') {
                    obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                    writeDb(obj1, db)
                    return await confirmation.update({ content: `Cancelado.`, embeds: [], components: [] })
                }
            } catch (e) {
                obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                writeDb(obj1, db)
                await interaction.editReply({ content: 'Cancelado, demorou demais para responder!', embeds: [], components: [] })
            }


        } else if (subcommand === "info") {

            const user = interaction.user

            var infoIndex = false
            var userRole = undefined

            chapas.forEach(x => {
                if (x.integrantes.indexOf(user.id) >= 0) {
                    infoIndex = x.id
                    userRole = ["integrante", x.integrantes.indexOf(user.id)]
                }
                if (x.vicepresidente === user.id) {
                    infoIndex = x.id
                    userRole = ["vice-presidente", 0]
                }
                if (x.presidente === user.id) {
                    infoIndex = x.id
                    userRole = ["presidente", 0]
                }
            })

            var infoID = undefined
            if (interaction.options.getNumber('id')) {
                infoID = interaction.options.getNumber('id')
            } else if (infoIndex) {
                infoID = infoIndex
            } else {
                return interaction.reply({ content: `${userMention} Você não tem uma chapa para ver as informações, especifique uma!`, ephemeral: true })
            }

            const checkId = function (id) {
                let exists = false
                chapas.forEach(x => {
                    if (x.id === id) exists = true
                })
                return exists
            }

            const idExist = checkId(infoID)

            if (!idExist) return interaction.reply({ content: `${userMention} Essa chapa não existe.`, ephemeral: true })

            const getIndex = function (id) {
                let index
                chapas.forEach(x => {
                    if (x.id === id) index = chapas.indexOf(x)
                })
                return index
            }

            infoID = getIndex(infoID)

            if (!infoID) return interaction.reply({ content: 'Algo deu errado!', ephemeral: true }).then(console.log('Não foi possível encontrar o ID! Linha 730 (chapas.js)'))

            const creationDate = new Date().setTime(chapas[infoID].creationDate)

            var integrantes = undefined



            if (chapas[infoID].integrantes.length > 0) {
                integrantes = ''

                chapas[infoID].integrantes.forEach(x => {
                    integrantes = integrantes + `\n<@${x}>`
                })
            } else {
                integrantes = `*Nenhum*`
            }

            var vicepre = undefined
            if (chapas[infoID].vicepresidente === null) {
                vicepre = `*Nenhum*`
            } else {
                vicepre = `<@${chapas[infoID].vicepresidente}>`
            }

            const resultEmbed = new EmbedBuilder()
                .setTitle(chapas[infoID].nome)
                .setColor(chapas[infoID].cor)
                .setFooter({ text: `ID: ${chapas[infoID].id} - Data de Criação` })
                .setTimestamp(creationDate)
                .addFields(
                    { name: 'Presidente:', value: `<@${chapas[infoID].presidente}>` },
                    { name: 'Vice-presidente:', value: vicepre },
                    { name: 'Integrantes:', value: integrantes }
                )


            if (chapas[infoID].integrantes.indexOf(interaction.user.id) >= 0 || chapas[infoID].presidente === interaction.user.id || chapas[infoID].vicepresidente === interaction.user.id) {
                resultEmbed.setDescription(`Você é **${userRole[0]}** dessa chapa!`)
                interaction.reply({ content: userMention, embeds: [resultEmbed] })

            } else {
                interaction.reply({ content: userMention, embeds: [resultEmbed] })
            }
        } else if (subcommand === "lista") {

            const _MINPAGE = 1
            const _MAXPAGE = Math.ceil((chapas.length - 1) / 10) >= _MINPAGE ? Math.ceil((chapas.length - 1) / 10) : _MINPAGE

            var page = typeof interaction.options.getInteger('pagina') === "number" && interaction.options.getInteger('pagina') <= _MAXPAGE ? interaction.options.getInteger('pagina') : _MINPAGE

            var chapasTotais = undefined

            function getChapas(x) {
                var result = ''
                if (x < 1) x = 1
                chapasTotais = chapasLength - 1 === 1 ? `É apenas ${chapasLength - 1} chapa total.` : chapasLength - 1 < 1 ? `Não tem chapas para listar...` : `São ${chapasLength - 1} chapas totais.`
                function hasVice(x) {
                    return chapas[x].vicepresidente !== null ? 1 : 0
                }
                function isYou(str, x) {
                    if (chapas[x].integrantes.indexOf(user.id) >= 0 || chapas[x].vicepresidente === user.id || chapas[x].presidente === user.id) {
                        return str + ` **(Sua chapa)**`
                    } else {
                        return str
                    }
                }
                for (let i = x * 10 - 9; i <= x * 10; i++) {
                    if (i >= chapas.length) {
                        result = result === '' ? '*Vazio.*' : result
                    } else if (chapas.length === 1) {
                        result = ''
                    } else {
                        const nome = chapas[i].nome
                        const id = chapas[i].id
                        const membros = (chapas[i].integrantes.length + hasVice(i) + 1) > 1 ? `${chapas[i].integrantes.length + hasVice(i) + 1} Membros.` : `${chapas[i].integrantes.length + hasVice(i) + 1} Membro.`
                        result = result + isYou(`\n**${id}#** • __${nome}__ • *${membros}*`, i)
                    }
                }
                result = result === '' ? '*Vazio.*' : result
                return result
            }

            const chapasLength = chapas.length

            const embed = new EmbedBuilder()
                .setAuthor({ name: 'Conselho Estudantil no Nimekai ©️', iconURL: 'https://i.pinimg.com/originals/a1/64/ad/a164ad44d01db00787fc223cd45c1b6e.jpg' })
                .setTitle('Lista de chapas do Conselho Estudantil')
                .setColor('#5f00ff')
                .setDescription(getChapas(page))
                .setFooter({ text: `${chapasTotais} • (Página ${page}/${_MAXPAGE})` })

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


            const sent = await interaction.reply({ content: userMention, embeds: [embed], components: _MAXPAGE === 1 ? [] : [row] })

            const collector = sent.createMessageComponentCollector({ componentType: ComponentType.Button, time: 120_000 })

            try {

                if (_MAXPAGE !== 1) {
                    collector.on('collect', async x => {
                        if (x.customId !== 'forward' && x.customId !== 'backward') return collector.stop()
                        if (x.user.id !== interaction.user.id) {
                            return x.reply({ content: `<@${x.user.id}> Esse botão não é para você! Mas você pode ver também usando \`/chapas lista\`.`, ephemeral: true })
                        }

                        if (x.customId === 'backward') {
                            if (page === _MINPAGE) {
                                page = _MAXPAGE
                            } else {
                                page = page - 1
                            }

                            embed.setDescription(getChapas(page))

                            await x.update({ embeds: [embed.setDescription(getChapas(page)).setFooter({ text: `São ${chapasLength - 1} chapas totais. • (Página ${page}/${_MAXPAGE})` })] })


                        } else if (x.customId === 'forward') {

                            if (page >= _MAXPAGE) {
                                page = _MINPAGE
                            } else {
                                page = page + 1
                            }

                            await x.update({ embeds: [embed.setDescription(getChapas(page)).setFooter({ text: `São ${chapasLength - 1} chapas totais. • (Página ${page}/${_MAXPAGE})` })] })
                        }
                    })

                }
            } catch (e) {
                return collector.stop()
            }

        } else if (subcommand === "transferir") {
            const target = interaction.options.getUser('alvo')
            const targetMention = `<@${target.id}>`
            const user = interaction.user
            const userMention = `<@${user.id}>`


            if (obj1.managing.indexOf(interaction.user.id) >= 0) return interaction.reply({ content: 'Você ainda tem uma interação de gerenciamento de chapa em andamento! Tente novamente em um minuto.', ephemeral: true })
            if (obj1.managing.indexOf(target.id) >= 0) return interaction.reply({ content: `${targetMention} já tem uma interação de gerenciamento de chapa em andamento! Tente novamente em um minuto.`, ephemeral: true })


            if (target.bot) return interaction.reply({ content: 'Você não pode passar a liderança para um BOT.', ephemeral: true })

            let targetHasChapa

            obj1.chapas.forEach(x => {
                if (x.presidente === target.id) targetHasChapa = true
                if (x.vicepresidente === target.id) targetHasChapa = true
                if (x.integrantes.indexOf(target.id) >= 0) targetHasChapa = true
            })

            if (targetHasChapa) return interaction.reply({ content: `${userMention} Você não pode transferir sua chapa para quem já tem uma chapa!`, ephemeral: true })

            function getChapa(user, chapas) {
                let userChapa

                chapas.forEach(chapa => {
                    if (chapa.presidente === user.id) return userChapa = chapa.id
                })

                if (userChapa > 0 && userChapa <= chapas.length) {
                    return userChapa
                } else {
                    return userChapa = null
                }
            }

            const chapaID = getChapa(user, chapas)

            if (chapaID === null) return interaction.reply({ content: 'Você não é presidente de uma chapa!', ephemeral: true })

            const chapa = chapas[chapaID]





            const confirmationEmbed = new EmbedBuilder()
                .setTitle(`Você tem certeza que deseja tornar '${user.username}' dono e presidente da sua chapa?`)
                .setDescription(`Essa é uma ação irreversível! Depois de passar a posse e a presidência da sua chapa você nunca mais pode recuperá-la a menos que o mesmo transfira a posse de volta para você.
                    \nCuidado, você pode estar sendo enganado e se continuar concorda com o risco.`)
                .setColor('#ff0000')
                .setFooter({ text: `ID da Chapa: ${chapa.id} • Use o comando "/chapas info id:${chapa.id}" para mais detalhes.` })

            const confirmar = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel('Confirmar')
                .setEmoji('⚠️')
                .setCustomId('confirmar')

            const cancelar = new ButtonBuilder()
                .setStyle(ButtonStyle.Primary)
                .setLabel('Cancelar')
                .setCustomId('cancelar')

            const row = new ActionRowBuilder()
                .addComponents([confirmar, cancelar])



            const confirmationEmbed2 = new EmbedBuilder()
                .setTitle(`Você aceita ser presidente da chapa '${chapa.nome}'?`)
                .setDescription(`${userMention} Quer que você entre no lugar dele como presidente da chapa, você aceita?`)
                .setColor('#555555')
                .setFooter({ text: `ID da Chapa: ${chapa.id} • Use o comando "/chapas info id:${chapa.id}" para mais detalhes.` })

            const aceitar = new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel('Aceitar')
                .setEmoji('✅')
                .setCustomId('aceitar')

            const recusar = new ButtonBuilder()
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Recusar')
                .setEmoji('❌')
                .setCustomId('recusar')

            const row2 = new ActionRowBuilder()
                .addComponents([aceitar, recusar])



            function getIntegrantes(chapa) {
                let xs = ''
                if (chapa.integrantes.length > 0) {

                    chapa.integrantes.forEach(x => {
                        xs = xs + `\n<@${x}>`
                    })

                    return xs
                } else {
                    return xs = '*Nenhum*'
                }
            }

            let integrantes = getIntegrantes(chapa)


            const cancelouEmbed = new EmbedBuilder()
                .setTitle(`Transferência cancelada.`)
                .setColor('#ff0000')



            const recusouEmbed = new EmbedBuilder()
                .setTitle(`${target.username} recusou a transferência.`)
                .setColor('#ff0000')



            const collectorFilter = x => x.user.id === interaction.user.id

            const collectorFilter2 = x => x.user.id === target.id

            const sent1 = await interaction.reply({ content: userMention, embeds: [confirmationEmbed], components: [row], ephemeral: true })

            try {
                obj1.managing.push(interaction.user.id, target.id)
                writeDb(obj1, db)

                const confirmation = await sent1.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })

                if (confirmation.customId === "confirmar") {


                    const sent2 = await interaction.channel.send({ content: targetMention, embeds: [confirmationEmbed2], components: [row2], ephemeral: false })

                    try {

                        const targetConfirmation = await sent2.awaitMessageComponent({ filter: collectorFilter2, time: 60_000 })

                        if (targetConfirmation.customId === "aceitar") {




                            obj1.chapas[chapaID].presidente = target.id

                            if (target.id === chapa.vicepresidente) obj1.chapas[chapaID].vicepresidente = null

                            if (chapa.integrantes.indexOf(target.id) >= 0) {
                                const intIndex = obj1.chapas[chapaID].integrantes.indexOf(target.id)
                                obj1.chapas[chapaID].integrantes.splice(intIndex, 1)
                            }

                            integrantes = getIntegrantes(obj1.chapas[chapaID])

                            const successEmbed = new EmbedBuilder()
                                .setTitle(`Parabéns, agora você é presidente da chapa!`)
                                .setColor('#00ff00')
                                .setAuthor({ name: `${target.username}`, iconURL: target.displayAvatarURL() })
                                .addFields(
                                    { name: 'Presidente:', value: `${targetMention} (Você)` },
                                    { name: 'Vice-presidente:', value: obj1.chapas[chapaID].vicepresidente === null ? `*Nenhum*` : `<@${obj1.chapas[chapaID].vicepresidente}>` },
                                    { name: 'Integrantes:', value: integrantes },
                                )
                                .setFooter({ text: `ID: ${chapa.id}` })

                            targetConfirmation.update({ embeds: [successEmbed], components: [] })


                            obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                            obj1.managing.splice(obj1.managing.indexOf(target.id), 1)
                            return writeDb(obj1, db)

                        } else if (targetConfirmation.customId === "recusar") {

                            obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                            obj1.managing.splice(obj1.managing.indexOf(target.id), 1)
                            writeDb(obj1, db)

                            return targetConfirmation.update({ content: userMention, embeds: [recusouEmbed], components: [] })
                        }

                    } catch (e) {
                        obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                        obj1.managing.splice(obj1.managing.indexOf(target.id), 1)
                        writeDb(obj1, db)

                        return await interaction.editReply({ content: `Demorou demais para responder!`, embeds: [], components: [] })
                    }

                } else if (confirmation.customId === "cancelar") {
                    obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                    obj1.managing.splice(obj1.managing.indexOf(target.id), 1)
                    writeDb(obj1, db)
                    return await confirmation.update({ content: userMention, embeds: [cancelouEmbed], components: [] })
                }
            } catch (e) {
                obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                obj1.managing.splice(obj1.managing.indexOf(target.id), 1)
                writeDb(obj1, db)
                return await interaction.editReply({ content: `Demorou demais para responder!`, embeds: [], components: [] })
            }
        } else if (subcommand === "promover") {
            const target = interaction.options.getUser('alvo')
            const targetMention = `<@${target.id}>`
            const user = interaction.user
            const userMention = `<@${user.id}>`

            if (obj1.managing.indexOf(interaction.user.id) >= 0) return interaction.reply({ content: 'Você ainda tem uma interação de gerenciamento de chapa em andamento! Tente novamente em um minuto.', ephemeral: true })
            if (obj1.managing.indexOf(target.id) >= 0) return interaction.reply({ content: `${targetMention} já tem uma interação de gerenciamento de chapa em andamento! Tente novamente em um minuto.`, ephemeral: true })

            function getChapa() {
                let chapa

                obj1.chapas.forEach(x => {
                    if (x.presidente === user.id) chapa = obj1.chapas.indexOf(x)
                })

                if (!chapa) {
                    return null
                } else {
                    return chapa
                }
            }

            const chapaId = getChapa()

            if (chapaId === null) return interaction.reply({ content: `${userMention} Você não tem uma chapa.`, ephemeral: true })

            if (obj1.chapas[chapaId].vicepresidente === target.id) return interaction.reply({ content: `${userMention} Essa pessoa já é vice-presidente da sua chapa!`, ephemeral: true })

            if (obj1.chapas[chapaId].integrantes.indexOf(target.id) < 0) return interaction.reply({ content: `${userMention} O membro que você tentou promover não é integrante da sua chapa! (${targetMention})`, ephemeral: true })

            const targetIndex = obj1.chapas[chapaId].integrantes.indexOf(target.id)

            const chapaVice = obj1.chapas[chapaId].vicepresidente



            switch (chapaVice) {
                case null:

                    const embed = new EmbedBuilder()
                        .setAuthor({ name: `${user.username} (Presidente da sua chapa)`, iconURL: user.displayAvatarURL() })
                        .setTitle(`${user.username} Quer te promover para vice-presidente de sua chapa, você aceita?`)
                        .setColor('#555555')

                    const aceitar = new ButtonBuilder()
                        .setStyle(ButtonStyle.Success)
                        .setLabel(`Aceitar`)
                        .setCustomId(`aceitar`)

                    const recusar = new ButtonBuilder()
                        .setStyle(ButtonStyle.Danger)
                        .setLabel(`Recusar`)
                        .setCustomId(`recusar`)

                    const row1 = new ActionRowBuilder()
                        .setComponents(aceitar, recusar)

                    interaction.reply({ content: 'Aguardando resposta...', ephemeral: true })

                    const sent2 = await interaction.channel.send({ content: targetMention, embeds: [embed], components: [row1] })

                    const collectorFilter2 = x => x.user.id === target.id

                    try {
                        obj1.managing.push(interaction.user.id, target.id)
                        writeDb(obj1, db)

                        const confirmation = await sent2.awaitMessageComponent({ filter: collectorFilter2, time: 60_000 })



                        if (confirmation.customId === "aceitar") {
                            const embed = new EmbedBuilder()
                                .setTitle(`Parabéns, agora você é vice-presidente da chapa!`)
                                .setColor('#00ff00')
                                .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })

                            obj1.chapas[chapaId].vicepresidente = target.id

                            obj1.chapas[chapaId].integrantes.splice(targetIndex, 1)

                            sent2.edit({ embeds: [embed], components: [] })

                            interaction.editReply(`${targetMention} aceitou a promoção!`)

                            obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                            obj1.managing.splice(obj1.managing.indexOf(target.id), 1)

                            return writeDb(obj1, db)
                        } else if (confirmation.customId === "recusar") {
                            obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                            obj1.managing.splice(obj1.managing.indexOf(target.id), 1)
                            writeDb(obj1, db)
                            confirmation.update({ content: `${userMention} A promoção foi recusada por ${targetMention}!`, embeds: [], components: [] })
                        }
                    } catch (e) {
                        obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                        obj1.managing.splice(obj1.managing.indexOf(target.id), 1)
                        writeDb(obj1, db)
                        return await interaction.channel.send(`Demorou demais para responder!`)
                    }

                    break
                default:

                    await interaction.guild.members.fetch()
                    const vice = interaction.guild.members.cache.get(chapaVice).user

                    const viceReplaceEmbed = new EmbedBuilder()
                        .setAuthor({ name: `${vice.username} (Vice-presidente)`, iconURL: vice.displayAvatarURL() })
                        .setTitle(`Sua chapa já tem um vice-presidente, deseja substituí-lo?`)
                        .setColor('#555555')
                        .setDescription(`Você só poderá promovê-lo novamente caso ele aceite!`)

                    const sim = new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setLabel(`Sim`)
                        .setCustomId('sim')

                    const nao = new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel(`Não`)
                        .setCustomId('nao')

                    const row = new ActionRowBuilder()
                        .setComponents(sim, nao)


                    const collectorFilter = x => x.user.id === interaction.user.id

                    const sent = await interaction.reply({ content: userMention, embeds: [viceReplaceEmbed], components: [row], ephemeral: true })

                    try {
                        obj1.managing.push(interaction.user.id, target.id)
                        writeDb(obj1, db)

                        const confirmation = await sent.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })

                        if (confirmation.customId === "sim") {

                            await confirmation.update({ content: `Aguardando a resposta...`, embeds: [], components: [] })


                            const embed = new EmbedBuilder()
                                .setAuthor({ name: `${user.username} (Presidente da sua chapa)` })
                                .setTitle(`${user.username} Quer te promover para vice-presidente de sua chapa, você aceita?`)
                                .setColor('#555555')


                            const aceitar = new ButtonBuilder()
                                .setStyle(ButtonStyle.Success)
                                .setLabel(`Aceitar`)
                                .setCustomId(`aceitar`)

                            const recusar = new ButtonBuilder()
                                .setStyle(ButtonStyle.Danger)
                                .setLabel(`Recusar`)
                                .setCustomId(`recusar`)

                            const row = new ActionRowBuilder()
                                .setComponents(aceitar, recusar)

                            const sent2 = await interaction.channel.send({ content: targetMention, embeds: [embed], components: [row] })

                            const collectorFilter2 = x => x.user.id === target.id

                            try {

                                const confirmation = await sent2.awaitMessageComponent({ filter: collectorFilter2, time: 60_000 })

                                if (confirmation.customId === "aceitar") {
                                    const embed = new EmbedBuilder()
                                        .setTitle(`Parabéns, agora você é vice-presidente da chapa!`)
                                        .setColor('#00ff00')
                                        .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })


                                    obj1.chapas[chapaId].vicepresidente = target.id

                                    obj1.chapas[chapaId].integrantes.splice(targetIndex, 1)

                                    obj1.chapas[chapaId].integrantes.push(vice.id)

                                    confirmation.update({ embeds: [embed], components: [] })

                                    obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                                    obj1.managing.splice(obj1.managing.indexOf(target.id), 1)

                                    return writeDb(obj1, db)
                                } else if (confirmation.customId === "recusar") {
                                    obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                                    obj1.managing.splice(obj1.managing.indexOf(target.id), 1)
                                    writeDb(obj1, db)
                                    confirmation.update({ content: `${userMention} A promoção foi recusada por ${targetMention}!`, embeds: [], components: [] })
                                }
                            } catch (e) {
                                obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                                obj1.managing.splice(obj1.managing.indexOf(target.id), 1)
                                writeDb(obj1, db)
                                return await interaction.channel.send(`Demorou demais para responder!`)
                            }
                        } else if (confirmation.customId === "nao") {
                            obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                            obj1.managing.splice(obj1.managing.indexOf(target.id), 1)
                            writeDb(obj1, db)
                            interaction.editReply({ content: 'Promoção cancelada.', embeds: [], components: [] })
                        }
                    } catch (e) {
                        obj1.managing.splice(obj1.managing.indexOf(interaction.user.id), 1)
                        obj1.managing.splice(obj1.managing.indexOf(target.id), 1)
                        writeDb(obj1, db)
                        return interaction.editReply({ content: 'Demorou demais para responder!', embeds: [], components: [] })
                    }
                    break
            }
        }
    }
}