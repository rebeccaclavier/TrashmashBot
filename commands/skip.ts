import { Command, CommandMessage } from 'discord.js-commando';

import { GameClient, ErrorCard, MashCard } from '../models';
import { GuildMember, VoiceConnection, Guild } from 'discord.js';
import ytdl from 'ytdl-core';

export class RerollCommand extends Command {
    private roles = ["Coffee Crew", "Mod Squad", "Host"];

    constructor(client: GameClient) {
        super(client, {
            name: 'skip',
            group: 'trashmash',
            memberName: 'skip',
            description: 'Skips a currently playing mash',
            examples: ['skip'],
        });
    }
    
    hasPermission(msg: CommandMessage): boolean {
        return msg.member.roles.some((role) => this.roles.includes(role.name));
    }

    async run(msg: CommandMessage) {
        const game = this.client.findGameByServer(msg.guild)

        if (game && game.isStarted()) {
            if (msg.member.voiceChannel) {
                const dispatcher = this.client.dispatchers.get(msg.guild.id);

                if (dispatcher) {
                    dispatcher.end();
                    return msg.say("Mash skipped");
                }

                return msg.embed(new ErrorCard("Nothing is currently playing"));
            }

            return msg.embed(new ErrorCard("You must be in a voice channel to use this command"));
        }

        return msg.embed(new ErrorCard("No game has been started or created"));
    }
}