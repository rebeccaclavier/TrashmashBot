import { MCatalogService } from './mcatalog-service';
import { Track } from '../models';

export class TracksService {
    private song_blacklist = [
        "Stickup (feat. Juliette Lewis)",
        "Queen Of Your Heart (feat. Augustus Ghost)",
        "Shrooms",
        "Drowning (feat. Ehiorobo)",
        "A Walk To The Gallows",
        "Goodbye (Winter Chords)",
        "Intermission",
        "Veterstift",
        "Champion Sound",
        "Truth And Malice",
        "New Dawn",
        "Losing You",
        "Once Again",
        "Another Night (feat. Nevve)",
        "Constellations (feat. Jessi Mason)",
        "Scorpion Pit VIP"
    ];

    private genre_blacklist = [
        "Miscellaneous",
        "Ambient",
        "Traditional",
        "?"
    ];

    private validTrack(raw_track: string[]): boolean {
        if (this.genre_blacklist.includes(raw_track[4])) {
            return false;
        } else if (this.song_blacklist.includes(raw_track[6])) {
            return false;
        }

        return true;
    }

    private async getMCatalogTracks(count: number): Promise<Track[]> {
        const res = await MCatalogService.getCatalog();
        const values = res.values;
        let tracks: Track[] = [];
        let indexes: number[] = [];

        for (let _ = 0; _ < count; _++) {
            let i: number;
            
            do {
                i = Math.floor(Math.random() * values.length);
            } while (!this.validTrack(values[i]) && indexes.includes(i));

            indexes.push(i);
            tracks.push({
                id: values[i][0],
                song: values[i][8],
                artist: values[i][7],
                key: values[i][12],
                bpm: values[i][11],
                genre: values[i][6]
            })
        }

        return tracks;
    }

    async getTracks(count: number): Promise<Track[]> {
        return await this.getMCatalogTracks(count);
    }
}