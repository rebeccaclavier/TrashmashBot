import { GuildMember } from "discord.js";
import { Track, MashCard } from './';
import { TracksService } from '../services';

export class Entry {
    user: GuildMember;
    private mash: Track[];
    private submitted: boolean;
    private count: number;
    private voted: boolean;

    private trackService = new TracksService();

    constructor(user: GuildMember, count: number) {
        this.user = user;
        this.mash = [];
        this.submitted = false;
        this.count = count;
        this.voted = false;
    }

    vote() {
        this.voted = true;
    }

    hasVoted() {
        return this.voted;
    }

    displayMash() {
        return new MashCard(this.mash, this.user);
    }

    getMash() {
        return this.mash;
    }

    async roll(): Promise<MashCard> {
        this.mash = await this.trackService.getTracks(this.count);
        return this.displayMash();
    }

    submit() {
        this.submitted = true;
    }

    isSubmitted() {
        return this.submitted;
    }
}

export class Game {
    private started: boolean;
    private entries: Entry[];
    private trackCount: number;

    constructor(count: number) {
        this.started = false;
        this.entries = [];
        this.trackCount = count;
    }

    start(): boolean {
        if (this.entries.length !== 0 && !this.started) {
            this.started = true;
            return true;
        }

        return false;
    }

    isStarted(): boolean {
        return this.started;
    }

    isUserEntered(user: GuildMember): boolean {
        return this.entries.filter(
                (entry: Entry) => entry.user.id === user.id
            ).length === 1;
    }

    addUser(user: GuildMember): boolean {
        if (!this.isUserEntered(user)) {
            this.entries.push(new Entry(user, this.trackCount));
            return true;
        }

        return false;
    }

    removeUser(user: GuildMember): boolean {
        if (this.isUserEntered(user)) {
            let filtered = this.entries.filter(
                (entry: Entry) => entry.user.id !== user.id
            );
            this.entries = filtered;
            return true;
        }

        return false;
    }

    getEntryByUser(user: GuildMember): Entry | null {
        return this.entries.filter((entry: Entry) => entry.user.id === user.id)[0];
    }

    getAllSubmissions(): Entry[] {
        return this.entries.filter((entry: Entry) => entry.isSubmitted());
    }

    getAllEntries(): Entry[] {
        return this.entries;
    }
}