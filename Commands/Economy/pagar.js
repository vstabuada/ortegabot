const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, Embed, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, escapeHeading } = require("discord.js")
const { readDb, writeDb } = require("../../Data/dbFunctions")
const { read } = require("fs")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pagar')
        .setDescription('Paga dinheiro para alguém.')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('A pessoa que você quer ver a carteira.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('moeda')
                .setDescription('Qual moeda você quer dar?')
                .setRequired(true)
                .addChoices(
                    { name: 'Ouro', value: 'gold' },
                    { name: 'Diamante', value: 'diamond' }
                )
        )
        .addIntegerOption(option =>
            option.setName('quantidade')
                .setDescription('Quantidade de moedas que você quer pagar.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('tudo')
                .setDescription('Toda a moeda selecionada da sua carteira será enviada para o destinatário!')
                .addChoices(
                    { name: 'Sim', value: 'yes' },
                    { name: 'Não', value: 'no' }
                )
        ),
    async execute(interaction) {

        const db = './Data/economy.json'
        const economyDb = readDb(db)

        const user = interaction.user
        const target = interaction.options.getUser('usuario')
        const moeda = interaction.options.getString('moeda')
        const quantity = interaction.options.getInteger('quantidade') < 0 ? interaction.options.getInteger('quantidade') * (-1) : interaction.options.getInteger('quantidade')
        const all = interaction.options.getString('tudo')


        const getUserIndex = function (user) {
            let userIndex
            economyDb.users.forEach(x => {
                if (x.id === user.id) userIndex = economyDb.users.indexOf(x)
            })
            return userIndex
        }

        if (getUserIndex(user) === undefined) return interaction.reply({ content: `Você não tem uma conta no banco digital! Seja ativo no servidor para sua conta digital ser aberta.`, ephemeral: true })
        if (getUserIndex(target) === undefined) return interaction.reply({ content: `Esse usuário não tem uma conta no banco digital!`, ephemeral: true })

        const userIndex = getUserIndex(user)
        const targetIndex = getUserIndex(target)


        const { emojis } = readDb()


        switch (moeda) {
            case "gold":

                const preGold = economyDb.users[userIndex].gold

                if (preGold < quantity && all === "no") return interaction.reply({ content: 'Você não tem **Gold** o suficiente para essa transação!', ephemeral: true })

                const posGold = all === "yes" ? 0 : preGold - quantity

                if (posGold < 0) return interaction.reply({ content: 'Você não tem **Gold** o suficiente para essa transação!', ephemeral: true })

                economyDb.users[userIndex].gold = posGold
                economyDb.users[targetIndex].gold += all === "yes" ? preGold : quantity

                const goldEmbed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                    .setColor('Green')
                    .setTitle('Transação concluída com sucesso!')
                    .setDescription(`Você deu ${emojis.gold} **${all === "yes" ? preGold : quantity}** para ${target} e ficou ${posGold === 0 ? `completamente liso!` : `com ${emojis.gold} **${posGold}**.`}`)
                    .setTimestamp()

                writeDb(economyDb, db)
                interaction.reply({ content: `${user}, ${target}`, embeds: [goldEmbed] })
                break
            case "diamond":


                const preDiamond = economyDb.users[userIndex].diamond

                if (preDiamond < quantity && all === "no") return interaction.reply({ content: 'Você não tem **Diamond** o suficiente para essa transação!', ephemeral: true })

                const posDiamond = all === "yes" ? 0 : preDiamond - quantity

                if (posDiamond < 0) return interaction.reply({ content: 'Você não tem **Diamond** o suficiente para essa transação!', ephemeral: true })

                economyDb.users[userIndex].diamond = posDiamond
                economyDb.users[targetIndex].diamond += all === "yes" ? preDiamond : quantity

                const diamondEmbed = new EmbedBuilder()
                    .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                    .setColor('Green')
                    .setTitle('Transação concluída com sucesso!')
                    .setDescription(`Você deu ${emojis.diamond} **${all === "yes" ? preDiamond : quantity}** para ${target} e ficou ${posDiamond === 0 ? `completamente liso!` : `com ${emojis.diamond} **${posDiamond}**.`}`)
                    .setTimestamp()

                writeDb(economyDb, db)
                interaction.reply({ content: `${user}, ${target}`, embeds: [diamondEmbed] })

                break
        }
    }
}