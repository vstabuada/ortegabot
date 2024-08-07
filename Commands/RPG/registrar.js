const { Events, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Embed, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentBuilder, ActionRow, ComponentType, time, SimpleIdentifyThrottler } = require("discord.js")
const { readDb, writeDb } = require('../../Data/dbFunctions.js')

const db = './Data/rpg.json'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rpg-registrar')
        .setDescription('Registrar-se no sistema de RPG do NimeWorld.')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .addStringOption(option =>
            option.setName('nome')
                .setDescription('Qual vai ser o nome do seu personagem?')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('gênero')
                .setDescription('Qual vai ser o gênero do seu personagem?')
                .setRequired(true)
                .addChoices(
                    { name: 'Masculino', value: 'male' },
                    { name: 'Feminino', value: 'female' }
                )
        )
        .addStringOption(option =>
            option.setName('raça')
                .setDescription('Qual vai ser a raça do seu personagem?')
                .setRequired(true)
                .addChoices(
                    { name: 'Humano', value: 'humano' },
                    { name: 'Elfo', value: 'elfo' },
                    { name: 'Feral', value: 'feral' },
                    { name: 'Anão', value: 'anao' },
                    { name: 'Gnomo', value: 'gnomo' },
                    { name: 'Draconato', value: 'draconato' },
                )
        )
        .addStringOption(option =>
            option.setName('classe')
                .setDescription('Qual vai ser a classe do seu personagem?')
                .setRequired(true)
                .addChoices(
                    { name: 'Guerreiro', value: 'guerreiro' },
                    { name: 'Mago', value: 'mago' },
                    { name: 'Caçador', value: 'cacador' },
                    { name: 'Ladino', value: 'ladino' },
                    { name: 'Clérigo', value: 'clerigo' },
                    { name: 'Druída', value: 'druida' },
                    { name: 'Bardo', value: 'bardo' },
                )
        )
        .addStringOption(option =>
            option.setName('profissão')
                .setDescription('Qual vai ser a profissão do seu personagem?')
                .setRequired(true)
                .addChoices(
                    { name: 'Ferreiro', value: 'ferreiro' },
                    { name: 'Fazendeiro', value: 'fazendeiro' },
                    { name: 'Cozinheiro', value: 'cozinheiro' },
                    { name: 'Bibliotecário', value: 'bibliotecario' },
                    { name: 'Alquimista', value: 'alquimista' },
                    { name: 'Alfaiate', value: 'alfaiate' },
                    { name: 'Padre', value: 'padre' },
                    { name: 'Cartógrafo', value: 'cartografo' },
                )
        )
        .addStringOption(option =>
            option.setName('religião')
                .setDescription('Qual vai ser a religião do seu personagem? (BETA)')
                .addChoices(
                    { name: 'Deusa da sabedoria', value: 'sabedoria' },
                    { name: 'Deusa da guerra', value: 'guerra' },
                    { name: 'Deusa da colheita', value: 'colheita' },
                    { name: 'Deusa do comércio', value: 'comercio' },
                )
        ),
    async execute(interaction, client) {

        const user = interaction.user

        const checkUser = function () {
            const database = readDb(db)
            let result = false
            database.players.forEach(x => {
                if (x.id === user.id) result = true
            })
            return result
        }

        const checkNick = function (y) {
            const database = readDb(db)
            let result = false
            database.players.forEach(x => {
                if (x.profile.name.toLowerCase() == y.toLowerCase()) result = true
            })
            return result
        }

        if (checkUser()) return interaction.reply({ content: `Você já está registrado no RPG!`, ephemeral: true })

        const name = interaction.options.getString('nome')
        const gender = interaction.options.getString('gênero')
        const race = interaction.options.getString('raça')
        const class_ = interaction.options.getString('classe')
        const profession = interaction.options.getString('profissão')
        const religion = interaction.options.getString('religião') || null

        if (checkNick(name)) return interaction.reply({ content: `Já existe um jogador com esse nome!`, ephemeral: true })

        const alpnumRegex = new RegExp('[^A-Za-z0-9 ]')

        if (alpnumRegex.test(name)) return interaction.reply({ content: `${user} O nome do seu personagem pode conter apenas letras, números e espaços!`, ephemeral: true })

        let race0
        let class0
        let profession0

        switch (race) {
            case "humano":
                race0 = "human"
                break
            case "elfo":
                race0 = "elf"
                break
            case "feral":
                race0 = "feral"
                break
            case "anao":
                race0 = "dwarf"
                break
            case "gnomo":
                race0 = "gnome"
                break
            case "draconato":
                race0 = "dragonborn"
                break

        }

        switch (class_) {
            case "guerreiro":
                class0 = "warrior"
                break
            case "mago":
                class0 = "mage"
                break
            case "cacador":
                class0 = "hunter"
                break
            case "ladino":
                class0 = "rogue"
                break
            case "clerigo":
                class0 = "cleric"
                break
            case "druida":
                class0 = "druid"
                break
            case "bardo":
                class0 = "bard"
                break
        }

        switch (profession) {
            case "ferreiro":
                profession0 = "blacksmith"
                break
            case "fazendeiro":
                profession0 = "farmer"
                break
            case "cozinheiro":
                profession0 = "chef"
                break
            case "bibliotecario":
                profession0 = "librarian"
                break
            case "alquimista":
                profession0 = "alchemist"
                break
            case "alfaiate":
                profession0 = "tailor"
                break
            case "padre":
                profession0 = "priest"
                break
            case "cartografo":
                profession0 = "cartographer"
                break
        }


        const newPlayer = {
            id: interaction.user.id,
            status: {
                healthPoints: 100,
                maxHealthPoints: 100,
                manaPoints: 100,
                maxManaPoints: 100,
            },
            profile: {
                name: name,
                gender: gender,
                level: 1,
                experience: 1000,
                tier: 'F',
                race: race0,
                class: class0,
                profession: profession0,
                religion: {
                    name: religion,
                    faith: 0,
                },
                attributes: {
                    points: {
                        availablePoints: 0,
                        spentPoints: 0,
                    },
                    vitality: 1,
                    resistence: 1,
                    strength: 1,
                    dexterity: 1,
                    intelligence: 1,
                    wisdom: 1,
                    charisma: 1
                },
                badges: [],
                titles: {
                    equipped: "BETA TESTER",
                    list: ["Novato", "BETA TESTER"]
                }
            },
            inventory: {
                equipped: {
                    weapons: {
                        mainHand: {},
                        offHand: {}
                    },
                    accessories: {
                        head: {},
                        face: {},
                        back: {},
                        ring: {},
                        necklace: {},
                        glove: {},
                        waist: {},
                    },
                    armor: {
                        helmet: {},
                        chestplate: {},
                        leggings: {},
                        boots: {},
                    }
                },
                items: [],
                weapons: [],
                tools: [],
                equipment: [],
                consumables: {
                    selfUse: [],
                    fightUse: []
                },
                musicSheets: {
                    toLearn: [],
                    musics: []
                }
            },
            skills: {
                passiveSkills: [],
                activeSkills: [],
                ultimateSkills: [],
                uniqueSkill: {}
            }
        }


        const allocatePoints = function (att) {
            switch (class_) {
                case "guerreiro":
                    att.vitality += 5
                    att.resistence += 3
                    att.strength += 7
                    att.dexterity += 5
                    att.intelligence += 0
                    att.wisdom += 0
                    att.charisma += 0
                    break
                case "mago":
                    att.vitality += 5
                    att.resistence += 1
                    att.strength += 1
                    att.dexterity += 2
                    att.intelligence += 9
                    att.wisdom += 2
                    att.charisma += 0
                    break
                case "cacador":
                    att.vitality += 4
                    att.resistence += 2
                    att.strength += 2
                    att.dexterity += 8
                    att.intelligence += 0
                    att.wisdom += 4
                    att.charisma += 0
                    break
                case "ladino":
                    att.vitality += 4
                    att.resistence += 1
                    att.strength += 2
                    att.dexterity += 8
                    att.intelligence += 0
                    att.wisdom += 3
                    att.charisma += 2
                    break
                case "clerigo":
                    att.vitality += 4
                    att.resistence += 0
                    att.strength += 1
                    att.dexterity += 2
                    att.intelligence += 2
                    att.wisdom += 7
                    att.charisma += 4
                    break
                case "druida":
                    att.vitality += 6
                    att.resistence += 1
                    att.strength += 2
                    att.dexterity += 3
                    att.intelligence += 1
                    att.wisdom += 7
                    att.charisma += 0
                    break
                case "bardo":
                    att.vitality += 4
                    att.resistence += 0
                    att.strength += 0
                    att.dexterity += 5
                    att.intelligence += 0
                    att.wisdom += 1
                    att.charisma += 10
                    break
            }
            switch (race) {
                case "humano":
                    att.vitality += 1
                    att.resistence += 1
                    att.strength += 1
                    att.dexterity += 1
                    att.intelligence += 2
                    att.wisdom += 1
                    att.charisma += 3
                    break
                case "elfo":
                    att.vitality += 2
                    att.resistence += 0
                    att.strength += 0
                    att.dexterity += 4
                    att.intelligence += 2
                    att.wisdom += 2
                    att.charisma += 0
                    break
                case "feral":
                    att.vitality += 3
                    att.resistence += 2
                    att.strength += 4
                    att.dexterity += 1
                    att.intelligence += 0
                    att.wisdom += 0
                    att.charisma += 0
                    break
                case "anao":
                    att.vitality += 4
                    att.resistence += 2
                    att.strength += 3
                    att.dexterity += 0
                    att.intelligence += 0
                    att.wisdom += 1
                    att.charisma += 0
                    break
                case "gnomo":
                    att.vitality += 0
                    att.resistence += 0
                    att.strength += 0
                    att.dexterity += 2
                    att.intelligence += 4
                    att.wisdom += 3
                    att.charisma += 1
                    break
                case "draconato":
                    att.vitality += 2
                    att.resistence += 4
                    att.strength += 3
                    att.dexterity += 0
                    att.intelligence += 0
                    att.wisdom += 1
                    att.charisma += 0
                    break
            }
        }

        const allocateStatus = function (stt, vit) {
            stt.maxHealthPoints = (vit * 10) + 100
            stt.maxManaPoints = (vit * 10) + 100

            stt.healthPoints = stt.maxHealthPoints
            stt.manaPoints = stt.maxManaPoints
        }

        const allocateItems = function (inv) {

            const potions = { id: "life_potion", quantity: 5 }
            inv.consumables.selfUse.push(potions)

            // Armamentos
            const sword = "wooden_sword"
            const wand = "basic_wand"
            const bow = "basic_bow"
            const rapier = "worn_rapier"
            const dagger = "basic_dagger"
            const cross = "wooden_cross"
            const staff = "wooden_staff"
            const lute = "basic_lute"

            // Itens de Classe
            const warriorBombs = { id: "little_bomb", quantity: 10 }
            const magePotions = { id: "mana_potion", quantity: 8 }
            const hunterTraps = { id: "portable_ambush", quantity: 10 }
            const rogueSmoke = { id: "smoke_grenade", quantity: 10 }
            const clericWater = { id: "holy_water", quantity: 8, }
            const druidMushroom = { id: "magic_mushroom", quantity: 8 }
            const bardBook = { id: "sheet_music_book", quantity: 0 }


            switch (class_) {
                case "guerreiro":
                    inv.equipped.weapons.mainHand = sword
                    inv.consumables.fightUse.push(warriorBombs)
                    break
                case "mago":
                    inv.equipped.weapons.mainHand = wand
                    inv.equipped.weapons.offHand = dagger
                    inv.consumables.selfUse.push(magePotions)
                    break
                case "cacador":
                    inv.equipped.weapons.mainHand = bow
                    inv.equipped.weapons.offHand = dagger
                    inv.consumables.fightUse.push(hunterTraps)
                    break
                case "ladino":
                    inv.equipped.weapons.mainHand = rapier
                    inv.equipped.weapons.offHand = dagger
                    inv.consumables.fightUse.push(rogueSmoke)
                    break
                case "clerigo":
                    inv.equipped.weapons.mainHand = cross
                    inv.equipped.weapons.offHand = dagger
                    inv.consumables.selfUse.push(clericWater)
                    break
                case "druida":
                    inv.equipped.weapons.mainHand = staff
                    inv.equipped.weapons.offHand = dagger
                    inv.consumables.selfUse.push(druidMushroom)
                    break
                case "bardo":
                    inv.equipped.weapons.mainHand = lute
                    inv.equipped.weapons.offHand = dagger
                    inv.consumables.selfUse.push(bardBook)
                    break
            }


            const blacksmithTool = { name: "Martelo de ferreiro básico", quantity: 0, id: "basic_blacksmith_hammer" }
            const farmerTool = { name: "Enxada básica", quantity: 0, id: "basic_hoe" }
            const chefTool = { name: "Panela básica", quantity: 0, id: "basic_pan" }
            const librarianTool = { name: "Livro de feitiços básico", quantity: 0, id: "basic_spell_book" }
            const alchemistTool = { name: "Suporte de poções portátil", quantity: 0, id: "portable_brewing_stand" }
            const tailorTool = { name: "Agulha mágica básica", quantity: 0, id: "basic_magic_needle" }
            const priestTool = { name: "Bíblia", quantity: 0, id: "bible" }
            const cartographerTool = { name: "Papiro mágico", quantity: 0, id: "magic_papyrus" }

            switch (profession) {
                case "ferreiro":
                    inv.tools.push(blacksmithTool)
                    break
                case "fazendeiro":
                    inv.tools.push(farmerTool)
                    break
                case "cozinheiro":
                    inv.tools.push(chefTool)
                    break
                case "bibliotecario":
                    inv.tools.push(librarianTool)
                    break
                case "alquimista":
                    inv.tools.push(alchemistTool)
                    break
                case "alfaiate":
                    inv.tools.push(tailorTool)
                    break
                case "padre":
                    inv.tools.push(priestTool)
                    break
                case "cartografo":
                    inv.tools.push(cartographerTool)
                    break
            }
        }

        allocatePoints(newPlayer.profile.attributes)

        allocateStatus(newPlayer.status, newPlayer.profile.attributes.vitality)

        allocateItems(newPlayer.inventory)

        const rpgdb = readDb(db)
        rpgdb.players.push(newPlayer)

        writeDb(rpgdb, db)

        const getClassIcon = function (x) {
            const { classIcons } = readDb('./Data/rpg.json')
            switch (x) {
                case "guerreiro":
                    return classIcons[0].iconURL
                case "mago":
                    return classIcons[1].iconURL
                case "cacador":
                    return classIcons[2].iconURL
                case "ladino":
                    return classIcons[3].iconURL
                case "clerigo":
                    return classIcons[4].iconURL
                case "druida":
                    return classIcons[5].iconURL
                case "bardo":
                    return classIcons[6].iconURL
            }
        }


        const successEmbed = new EmbedBuilder()
            .setAuthor({ name: name, iconURL: getClassIcon(class_) || user.displayAvatarURL() })
            .setTitle('Parabéns, você se registrou no RPG!')
            .setColor("Green")
            .setTimestamp()
            .setDescription(`Use \`/rpg-perfil\` para ver seu certificado de aventureiro!`)
            .setFooter({ text: user.username, iconURL: user.displayAvatarURL() })

        interaction.reply({ content: `${user}`, embeds: [successEmbed] })

    }
}