const { EmbedBuilder } = require("discord.js")
const { GuildMember, Embed, Events } = require("discord.js")

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        try {
            const { user, guild } = member
            if (guild.id !== "1169057766204244049") return
            const welcomeChannel = guild.channels.cache.get('1224852357301403851')
            const generalChannel = guild.channels.cache.get('1169057766690787340')
            const memberRole = guild.roles.cache.get('1169060215350644806')

            const welcomeEmbed = new EmbedBuilder()
                .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                .setTitle('Seja bem-vindo(a)!')
                .setDescription(`Conheça amigos novos e tenha experiências incríveis no **Nimekai**!`)
                .setThumbnail('https://i.imgur.com/EMV93sU.gif')
                .setColor('Purple')
                .setTimestamp()

            // await welcomeChannel.send({ content: `${user}`, embeds: [welcomeEmbed] })
            await member.roles.add(memberRole)

            const generalMessages = [
                `Olha só quem chegou! Dêem as boas-vindas a ele(a). ${user}`,
                `${user} chegou. Bora pessoal, mostrem-no(a) nosso caloroso abraço de boas-vindas!`,
                `${user} desejamos que sua estadia conosco seja cheia de momentos especiais! Mostrem para ele(a) a nossa energia pessoal!`,
                `Interessante... ${user} um sujeito diferente apareceu! Mostrem-no(a) nossa recepção amorosa!`,
            ]

            const min = 0
            const max = generalMessages.length - 1
            const random = Math.floor(Math.random() * (max - min + 1)) + min

            // await generalChannel.send({ content: generalMessages[random] })

        } catch (e) {
            console.log(e)
        }

    }
}