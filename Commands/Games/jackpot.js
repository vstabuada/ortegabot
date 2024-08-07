const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Embed, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jackpot')
        .setDescription('Jogue no jackpot!')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction) {
        const espaco = '<:espaca_nk:1248685452832276600>'
        const setaR = '<:rightarrow_nk:1248682290297700362>'
        const setaL = '<:leftarrow_nk:1248682961469964388>'
        const dima = '<a:dima_nk:1177204505163603968>'
        const star = '<a:estrela_nk:1169426803459379231>'

        const emojis = [dima, star, '🍒', '🍓']

        let mention = `<@${interaction.user.id}>`



        const chats = ['1178020973820248114', '1169473095858397255']
        const adms = ['545314209865531398', '921235314826158090']

        const chatErrorEmbed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Você não pode usar esse comando aqui!')
            .setDescription(`Tente usá-lo no chat <#${chats[1]}> !`)

        if (chats.indexOf(interaction.channel.id) < 0 && adms.indexOf(interaction.user.id) < 0) {
            const sent = await interaction.reply({
                content: mention,
                embeds: [chatErrorEmbed],
            })
            return undefined
        }


        const rn = function () {
            const max = emojis.length - 1
            return Math.floor(Math.random() * (max + 1))
        }

        let slots = [emojis[rn()], emojis[rn()], emojis[rn()], emojis[rn()], emojis[rn()], emojis[rn()], emojis[rn()], emojis[rn()], emojis[rn()]]




        const jackpotEmbed = new EmbedBuilder()
            .setAuthor({ name: '???', iconURL: 'https://zephyrpoint.org/wp-content/uploads/2021/05/unknown-person-icon.png' })
            .setDescription('O que você fez com sua vida?')



        const jackpot = async function (interaction) { // Essa função é chamada caso os 9 slots sejam iguais. (1 a cada 65536 tentativas) 
            const role = await interaction.guild.roles.cache.get('1248876795802026007')
            const target = await interaction.guild.members.fetch(interaction.user.id)

            setTimeout(async function () { await interaction.editReply({ embeds: [jackpotEmbed] }) }, 7000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('O que você fez com sua vida?.')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 10000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('O que você fez com sua vida?..')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 10500)
            setTimeout(async function () {
                jackpotEmbed.setDescription('O que você fez com sua vida?...')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 11000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Veja o t')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 13000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Veja o tempo que s')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 13500)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Veja o tempo que se passou')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 14000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Veja o tempo que se passou.')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 15000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Veja o tempo que se passou..')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 16000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Veja o tempo que se passou...')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 17000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Ciclos se ini')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 20000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Ciclos se iniciaram e se enc')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 20500)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Ciclos se iniciaram e se encerraram')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 21000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Ciclos se iniciaram e se encerraram.')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 22000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Ciclos se iniciaram e se encerraram..')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 23000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Ciclos se iniciaram e se encerraram...')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 24000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Pessoas se co')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 27000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Pessoas se conheceram, s')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 27500)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Pessoas se conheceram, se afastaram')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 28000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Pessoas se conheceram, se afastaram.')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 29000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Pessoas se conheceram, se afastaram..')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 30000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Pessoas se conheceram, se afastaram...')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 31000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Aqueles que você')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 34000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Aqueles que você conhecia já não s')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 34500)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Aqueles que você conhecia já não são mais os mesmos')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 35000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Aqueles que você conhecia já não são mais os mesmos.')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 36000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Aqueles que você conhecia já não são mais os mesmos..')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 37000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Aqueles que você conhecia já não são mais os mesmos...')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 38000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('E você ai')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 41000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('E você ainda contin')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 41500)
            setTimeout(async function () {
                jackpotEmbed.setDescription('E você ainda continuou aqui')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 42000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('E você ainda continuou aqui.')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 43000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('E você ainda continuou aqui..')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 44000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('E você ainda continuou aqui...')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 45000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Era is')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 48000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Era isso que qu')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 48500)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Era isso que queria')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 49000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Era isso que queria?')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 49500)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Era isso que queria?.')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 50500)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Era isso que queria?..')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 51500)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Era isso que queria?...')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 52500)
            setTimeout(async function () {
                jackpotEmbed.setDescription('\\_\\_\\_ \\_\\_\\_\\_ \\_\\_\\_ \\_\\_\\_\\_\\_\\_?...')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 55000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Era isso que queria?...')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 57000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('\\_\\_\\_ \\_\\_\\_\\_ \\_\\_\\_ \\_\\_\\_\\_\\_\\_?...')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 59000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('Era isso que queria?...')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 61000)
            setTimeout(async function () {
                jackpotEmbed.setDescription(`${espaco}${espaco}${espaco}${espaco}${espaco}${espaco}${espaco}${espaco}`)
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 63000)
            setTimeout(async function () {
                jackpotEmbed.setDescription('<a:loading_nk:1248874238350458911>')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 66000)
            setTimeout(async function () {
                jackpotEmbed.setTitle('PARABÉNS!')
                    .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setColor('#000000')
                    .setDescription(espaco)
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 70500)
            setTimeout(async function () {
                jackpotEmbed.setColor('#002200')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 70750)
            setTimeout(async function () {
                jackpotEmbed.setColor('#004400')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 71000)
            setTimeout(async function () {
                jackpotEmbed.setColor('#006600')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 71250)
            setTimeout(async function () {
                jackpotEmbed.setColor('#008800')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 71500)
            setTimeout(async function () {
                jackpotEmbed.setColor('#00aa00')
                    .setDescription('Você desbloqueou a conquista **The Final Casino Boss**!')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 71750)
            setTimeout(async function () {
                jackpotEmbed.setColor('#00cc00')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 72000)
            setTimeout(async function () {
                jackpotEmbed.setColor('#00ee00')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 72250)
            setTimeout(async function () {
                jackpotEmbed.setColor('#00ff00')
                await interaction.editReply({ embeds: [jackpotEmbed] })
            }, 72500)
            setTimeout(async function () {
                jackpotEmbed.setColor('#00ff00')
                    .setDescription('Você desbloqueou a conquista **The Final Casino Boss**!')
                    .setFooter({ text: `Você recebeu o cargo ${role.name} !` })
                await interaction.editReply({ content: `<@&${role.id}>`, embeds: [jackpotEmbed] })
                target.roles.add(role)
            }, 80000)

        }


        const verifyResult = function (n) {
            if (slots[3] === slots[4] && slots[4] === slots[5]) {
                if (slots[0] === slots[1] && slots[1] === slots[2] && slots[2] === slots[3] && slots[3] === slots[4] && slots[4] === slots[5] && slots[5] === slots[6] && slots[6] === slots[7] && slots[7] === slots[8]) {
                    jackpot(interaction)
                    const result = ['É o quê?! JACKPOT???', '#ffff00']
                    return result[n]
                } else {
                    const result = ['Você ganhou!', '#00ff00']
                    return result[n]
                }
            } else {
                const result = ['Não ganhou nada...', '#ff0000']
                return result[n]
            }
        }
        const embed = new EmbedBuilder()
            .setTitle('Jackpot')
            .setDescription(`${espaco} | ${slots[0]} ${slots[1]} ${slots[2]} | ${espaco} \n${setaR} | ${slots[3]} ${slots[4]} ${slots[5]} | ${setaL}\n ${espaco} | ${slots[6]} ${slots[7]} ${slots[8]} | ${espaco}`)
            .setColor(`${verifyResult(1)}`)
            .setFooter({ text: `${verifyResult(0)}` })
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })

        const sent = await interaction.reply({
            content: mention,
            embeds: [embed],
        })
    }
}