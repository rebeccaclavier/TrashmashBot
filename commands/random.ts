import { Command, CommandMessage } from 'discord.js-commando';

import { GameClient } from '../models';
import { TracksService } from '../services';
import { MashCard } from '../models';

export class RandomCommand extends Command {
    private tracksSerivce = new TracksService();

    constructor(client: GameClient) {
        super(client, {
            name: 'random',
            group: 'commands',
            memberName: 'random',
            description: 'Returns a random mash',
            examples: ['random', 'random 3'],
            args: [
                {
                    key: 'count',
                    prompt: 'Number of tracks to return (default of 2)',
                    type: 'integer',
                    default: 2
                }
            ]
        });
    }

    async run(msg: CommandMessage, { count }: { count: number }) {
        const tracks = await this.tracksSerivce.getTracks(count);
        const mashCard = new MashCard(tracks);
        return msg.embed(mashCard);
    }
}