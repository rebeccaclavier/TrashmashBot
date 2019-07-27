import { Command, CommandMessage } from 'discord.js-commando';

import { GameClient, ErrorCard } from '../models';
import { GuildMember } from 'discord.js';

export class RerollCommand extends Command {
    private roles = ["Coffee Crew", "Mod Squad", "Host"];

    constructor(client: GameClient) {
        super(client, {
            name: 'reroll',
            group: 'trashmash',
            memberName: 'reroll',
            description: 'Rerolls a user to the game',
            examples: ['reroll <user>'],
            args: [
                {
                    key: 'user',
                    prompt: 'User to add',
                    type: 'member'
                }
            ]
        });
    }
    
    hasPermission(msg: CommandMessage): boolean {
        return msg.member.roles.some((role) => this.roles.includes(role.name));
    }

    async run(msg: CommandMessage, { user }: { user: GuildMember }) {
        const game = this.client.findGameByServer(msg.guild)

        if (game && game.isStarted()) {
            const entry = game.getEntryByUser(user);
            if (entry) {
                return msg.say(await entry.roll());
            } else {
                return msg.embed(new ErrorCard(`${user.displayName} is not in`));
            }
        }

        return msg.embed(new ErrorCard("No game has been started or created"));
    }
}