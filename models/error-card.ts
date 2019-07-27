import { RichEmbed } from 'discord.js';

export class ErrorCard extends RichEmbed {
    constructor(error: string) {
        super();
        this.setColor('#f54242');
        this.setTitle("Error");
        this.setDescription(error);
    }
}