const { Events, SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Embed, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentBuilder, ActionRow, ComponentType, time, SimpleIdentifyThrottler } = require("discord.js")
const { readDb, writeDb } = require('../../Data/dbFunctions.js')
const { getClassIcon, translateStats } = require("../../RPG/RPGHandlers/generalHandlers.js")
const { createEnemy } = require("../../RPG/Enemies/enemyHandler.js")

const db = './Data/rpg.json'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev-criar')
        .setDescription('Cria um item/mob novo no NimeWorld.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName('enemy')
                .setDescription('Cria um inimigo novo no NimeWorld.')
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('ID do inimigo. Exemplo => lava_slime')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('nome')
                        .setDescription('Nome do inimigo. Exemplo => Slime de lava')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('nivel')
                        .setDescription('Nível do inimigo. (1 => 1100)')
                        .setMaxValue(1100)
                        .setMinValue(1)
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('vida')
                        .setDescription('Vida do inimigo. (1 => 10.000.000)')
                        .setMaxValue(10000000)
                        .setMinValue(1)
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('dano')
                        .setDescription('Dano do inimigo. (0 => 100.000)')
                        .setMaxValue(100000)
                        .setMinValue(0)
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('resistencia')
                        .setDescription('Resistência do inimigo. (0 => 100.000)')
                        .setMaxValue(100000)
                        .setMinValue(0)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('descricao')
                        .setDescription('Descrição do inimigo.')
                        .setMaxLength(2555)
                        .setMinLength(1)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('icon')
                        .setDescription('Icon do inimigo. Exemplo => https://i.imgur.com/KsfjaoOSXA.png')
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('consumable')
                .setDescription('Cria um item consumível novo no NimeWorld.')
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('ID do item. Exemplo => life_potion')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('nome')
                        .setDescription('Nome do item. Exemplo => Poção de vida')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('weapon')
                .setDescription('Cria uma arma nova no NimeWorld.')
                .addStringOption(option =>
                    option.setName('id')
                        .setDescription('ID da arma. Exemplo => wooden_sword')
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('nome')
                        .setDescription('Nome da arma. Exemplo => Espada de madeira')
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option.setName('nivel')
                        .setDescription('Nível da arma. (1 => 1100)')
                        .setMinValue(1)
                        .setMaxValue(1100)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('classe')
                        .setDescription('Classe da arma.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Coringa', value: 'joker' },
                            { name: 'Guerreiro', value: 'warrior' },
                            { name: 'Mago', value: 'mage' },
                            { name: 'Caçador', value: 'hunter' },
                            { name: 'Ladino', value: 'rogue' },
                            { name: 'Clérigo', value: 'cleric' },
                            { name: 'Druída', value: 'druid' },
                            { name: 'Bardo', value: 'bard' },
                        )
                )
                .addIntegerOption(option =>
                    option.setName('dano')
                        .setDescription('Dano da arma. (0 => 1.000.000)')
                        .setMinValue(0)
                        .setMaxValue(1000000)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('elemento')
                        .setDescription('Qual o elemento da arma?')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Nenhum', value: 'none' },
                            { name: 'Água', value: 'water' },
                            { name: 'Gelo', value: 'ice' },
                            { name: 'Terra', value: 'earth' },
                            { name: 'Vida', value: 'life' },
                            { name: 'Fogo', value: 'fire' },
                            { name: 'Energia', value: 'energy' },
                            { name: 'Ar', value: 'air' },
                            { name: 'Espaço', value: 'space' },
                            { name: 'Sombra', value: 'shadow' },
                            { name: 'Trevas', value: 'darkness' },
                            { name: 'Luz', value: 'light' },
                            { name: 'Divino', value: 'divine' },
                        )
                )
                .addIntegerOption(option =>
                    option.setName('bonus')
                        .setDescription('Bônus de skill da arma. (10 => 200)')
                        .setMinValue(10)
                        .setMaxValue(200)
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('descricao')
                        .setDescription('Adicione uma descrição para a arma. (pt-BR)')
                        .setMinLength(1)
                        .setMaxLength(2555)
                        .setRequired(true)
                )

        ),
    async execute(interaction, client) {
        const devs = ["545314209865531398", "579364877014138890"]
        if (devs.indexOf(interaction.user.id) < 0) return interaction.reply({ content: 'Esse comando é restrito apenas para os desenvolvedores!', ephemeral: true })

        const subcommand = interaction.options.getSubcommand()
        const user = interaction.user


        switch (subcommand) {
            case "enemy":
                const generateEnemy = function () {
                    const id = interaction.options.getString('id').toLowerCase()
                    const nome = interaction.options.getString('nome')
                    const nivel = interaction.options.getInteger('nivel')
                    const vida = interaction.options.getInteger('vida')
                    const dano = interaction.options.getInteger('dano')
                    const resistencia = interaction.options.getInteger('resistencia')
                    const descricao = interaction.options.getString('descricao')
                    const icon = interaction.options.getString('icon')




                    const embed = new EmbedBuilder()
                        .setTitle('Novo inimigo criado com sucesso!')
                        .setDescription(descricao)
                        .setAuthor({ name: `${nome} | Nível: ${nivel}`, iconURL: icon })
                        .setColor('Random')
                        .addFields(
                            { name: 'Vida', value: vida.toLocaleString(), inline: true },
                            { name: 'Dano', value: dano.toLocaleString(), inline: true },
                            { name: 'Resistência', value: resistencia.toLocaleString(), inline: true },
                        )
                        .setFooter({ text: `ID: ${id}` })
                        .setTimestamp()

                    const enemy = {
                        id: id,
                        name: nome,
                        level: nivel,
                        description: descricao,
                        icon: icon,
                        stats: {
                            life: vida,
                            damage: dano,
                            resistence: resistencia
                        }
                    }

                    createEnemy(id)

                    setTimeout(() => { writeDb(enemy, `./RPG/Enemies/${id}.json`) }, 1000)


                    return embed
                }

                const embed = generateEnemy()

                interaction.reply({ content: `${user}`, embeds: [embed] })

                break
            case "consumable":
                interaction.reply({ content: 'Esse comando não está pronto ainda!', ephemeral: true })
                break
            case "weapon":
                interaction.reply({ content: 'Esse comando não está pronto ainda!', ephemeral: true })
                break
        }



    }
}