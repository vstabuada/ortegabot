const { EmbedBuilder, IntegrationApplication, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, Embed } = require("discord.js")
const { readDb } = require("../../Data/dbFunctions")
const { getClassIcon, RNG } = require("../RPGHandlers/generalHandlers")
const database = readDb()

const HP = database.emojis.health
const MANA = database.emojis.mana

const fight = async function (interaction, player, enemy, enemyQuantity, preconfirmation) {

    const user = interaction.user

    const playerMaxHP = player.status.maxHealthPoints
    const playerMaxMANA = player.status.maxManaPoints
    const playerRES = player.profile.attributes.resistence

    const playerWeapon = readDb(`./RPG/Items/Weapons/${player.inventory.equipped.weapons.mainHand}.json`) || 'error'

    if (playerWeapon === "error") return interaction.editReply({ content: 'Algo deu errado!', embeds: [], components: [] })

    const enemyMaxHP = enemy.stats.life
    const enemyDMG = enemy.stats.damage
    const enemyRES = enemy.stats.resistance
    const enemyName = enemy.name
    const xp = enemy.level * 10

    let playerHP = playerMaxHP
    let playerMANA = playerMaxMANA

    let enemyHP = enemyMaxHP

    let yourTurn = true

    let enemies = enemyQuantity


    const generateLifeBar = function (life, maxlife) {

        const fullSlots = Math.round((10 / (maxlife / life)))
        const remainingSlots = 10 - fullSlots

        const fullSlot = '█'
        const remainingSlot = '░'

        let lifeBar = '[ '

        for (let i = 0; i < fullSlots; i++) {
            lifeBar += fullSlot
        }

        for (let i = 0; i < remainingSlots; i++) {
            lifeBar += remainingSlot
        }

        lifeBar += ' ]'

        return lifeBar
    }


    const dmgRNG = function (dmg) {
        const dmgGap = parseInt(dmg / 10)
        const dmgMin = dmgGap * (-1)
        const dmgMax = dmgGap
        return dmg - RNG(dmgMin, dmgMax)
    }


    const skillMenu = new StringSelectMenuBuilder()
        .setCustomId('skills')
        .setPlaceholder('Habilidades')
        .setMaxValues(1)



    const buildSkillMenu = function () {

        player.skills.activeSkills.forEach(x => {

            const skill = readDb(`./RPG/Skills/activeSkills/${x}.json`)


            skillMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(skill.name)
                    .setDescription(skill.description)
                    .setValue(skill.id)
            )
        })

        player.skills.ultimateSkills.forEach(x => {
            const skill = readDb(`./RPG/Skills/ultimateSkills/${x}.json`)

            skillMenu.addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel(skill.name)
                    .setDescription(skill.description)
                    .setValue(skill.id)
            )
        })

        if (skillMenu.options.length < 1) {
            skillMenu.setDisabled(true)
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel('Nada.')
                        .setDescription('Nada.')
                        .setValue('none')
                )
                .setPlaceholder('Habilidades (Nenhuma)')
        }
    }

    buildSkillMenu()


    const attackButton = new ButtonBuilder()
        .setCustomId('attack')
        .setLabel('Atacar')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('👊')


    const row = new ActionRowBuilder()
        .addComponents(skillMenu)

    const row2 = new ActionRowBuilder()
        .addComponents(attackButton)


    let enemyLastMove = ''
    let playerLastMove = ''


    const generateFightEmbed = function (color = 'Grey', finished = false, winner) {




        const fightEmbed = new EmbedBuilder()
            .setAuthor({ name: `${enemyName} (Nível ${enemy.level})`, iconURL: enemy.icon ? enemy.icon : undefined })
            .setFooter({ text: player.profile.name, iconURL: getClassIcon(player.profile.class) })
            .setColor(color)
            .setDescription(`
${HP} ${enemyHP}/${enemyMaxHP} • ${generateLifeBar(enemyHP, enemyMaxHP)}

${enemyLastMove}
${yourTurn ? `────── **Seu turno** ──────` : `─── **Turno do inimigo** ───`}
${playerLastMove}

${HP} ${playerHP}/${playerMaxHP} • ${MANA} ${playerMANA}/${playerMaxMANA}
`)

        const winnerEmbed = new EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
            .setTitle(`Vitória!`)
            .setColor('#00ff00')

        const gameoverEmbed = new EmbedBuilder()
            .setTitle('GAME OVER')
            .setColor('#ff0000')
            .setDescription('Você é socorrido da dungeon e perde todas as suas recompensas!')




        if (!finished) return fightEmbed
        else {
            switch (winner) {
                case "player":
                    return winnerEmbed
                case "enemy":
                    return gameoverEmbed
            }
        }
    }

    const sent = await preconfirmation.update({ content: `${user}`, embeds: [generateFightEmbed('#00aaff')], components: [row2, row] })
    const collectorFilter = x => x.user.id === user.id


    while (enemyHP > 0 && playerHP > 0) {

        try {
            const confirmation = await sent.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })



            switch (confirmation.customId) {
                case "attack":
                    const dmg = (playerWeapon.damage + player.profile.attributes.strength + player.profile.attributes.dexterity) - enemyRES

                    const realDMG = dmgRNG(dmg)

                    if (enemyHP <= realDMG) enemyHP = 0
                    if (enemyHP > realDMG) enemyHP -= realDMG

                    yourTurn = false
                    playerLastMove = `Você atacou e deu ${realDMG} de dano`
                    enemyLastMove = ''

                    let finished = enemyHP === 0 || playerHP === 0 ? true : false
                    let winner = enemyHP === 0 ? "player" : playerHP === 0 ? "enemy" : undefined

                    if (finished && winner === "player") {

                        const continueButton = new ButtonBuilder()
                            .setCustomId('continue')
                            .setLabel('Continuar')
                            .setStyle(ButtonStyle.Success)

                        const row3 = new ActionRowBuilder()
                            .addComponents(continueButton)

                        const sent2 = await confirmation.update({ content: `${user}`, embeds: [generateFightEmbed('Red', finished, winner)], components: [row3] })

                        try {
                            const confirmation = await sent2.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })

                            if (confirmation.customId === 'continue') {
                                if (enemies > 1) {
                                    enemies--
                                    enemyHP = enemyMaxHP
                                    playerLastMove = ''
                                    enemyLastMove = ''
                                    await confirmation.update({ content: `${user}`, embeds: [generateFightEmbed('#00aaff')], components: [row2, row] })
                                    continue
                                } else {
                                    return "finished"
                                }
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    } else {
                        await confirmation.update({ content: `${user}`, embeds: [generateFightEmbed('#880000')], components: [] })
                    }

                    break
            }
        } catch (e) {
            interaction.editReply({ content: 'Demorou demais!', embeds: [], components: [] })

            var updatedDb = readDb('./Data/rpg.json')
            updatedDb.inDungeon.splice(updatedDb.inDungeon.indexOf(user.id), 1)
            writeDb(updatedDb, './Data/rpg.json')
        }

        async function skeletonTurn() {
            const dmg = (enemyDMG - playerRES) <= 1 ? 1 : (enemyDMG - playerRES)

            const realDMG = dmgRNG(dmg)

            if (playerHP <= realDMG) playerHP = 0
            if (playerHP > realDMG) playerHP -= realDMG

            yourTurn = true
            playerLastMove = ''
            enemyLastMove = `Atacou você e deu ${realDMG} de dano`

            let finished = enemyHP === 0 || playerHP === 0 ? true : false
            let winner = enemyHP === 0 ? "player" : playerHP === 0 ? "enemy" : undefined

            await interaction.editReply({ content: `${user}`, embeds: [generateFightEmbed('#00aaff', finished, winner)], components: finished ? [] : [row2, row] })
        }

        if (yourTurn === false && playerHP > 0 && enemyHP > 0) setTimeout(skeletonTurn, 2400)


    }



}

module.exports = { fight }