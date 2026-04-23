// ============================================================
// types.ts – Shared data types for MusicFlow
// ============================================================

export type SongSource = 'local' | 'youtube';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;        // seconds
  genre: string;
  coverUrl: string;        // thumbnail or cover image URL
  addedAt: string;         // ISO date string
  source: SongSource;
  videoId?: string;        // only for youtube songs
}

export interface PlaylistState {
  songs: Song[];
  currentIndex: number | null;
  totalSongs: number;
  isPlaying: boolean;
}

export interface AddSongBody {
  title: string;
  artist: string;
  album?: string;
  duration?: number;
  genre?: string;
  coverUrl?: string;
  position?: 'start' | 'end' | number;
  source?: SongSource;
  videoId?: string;
}

export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration: number;       // seconds
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
