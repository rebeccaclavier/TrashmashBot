import { CommandoClient } from 'discord.js-commando';
import { Game, Entry } from './';
import { Guild, StreamDispatcher, VoiceConnection, RichEmbed } from 'discord.js';
import chalk from 'chalk';
import { CommandMessage } from 'discord.js-commando';
import rimraf from 'rimraf';
import { EventEmitter } from 'events';
//@ts-ignore
import randomEmoji from 'emoji-random';

interface PollEntry {
    emoji: string,
    entry: Entry,
    votes: {
        best: number,
        effort: number,
        funny: number
    }
}

declare module 'discord.js-commando' {
    interface CommandoClient {
        dispatchers: Map<string, StreamDispatcher>
        queue: Map<string, Entry[]>
        dir: string;

        log(server: Guild, message: string, error?: boolean): void
        isGameCreated(server: Guild): boolean
        findGameByServer(server: Guild): Game | undefined
        playFromQueue(server: Guild, connection: VoiceConnection, msg: CommandMessage): void
        createGame(server: Guild, count: number): boolean
        deleteGame(server: Guild): boolean
    }
}

export class GameClient extends CommandoClient {
    dispatchers: Map<string, StreamDispatcher> = new Map();
    queue: Map<string, Entry[]> = new Map();
    dir = '/trashmash';

    private games: Map<string, Game> = new Map();
    // private votes: Map<string, PollEntry[]> = new Map();

    log(server: Guild, message: string, error = false) {
        console.log(chalk.yellow(`[${server.name}]`) + ` ${message}`);
    }

    isGameCreated(server: Guild): boolean {
        return this.games.has(server.id);
    }

    findGameByServer(server: Guild): Game | undefined {
        return this.games.get(server.id);
    }

    createGame(server: Guild, count: number): boolean {
        if (!this.isGameCreated(server)) {
            this.games.set(server.id, new Game(count));
            return true;
        }

        return false;
    }

    // TODO: Finish voting

    /*
    sendPollCard(entry: Entry, pollEntries: PollEntry[]): EventEmitter {
        const voted = new EventEmitter();

        const voteableEntries = pollEntries.filter((pEntry) => pEntry.entry.user !== entry.user);
        const pollCard = new RichEmbed().setColor('#0303ff').setTitle("Trashmash").setDescription("**Vote Time!**\n\nChoose **one** entry for each category by reacting to the message with the associated emoji. You **cannot** change your vote, so choose carefully!")

        for (let vEntry of voteableEntries) {
            let mashName = ""
            for (let [i, track] of vEntry.entry.getMash().entries()) {
                mashName += `${track.artist} - ${track.song}`

                if (i + 1 !== vEntry.entry.getMash().length) { mashName += "\nvs.\n" }
            }

            pollCard.addField(`${vEntry.emoji} ${vEntry.entry.user.displayName}`, mashName);
        }

        entry.user.sendEmbed(pollCard).then(async (message) => {
            for (let vEntry of voteableEntries) {
                await message.react(vEntry.emoji);
            }

            while (message.reactions.filter((reaction) => reaction.users.))
        })

        return voted;
    }

    createPoll(server: Guild, msg: CommandMessage) {
        const game = this.games.get(server.id);

        if (game) {
            const entries = game.getAllEntries();
            const submitted = entries.filter((entry) => entry.isSubmitted());

            const pollEntries: PollEntry[] = [];
            const usedEmojis: string[] = [];
            for (let entry of submitted) {
                let emoji: string;

                do {
                    emoji = randomEmoji.random();
                } while (!usedEmojis.includes(emoji))

                usedEmojis.push(emoji);
                pollEntries.push(
                    {
                        emoji,
                        entry,
                        votes: {best: 0, effort: 0, funny: 0}
                    }
                )
            }

            for (let entry in entries) {

            }
        }
    }
    */
   
    playFromQueue(server: Guild, connection: VoiceConnection, msg: CommandMessage) {
        const queue = this.queue.get(server.id);

        if (queue) {
            const entry = queue[0];
            const file = `${this.dir}/${server.id}/${entry.user.id}.mp3`

            msg.channel.send("**Now Playing: **", entry.displayMash());
            const dispatcher = connection.playFile(file, { bitrate: 192000 });
            this.dispatchers.set(server.id, dispatcher);
            dispatcher.on('end', (reason) => {
                if (queue.length <= 1) {
                    this.dispatchers.delete(server.id);
                    this.queue.delete(server.id);
                    msg.member.voiceChannel.leave();
    
                    if (reason !== 'cancelled') { 
                        rimraf.sync(this.dir + `/${msg.guild.id}`);
                        this.log(msg.guild, 'Game finished, folder deleted')

                        if (dispatcher) {
                            this.queue.delete(msg.guild.id);
                            dispatcher.end('cancelled');
                        }

                        msg.channel.sendEmbed(new RichEmbed().setColor('#0303ff').setTitle("Trashmash").setDescription("All mashes played, thanks for playing!")); 
                    }
                } else {
                    queue.shift();
                    this.queue.set(server.id, queue);
                    this.playFromQueue(server, connection, msg);
                }
            });
        }
    }

    deleteGame(server: Guild): boolean {
        if (this.isGameCreated(server)) {
            this.games.delete(server.id);
            return true;
        }

        return false;
    }
}