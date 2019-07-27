import { RichEmbed, GuildMember } from 'discord.js';

import { Track } from './track';

export class MashCard extends RichEmbed {
    constructor(tracks: Track[], user?: GuildMember) {
        super();
        if (user) {
            this.setAuthor(`${user.displayName}`, user.user.avatarURL)
        }

        this.setColor('#0303ff');
        let description = '';
        for (let [i, track] of tracks.entries()) {
            description += (
                `
                [${track.artist} - ${track.song}](https://www.monstercat.com/release/${track.id})
                ${track.bpm} BPM • ${track.key} • ${track.genre}
                `
            );

            if (i + 1 !== tracks.length) { description += "\nvs.\n" }
        }
        this.setDescription(description);
    }
}