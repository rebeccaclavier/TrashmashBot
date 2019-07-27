import { Command, CommandMessage } from 'discord.js-commando';

import { GameClient, ErrorCard, UserCard } from '../models';
import { GuildMember } from 'discord.js';

export class AddCommand extends Command {
    private roles = ["Coffee Crew", "Mod Squad", "Host"];

    constructor(client: GameClient) {
        super(client, {
            name: 'add',
            group: 'trashmash',
            memberName: 'add',
            description: 'Adds a user to the game',
            examples: ['add <user>'],
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

        if (game) {
            if (game.addUser(user)) {
                if (game.isStarted()) {
                    const entry = game.getEntryByUser(user);

                    if (entry) {
                        return msg.say(await entry.roll());
                    } else {
                        return msg.embed(new ErrorCard("AAAAA WTF THIS SHOULDN'T HAPPEN"));
                    }
                }

                return msg.embed(new UserCard(game.getAllEntries(), user, "Added"));
            }

            return msg.embed(new ErrorCard(`${user.displayName} is already in`));
        }

        return msg.embed(new ErrorCard("No game has been created"));
    }
}