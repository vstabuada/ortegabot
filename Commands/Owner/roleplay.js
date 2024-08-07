const { SlashCommandBuilder, PermissionFlagsBits, escapeHeading, EmbedBuilder, Embed } = require("discord.js");

const choices = [
    { name: 'Abraçar', value: 'hug' },
    { name: 'Carinho', value: 'pat' },
    { name: 'Beijar', value: 'kiss' },
    { name: 'Morder', value: 'bite' },
    { name: 'Piscar', value: 'wink' },
    { name: 'Lamber', value: 'lick' },
    { name: 'Estapear', value: 'slap' },
    { name: 'Acenar', value: 'wave' },
    { name: 'Chutar', value: 'kick' },
    { name: 'Cumprimentar', value: 'highfive' },
    { name: 'Cutucar', value: 'poke' }
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roleplay')
        .setDescription('Roleplay.')
        .setDefaultMemberPermissions(PermissionFlagsBits.UseApplicationCommands)
        .addStringOption(option =>
            option.setName('interação')
                .setDescription('Interação que você vai executar.')
                .setRequired(true)
                .addChoices(choices)
        )
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('Usuário alvo da interação.')
                .setRequired(true)
        ),
    async execute(interaction) {
        // if (interaction.user.id !== "545314209865531398") return interaction.reply({ content: 'Esse comando está reservado apenas para o dono do bot!', ephemeral: true })

        const category = interaction.options.getString('interação')
        const target = interaction.options.getUser('usuário')
        const user = interaction.user

        async function getAction() {
            return await fetch(`https://api.waifu.pics/sfw/${category}`).then(res => res.json()).then(json => json.url)
        }

        const midia = user.id !== target.id ? await getAction() : undefined

        const generateEmbed = (action, gif) => {
            let title
            let color
            let error

            const [pink, red, green] = ['LuminousVividPink', 'Red', 'Green']

            switch (action) {
                case 'hug':
                    title = `${user.username} abraçou ${target.username}!`
                    color = green
                    error = 'abraçar a'
                    break
                case 'pat':
                    title = `${user.username} fez carinho em ${target.username}!`
                    color = green
                    error = 'fazer carinho em'
                    break
                case 'kiss':
                    title = `${user.username} beijou ${target.username}!`
                    color = pink
                    error = 'beijar a'
                    break
                case 'bite':
                    title = `${user.username} mordeu ${target.username}!`
                    color = pink
                    error = 'morder a'
                    break
                case 'wink':
                    title = `${user.username} piscou para ${target.username}!`
                    color = pink
                    error = 'piscar para'
                    break
                case 'lick':
                    title = `${user.username} lambeu ${target.username}!`
                    color = pink
                    error = 'lamber a'
                    break
                case 'slap':
                    title = `${user.username} estapeou ${target.username}!`
                    color = red
                    error = 'estapear a'
                    break
                case 'wave':
                    title = `${user.username} acenou para ${target.username}!`
                    color = green
                    error = 'acenar a'
                    break
                case 'kick':
                    title = `${user.username} chutou ${target.username}!`
                    color = red
                    error = 'chutar a'
                    break
                case 'highfive':
                    title = `${user.username} cumprimentou ${target.username}!`
                    color = green
                    error = 'cumprimentar a'
                    break
                case 'poke':
                    title = `${user.username} cutucou ${target.username}!`
                    color = green
                    error = 'cutucar a'
                    break
            }

            if (user.id === target.id) return `Você não pode ${error} si mesmo!`

            return new EmbedBuilder()
                .setTitle(title)
                .setColor(color)
                .setImage(gif)

        }

        if (midia && user.id !== target.id) {
            return interaction.reply({ content: `${user}, ${target}`, embeds: [generateEmbed(category, midia)] })
        } else if (user.id === target.id) {
            return interaction.reply({ content: generateEmbed(category, midia), ephemeral: true })
        } else {
            return interaction.reply({ content: 'Algo deu errado, tente novamente...', ephemeral: true })
        }
    }
}