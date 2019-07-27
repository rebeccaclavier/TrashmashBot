import { Command, CommandMessage } from 'discord.js-commando';
import { mkdirSync } from 'fs';
import rimraf from 'rimraf';

import { GameClient, ErrorCard } from '../models';
import { RichEmbed } from 'discord.js';

export class CreateCommand extends Command {
    private roles = ["Coffee Crew", "Mod Squad", "Host"];

    constructor(client: GameClient) {
        super(client, {
            name: 'create',
            group: 'trashmash',
            memberName: 'create',
            description: 'Creates a trashmash',
            examples: ['create', 'create 3'],
            args: [
                {
                    key: 'count',
                    prompt: 'Number of tracks in each mash (default of 2)',
                    type: 'integer',
                    default: 2
                }
            ]
        });
    }
    
    hasPermission(msg: CommandMessage): boolean {
        return msg.member.roles.some((role) => this.roles.includes(role.name));
    }

    fmtCmd(command: string): string {
        return "`" + this.client.commandPrefix + command + "`";
    }

    run(msg: CommandMessage, { count }: { count: number }) {
        if (this.client.createGame(msg.guild, count)) {
            rimraf.sync(`${this.client.dir}/${msg.guild.id}`);
            mkdirSync(`${this.client.dir}/${msg.guild.id}`);
            this.client.log(msg.guild, `New game created, created folder`);

            const embed = new RichEmbed()
                .setColor('#0303ff')
                .setDescription(
                    `
                    **New Trashmash game created**

                    ${this.fmtCmd("add")} to add a user
                    ${this.fmtCmd("remove")} to remove a user
                    ${this.fmtCmd("start")} to start the game
                    ${this.fmtCmd("cancel")} to cancel the game
                    `
                );
            
            return msg.embed(embed);
        }

        return msg.embed(new ErrorCard("A game has already been created"));
    }
}