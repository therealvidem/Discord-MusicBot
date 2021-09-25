const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "move",
    description: "Moves a track to specified spot in the queue.",
    usage: "<number> <number>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["m"],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, message, args, { GuildDB }) => {
        let player = await client.Manager.get(message.guild.id);
        if (!player) return client.sendTime(message.channel, "❌ | **Nothing is playing right now...**");
        if (!args[0] || !args[1]) return client.sendTime(message.channel, "❌ | **Invalid track number.**");
        
        // Check if (args[0] - 1) and (args[1] - 1) are valid indices
        let sourceTrackNum = parseInt(args[0] - 1);
        let destinationTrackNum = parseInt(args[1] - 1);
        if ((sourceTrackNum < 0 || sourceTrackNum > player.queue.length - 1)
         || (destinationTrackNum < 0 || destinationTrackNum > player.queue.length - 1)) {
			    return client.sendTime(message.channel, "❌ | **Invalid track number.**");
        }
        if (sourceTrackNum == destinationTrackNum) {
          return client.sendTime(message.channel, "❌ | **Source and destination tracks cannot be the same.**");
        }
        
        // Remove from and shift array
        const track = player.queue[sourceTrackNum];
        player.queue.splice(sourceTrackNum, 1);
        player.queue.splice(destinationTrackNum, 0, track);
		    client.sendTime(message.channel, "✅ | **" + track.title + "** has been moved from " + (sourceTrackNum + 1) + " to " + (destinationTrackNum + 1) + ".");
    },

    SlashCommand: {
      options: [
          {
              name: "sourceTrack",
              value: "sourceTrack",
              type: 4,
              required: true,
              description: "The number of the track to move.",
          },
          {
              name: "destinationTrack",
              value: "destinationTrack",
              type: 4,
              required: true,
              description: "The number to which the source track should move.",
          },
      ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
        run: async (client, interaction, args, { GuildDB }) => {
            const guild = client.guilds.cache.get(interaction.guild_id);
            const member = guild.members.cache.get(interaction.member.user.id);
            
            let player = await client.Manager.get(interaction.guild.id);
            if (!player) return client.sendTime(interaction, "❌ | **Nothing is playing right now...**");
            if (!args[0].value || !args[1].value) return client.sendTime(interaction, "❌ | **Invalid track number.**");
            
            // Check if (args[0] - 1) and (args[1] - 1) are valid indices
            let sourceTrackNum = parseInt(args[0] - 1);
            let destinationTrackNum = parseInt(args[1] - 1);
            if ((sourceTrackNum < 0 || sourceTrackNum > player.queue.length - 1)
            || (destinationTrackNum < 0 || destinationTrackNum > player.queue.length - 1)) {
              return client.sendTime(interaction, "❌ | **Invalid track number.**");
            }
            if (sourceTrackNum == destinationTrackNum) {
              return client.sendTime(interaction, "❌ | **Source and destination tracks cannot be the same.**");
            }
            
            // Remove from and shift array
            const track = player.queue[sourceTrackNum];
            player.queue.splice(sourceTrackNum, 1);
            player.queue.splice(destinationTrackNum, 0, track);
            client.sendTime(interaction, "✅ | **" + track.title + "** has been moved from " + (sourceTrackNum + 1) + " to " + (destinationTrackNum + 1) + ".");
        },
    },
};