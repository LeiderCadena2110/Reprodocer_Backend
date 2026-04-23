// ============================================================
// PlaylistService.ts – Business logic for playlist management
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import { DoublyLinkedList } from './DoublyLinkedList';
import { Song, AddSongBody, PlaylistState } from './types';

const DEMO: Omit<Song, 'id' | 'addedAt'>[] = [
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    duration: 200,
    genre: 'Pop',
    coverUrl: 'https://i.ytimg.com/vi/4NRXx6U8ABQ/mqdefault.jpg',
    source: 'youtube',
    videoId: '4NRXx6U8ABQ',
  },
  {
    title: 'Levitating',
    artist: 'Dua Lipa',
    album: 'Future Nostalgia',
    duration: 203,
    genre: 'Pop',
    coverUrl: 'https://i.ytimg.com/vi/TUVcZfQe-Kw/mqdefault.jpg',
    source: 'youtube',
    videoId: 'TUVcZfQe-Kw',
  },
  {
    title: 'As It Was',
    artist: 'Harry Styles',
    album: "Harry's House",
    duration: 167,
    genre: 'Pop',
    coverUrl: 'https://i.ytimg.com/vi/H5v3kku4y6Q/mqdefault.jpg',
    source: 'youtube',
    videoId: 'H5v3kku4y6Q',
  },
];

class PlaylistService {
  private list = new DoublyLinkedList();
  private isPlaying = false;

  constructor() {
    DEMO.forEach(song =>
      this.list.insertAtEnd({ ...song, id: uuidv4(), addedAt: new Date().toISOString() })
    );
  }

  getState(): PlaylistState {
    return {
      songs: this.list.toArray(),
      currentIndex: this.list.getCurrentIndex(),
      totalSongs: this.list.getSize(),
      isPlaying: this.isPlaying,
    };
  }

  getCurrentSong(): Song | null { return this.list.getCurrentSong(); }

  addSong(body: AddSongBody): Song {
    const song: Song = {
      id: uuidv4(),
      title: body.title,
      artist: body.artist,
      album: body.album ?? 'Unknown Album',
      duration: body.duration ?? 0,
      genre: body.genre ?? 'Unknown',
      coverUrl: body.coverUrl ?? `https://picsum.photos/seed/${uuidv4()}/300/300`,
      addedAt: new Date().toISOString(),
      source: body.source ?? 'local',
      videoId: body.videoId,
    };

    const pos = body.position ?? 'end';
    if (pos === 'start') this.list.insertAtStart(song);
    else if (pos === 'end') this.list.insertAtEnd(song);
    else if (typeof pos === 'number') this.list.insertAtPosition(song, pos);
    else this.list.insertAtEnd(song);

    return song;
  }

  deleteSong(id: string): boolean { return this.list.deleteById(id); }

  nextSong(): Song | null { return this.list.next(); }
  previousSong(): Song | null { return this.list.previous(); }
  jumpTo(id: string): Song | null { return this.list.jumpToId(id); }

  play(): void { this.isPlaying = true; }
  pause(): void { this.isPlaying = false; }
  setPlaying(v: boolean): void { this.isPlaying = v; }

  shuffle(): void { this.list.shuffle(); }
  clearPlaylist(): void { this.list.clear(); this.isPlaying = false; }
}

export const playlistService = new PlaylistService();
