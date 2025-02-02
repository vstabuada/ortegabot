const { EmbedBuilder } = require("discord.js")
const { GuildMember, Embed, Events } = require("discord.js")

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        try {
            const { user, guild } = member
            if (guild.id !== "1169057766204244049") return
            const goodbyeChannel = guild.channels.cache.get('1224852357301403851')

            const goodbyeEmbed = new EmbedBuilder()
                .setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
                .setTitle('Adeus!')
                .setDescription(`Espero que um dia você retorne...`)
                .setThumbnail('https://tenor.com/view/bye-gif-19356296.gif')
                .setColor('Red')
                .setTimestamp()

            // await goodbyeChannel.send({ content: `<@${user.id}>`, embeds: [goodbyeEmbed] })

        } catch (e) {
            console.log(e)
        }

    }
}