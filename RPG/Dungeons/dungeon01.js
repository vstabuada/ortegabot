const { Events, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Embed, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentBuilder, ActionRow, ComponentType, time, SimpleIdentifyThrottler } = require("discord.js")
const { readDb, writeDb } = require('../../Data/dbFunctions.js')
const { read } = require("fs")
const dungeon = require("../../Commands/RPG/dungeon.js")
const { fight } = require("../Systems/fightSystem.js")
const { unescape } = require("querystring")
const { RNG } = require("../RPGHandlers/generalHandlers.js")

const db = './Data/rpg.json'

const name = "Porão dos Esqueletos"
const requiredLevel = 1
const color = "#4F3428"
const image = "https://media.discordapp.net/attachments/1262513860548759644/1264360560070230056/Porao_dos_Esqueletos.png"

const stages = 4

const monsters = ["skeleton"]

const skeleton = readDb(`./RPG/Enemies/skeleton.json`)
const monsterSpawnRate = 1
const treasureSpawnRate = 1
const treasureTier = {
    minLevel: 1,
    maxLevel: 1,
    // Chance de loots por raridade:
    supremeRate: 0,
    mythicalRate: 0,
    legendaryRate: 0,
    epicRate: 2,
    rareRate: 18,
    uncommonRate: 35,
    commonRate: 45
    // Tem que somar 100
}
const dungeonStructure = [
    {
        id: "hallway",
        name: "Corredor",
        chance: 50,
        color: "#454952",

        monsterSpawnRate: 10,
        minMonsterGroup: 1,
        maxMonsterGroup: 2
    },
    {
        id: "room",
        name: "Sala",
        chance: 30,
        color: "#403c57",

        monsterSpawnRate: 50,
        minMonsterGroup: 1,
        maxMonsterGroup: 2
    },
    {
        id: "treasureRoom",
        name: "Sala de Tesouros",
        chance: 20,
        color: "#ffff00",

        monsterSpawnRate: 80,
        minMonsterGroup: 2,
        maxMonsterGroup: 3
    },
    {
        id: "teste",
        name: "Sala de testes",
        chance: 0,
        color: "#ff0000",

        monsterSpawnRate: 100,
        minMonsterGroup: 2,
        maxMonsterGroup: 3
    },
]

