const { EmbedBuilder } = require("discord.js")
const { GuildMember, Embed, Events } = require("discord.js")
const { readDb, writeDb } = require("../../Data/dbFunctions")

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.guild.id !== "1169057766204244049") return

        const user = message.author

        if (user.bot) return



        const target = await message.guild.members.fetch(user.id)

        const nitroRole = "1169122489503330305"



        const updateExperience = async function () {
            const levelupChannel = message.guild.channels.cache.get("1169138553658290176")
            const db = './Data/xp.json'
            const xpDb = readDb(db)



            if (xpDb.onCooldown.indexOf(user.id) >= 0) return


            const findUser = function () {
                let userI
                xpDb.users.forEach(x => {
                    if (x.id === user.id) userI = xpDb.users.indexOf(x)
                })
                return userI
            }

            let userIndex = findUser()

            if (userIndex === undefined) {
                const newUser = {
                    id: user.id,
                    xp: 0,
                    lvl: 0
                }
                xpDb.users.push(newUser)
                userIndex = xpDb.users.indexOf(newUser)
            }

            const getRandom = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }


            const xpNitroBoost = 1.5
            const xpBoost = 1
            const xp1 = xpDb.users[userIndex].xp
            const xp2 = parseInt(xp1 + ((getRandom(15, 30) * xpBoost) * (target.roles.cache.has(nitroRole) ? xpNitroBoost : 1)))
            const lvl1 = xp1 > 0 ? parseInt(xp1 / 1000) : 0
            const lvl2 = parseInt(xp2 / 1000)


            const updateRoles = async function () {

                const embed = new EmbedBuilder()
                let newRole = false
                let id

                xpDb.levelRoles.forEach(async x => {

                    if (lvl2 >= x.level) { // Se o membro ter nível suficiente

                        if (!target.roles.cache.has(x.id)) { // Se o membro não ter o cargo


                            if (lvl1 < lvl2 && lvl2 == x.level) {
                                newRole = true
                                id = x.id
                            }

                            const role = await message.guild.roles.cache.get(x.id)
                            target.roles.add(role)
                        }
                    } else if (lvl2 < x.level && target.roles.cache.has(x.id)) { // Se o membro não tiver nível suficiente mas mesmo assim ter o cargo

                        const role = await message.guild.roles.cache.get(x.id)
                        target.roles.remove(role)

                    }
                })

                return [embed, newRole, id]
            }

            const result = await updateRoles()





            setTimeout(async () => {
                const levelupEmbed = result[0]

                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                    .setTitle(`. <a:happy_nk:1169324208363405422>・゜✭・【LEVEL UP!】・✫゜・<:happy_nk:1169324208363405422> .`)
                    .setDescription(result[1] ? `Parabéns '${user}', você subiu para o nível '**${lvl2}**'!\nVocê conseguiu um cargo novo: <@&${result[2]}>` : `Parabéns '${user}', você subiu para o nível '**${lvl2}**'!`)
                    .setThumbnail('https://gifdb.com/images/high/level-up-498-x-498-gif-j9sek7bhdq1ft4pv.gif')
                    .setColor('LuminousVividPink')
                    .setTimestamp()

                if (lvl1 < lvl2) {
                    await levelupChannel.send({ content: `${user}`, embeds: [levelupEmbed] })
                }
            }, 1000)






            xpDb.users[userIndex].xp = xp2
            xpDb.users[userIndex].lvl = lvl2

            xpDb.onCooldown.push(user.id)


            writeDb(xpDb, db)

            setTimeout(() => {
                try {
                    const xpDb2 = readDb(db)
                    xpDb2.onCooldown.splice(xpDb.onCooldown.indexOf(user.id), 1)
                    writeDb(xpDb2, db)
                } catch (e) {
                    console.log(e)
                }
            }, 20000)

        }


        const updateEconomy = async function () {
            const db = './Data/economy.json'
            const economyDb = readDb(db)

            if (economyDb.onCooldown.indexOf(user.id) >= 0) return


            const findUser = function () {
                let userI
                economyDb.users.forEach(x => {
                    if (x.id === user.id) userI = economyDb.users.indexOf(x)
                })
                return userI
            }

            let userIndex = findUser()

            if (userIndex === undefined) {
                const newUser = {
                    id: user.id,
                    gold: 0,
                    diamond: 0,
                    nimekoin: 0,
                    inventory: []
                }
                economyDb.users.push(newUser)
                userIndex = economyDb.users.indexOf(newUser)
            }

            const getRandom = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

            const goldBoost = 1
            const gold = economyDb.users[userIndex].gold
            const newGold = parseInt(gold + getRandom(1, 5) * goldBoost)

            const diamondBoost = 1
            const diamondNitroBoost = 2
            const diamond = economyDb.users[userIndex].diamond
            const newDiamond = parseInt(diamond + (((getRandom(1, 30) === 30 ? 1 : 0) * diamondBoost) * (target.roles.cache.has(nitroRole) ? diamondNitroBoost : 1)))

            economyDb.users[userIndex].gold = newGold
            economyDb.users[userIndex].diamond = newDiamond

            economyDb.onCooldown.push(user.id)

            writeDb(economyDb, db)

            setTimeout(() => {
                try {
                    const economyDb2 = readDb(db)
                    economyDb2.onCooldown.splice(economyDb2.onCooldown.indexOf(user.id), 1)
                    writeDb(economyDb2, db)
                } catch (e) {
                    console.log(e)
                }
            }, 60000)

        }


        updateExperience()
        updateEconomy()
    }
}