const { Events, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Embed, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentBuilder, ActionRow, ComponentType, time, SimpleIdentifyThrottler } = require("discord.js")
const { readDb, writeDb } = require('../../Data/dbFunctions.js')
const { getClassIcon, translateStats } = require("../../RPG/RPGHandlers/generalHandlers.js")

const db = './Data/rpg.json'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rpg-perfil')
        .setDescription('Ver seu perfil de jogador no NimeWorld.')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Quem você quer ver o perfil?')
        ),
    async execute(interaction, client) {

        const rpgdb = readDb(db)

        const user = interaction.user
        const target = interaction.options.getUser('usuario') || user

        const getPlayerIndex = function () {
            let result
            rpgdb.players.forEach(x => {
                if (x.id === target.id) result = rpgdb.players.indexOf(x)
            })
            return result
        }
        const playerIndex = getPlayerIndex()

        if (playerIndex === undefined || playerIndex < 0) return interaction.reply({ content: target.id === user.id ? `Você não está registrado como jogador do NimeWorld!` : target.bot ? `Um bot não pode jogar o RPG do NimeWorld!` : `Esse usuário não está registrado como jogador no NimeWorld!`, ephemeral: true })

        const player = rpgdb.players[playerIndex]


        const economydb = readDb('./Data/economy.json')

        const getEconomyUserIndex = function () {
            let result
            economydb.users.forEach(x => {
                if (x.id === target.id) result = economydb.users.indexOf(x)
            })
            return result
        }

        const economyUserIndex = typeof getEconomyUserIndex() === "number" ? getEconomyUserIndex() : -1

        const economyUser = economyUserIndex < 0 ? { gold: 0, diamond: 0, nimekoin: 0 } : economydb.users[economyUserIndex]

        const { emojis } = readDb()

        const att = player.profile.attributes

        const { healthPoints, maxHealthPoints, manaPoints, maxManaPoints } = player.status

        const statusLine = `**Status:** ${emojis.health} ${healthPoints}/${maxHealthPoints} • ${emojis.mana} ${manaPoints}/${maxManaPoints}`
        const levelLine = `**Nível:** ${player.profile.level}`
        const tierLine = `Aventureiro de Rank **${player.profile.tier}**`
        const genderLine = `${player.profile.gender === "female" ? "♀️ Feminino" : "♂️ Masculino"}`
        const raceLine = `${translateStats(player.profile.race, "race")}`
        const classLine = `${translateStats(player.profile.class, "class")}`
        const professionLine = `${translateStats(player.profile.profession, "profession")}`
        const religionLine = `${player.profile.religion.name ? translateStats(player.profile.religion.name, "religion") : 'Nenhuma.'}`
        const titleLine = `${player.profile.titles.equipped}`

        const gold = `${emojis.gold} ${economyUser.gold.toLocaleString()}`
        const diamond = `${emojis.diamond} ${economyUser.diamond.toLocaleString()}`
        const nimekoin = `${emojis.nimekoin} ${economyUser.nimekoin.toLocaleString()}`

        const walletLine = `**「${gold}」「${diamond}」「${nimekoin}」**`

        const attributeLine = `**Pontos gastos:** ${att.points.spentPoints} • **Pontos disponíveis:** ${att.points.availablePoints}\n\n**Vitalidade:** ${att.vitality} • **Resistência:** ${att.resistence} • **Força:** ${att.strength} • **Destreza:** ${att.dexterity}\n**Inteligência:** ${att.intelligence} • **Sabedoria:** ${att.wisdom} • **Carisma:** ${att.charisma}`

        const profile = new EmbedBuilder()
            .setAuthor({ name: player.profile.name, iconURL: getClassIcon(readDb(db).players[playerIndex].profile.class) || target.displayAvatarURL() })
            .setFooter({ text: target.username, iconURL: target.displayAvatarURL() })
            .setColor('Orange')
            .setTitle('Ficha de Aventureiro')
            .setDescription(`${statusLine}\n\n${levelLine}\n${tierLine}`)
            .addFields(
                { name: 'Gênero:', value: genderLine, inline: true },
                { name: 'Raça:', value: raceLine, inline: true },
                { name: 'Classe:', value: classLine, inline: true },
                { name: 'Profissão:', value: professionLine, inline: true },
                { name: 'Religião:', value: religionLine, inline: true },
                { name: 'Título:', value: titleLine, inline: true },
                { name: 'Carteira:', value: walletLine },
                { name: 'Atributos:', value: attributeLine },
            )

        interaction.reply({ content: `${user}`, embeds: [profile] })

    }
}