module.exports = {
    data: {
        name: name,
        level: requiredLevel,
        async play(interaction, player, user) {


            const rpgdb = readDb(db)

            const stageGenerator = async function (preconfirmation, scene = "", enemy = true) {

                const sceneryGerenator = function (scene = "") {
                    switch (scene) {
                        case "hallway":
                            return "hallway"
                        case "room":
                            return "room"
                        case "treasureRoom":
                            return "treasureRoom"
                        case "teste":
                            return "teste"
                        default:
                            const possibilities = [...dungeonStructure.sort((a, b) => b.chance - a.chance)]
                            let rng = []
                            possibilities.forEach(x => {
                                for (let min = 0; min < x.chance; min++) {
                                    rng.push(x.id)
                                }
                            })
                            return rng[RNG(0, 99)]

                    }
                }

                const enemyGenerator = function (scenery) {
                    let chance = scenery.monsterSpawnRate
                    let rng = []
                    for (let x = 0; x < 100; x++) {
                        if (x < chance) { rng.push(true) } else { rng.push(false) }
                    }
                    const spawnEnemy = rng[RNG(0, 99)]
                    if (spawnEnemy) return { monster: monsters[RNG(0, (monsters.length - 1))], quantity: RNG(scenery.minMonsterGroup, scenery.maxMonsterGroup) }
                    else { return null }
                }

                const sceneryId = sceneryGerenator(scene)

                const sceneryIndex = function (scenery) {
                    let result
                    dungeonStructure.forEach(x => {
                        if (x.id === scenery) result = dungeonStructure.indexOf(x)
                    })
                    return result
                }

                const scenery = dungeonStructure[sceneryIndex(sceneryId)]

                const enemies = enemy ? enemyGenerator(scenery) : null

                const stageTranslator = function (item, type) {
                    switch (type) {
                        case "name":
                            switch (item) {
                                case "hallway":
                                    return "Corredor"
                                case "room":
                                    return "Sala"
                                case "treasureRoom":
                                    return "Sala de tesouros"
                                case "teste":
                                    return "Sala de testes"
                            }
                            break
                        case "monster":
                            switch (item) {
                                case "skeleton":
                                    return "Esqueleto"
                            }
                            break
                    }
                }

                const stageEmbed = new EmbedBuilder()
                    .setTitle(scenery.name)
                    .setColor(scenery.color)

                if (enemies) {
                    const enemyName = enemies.quantity > 1 ? `${stageTranslator(enemies.monster, "monster").toLocaleLowerCase()}s` : `${stageTranslator(enemies.monster, "monster").toLocaleLowerCase()}`
                    stageEmbed.setDescription(`Apareceram ${enemies.quantity} **${enemyName}**!`)
                } else {
                    stageEmbed.setDescription(`Não tem nada demais por aqui...`)
                }

                const fightButton = new ButtonBuilder()
                    .setCustomId('fight')
                    .setEmoji('⚔️')
                    .setLabel('Batalhar')
                    .setStyle(ButtonStyle.Primary)

                const escapeButton = new ButtonBuilder()
                    .setCustomId('escape')
                    .setEmoji('🏃')
                    .setLabel('Fugir')
                    .setStyle(ButtonStyle.Danger)

                const row = new ActionRowBuilder()
                    .setComponents(fightButton, escapeButton)


                const continueButton = new ButtonBuilder()
                    .setCustomId('continue')
                    .setLabel('Continuar')
                    .setStyle(ButtonStyle.Success)

                const row2 = new ActionRowBuilder()
                    .addComponents(continueButton)

                try {

                    await preconfirmation.update({ content: `${user}`, embeds: [stageEmbed], components: enemies ? [row] : [row2] })
                } catch (e) {
                    await interaction.editReply({ content: `${user}`, embeds: [stageEmbed], components: enemies ? [row] : [row2] })
                }


                const collectorFilter = x => x.user.id === user.id

                // if (enemies) {
                try {
                    const confirmation = await sent.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })

                    switch (confirmation.customId) {
                        case "fight":

                            await fight(interaction, player, skeleton, enemies.quantity, confirmation)

                            break
                        case "escape":
                            return interaction.editReply({ content: 'Você fugiu da dungeon e perdeu todo seu progresso!', embeds: [], components: [] })
                        case "continue":
                            return "continue"
                    }
                } catch (e) {
                    return interaction.editReply({ content: 'Demorou demais para decidir! A dungeon foi cancelada e todas as recompensadas e XP zerados.', embeds: [], components: [] })
                }
                /*} else {
                    try {
                        const confirmation = await sent.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })

                        if (confirmation.customId === "continue") {

                        }

                    } catch (e) {
                        return interaction.editReply({ content: 'Demorou demais para decidir! A dungeon foi cancelada e todas as recompensadas e XP zerados.', embeds: [], components: [] })
                    }
                }*/
            }




            const startEmbed = new EmbedBuilder()
                .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                .setTitle(`Deseja entrar na dungeon?`)
                .setDescription(`**${name}**\nNível mínimo: **${requiredLevel}** (Seu nível: ${player.profile.level})`)
                .setColor(color)
                .setImage(image)

            const yesButton = new ButtonBuilder()
                .setCustomId('yes')
                .setStyle(ButtonStyle.Success)
                .setEmoji('✔️')
                .setLabel('Sim')

            const noButton = new ButtonBuilder()
                .setCustomId('no')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('❌')
                .setLabel('Não')

            const row = new ActionRowBuilder()
                .addComponents(yesButton, noButton)


            const sent = await interaction.reply({ content: `${user}`, embeds: [startEmbed], components: [row] })

            const collectorFilter = x => x.user.id === user.id

            try {
                rpgdb.inDungeon.push(user.id)
                writeDb(rpgdb, db)

                const confirmation = await sent.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })

                switch (confirmation.customId) {
                    case "yes":


                        for (let i = 0; i < stages; i++) {

                            const stageReturn = await stageGenerator(confirmation)

                            if (stageReturn === "continue" && i >= (stages - 1)) return interaction.editReply({ content: 'Você terminou essa dungeon!', embeds: [], components: [] })
                            if (stageReturn === "finished" && i >= (stages - 1)) return interaction.editReply({ content: 'Você terminou essa dungeon!', embeds: [], components: [] })

                        }

                        break
                    case "no":
                        var updatedDb = readDb(db)
                        interaction.editReply({ content: `${user}`, embeds: [startEmbed.setTitle('Dungeon cancelada').setColor('Red').setDescription('A dungeon foi cancelada!').setImage(null)], components: [] })
                        updatedDb.inDungeon.splice(updatedDb.inDungeon.indexOf(user.id), 1)
                        writeDb(updatedDb, db)
                        break
                }

            } catch (e) {
                var updatedDb = readDb(db)
                updatedDb.inDungeon.splice(updatedDb.inDungeon.indexOf(user.id), 1)
                writeDb(updatedDb, db)
                interaction.editReply({ content: 'Demorou demais para confirmar!', embeds: [], components: [] })
                console.log(e)
            }




        }
    }
}