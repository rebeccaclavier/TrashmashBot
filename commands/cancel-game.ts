import { Command, CommandMessage } from 'discord.js-commando';

import rimraf from 'rimraf';

import { GameClient, ErrorCard } from '../models';
import { RichEmbed } from 'discord.js';

export class CancelCommand extends Command {
    private roles = ["Coffee Crew", "Mod Squad", "Host"];

    constructor(client: GameClient) {
        super(client, {
            name: 'cancel',
            group: 'trashmash',
            memberName: 'cancel',
            description: 'Cancel a trashmash early',
            examples: ['cancel']
        });
    }
    
    hasPermission(msg: CommandMessage): boolean {
        return msg.member.roles.some((role) => this.roles.includes(role.name));
    }

    run(msg: CommandMessage) {
        if (this.client.deleteGame(msg.guild)) {
            rimraf.sync(this.client.dir + `/${msg.guild.id}`);
            this.client.log(msg.guild, 'Game cancelled, folder deleted')

            const dispatcher = this.client.dispatchers.get(msg.guild.id);

            if (dispatcher) {
                this.client.queue.delete(msg.guild.id);
                dispatcher.end('cancelled');
            }

            return msg.embed(new RichEmbed()
                .setTitle("Trashmash")
                .setColor('#0303ff')
                .setDescription("Game cancelled")
            );
        }

        return msg.embed(new ErrorCard("No game has been created"));
    }
}