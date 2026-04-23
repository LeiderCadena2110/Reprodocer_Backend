// ============================================================
// YouTubeService.ts – YouTube Data API v3 proxy
// Hides the API key from the frontend
// ============================================================

import axios from 'axios';
import { YouTubeSearchResult } from './types';

const YT_BASE = 'https://www.googleapis.com/youtube/v3';

/** Parse ISO 8601 duration string (PT3M45S) → seconds */
function parseISO8601Duration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return (parseInt(match[1] ?? '0') * 3600) +
         (parseInt(match[2] ?? '0') * 60) +
         (parseInt(match[3] ?? '0'));
}

/** Decode HTML entities in YouTube titles (e.g. &amp; → &) */
function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export class YouTubeService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.YOUTUBE_API_KEY ?? '';
  }

  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  async search(query: string, maxResults = 10): Promise<YouTubeSearchResult[]> {
    if (!this.isConfigured()) {
      throw new Error('YOUTUBE_API_KEY is not configured on the server.');
    }

    // ── Step 1: search.list ───────────────────────────────
    const searchRes = await axios.get<{
      items: Array<{
        id: { videoId: string };
        snippet: {
          title: string;
          channelTitle: string;
          thumbnails: {
            medium?: { url: string };
            default?: { url: string };
          };
        };
      }>;
    }>(`${YT_BASE}/search`, {
      params: {
        key: this.apiKey,
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults,
      },
    });

    const items = searchRes.data.items ?? [];
    if (items.length === 0) return [];

    const videoIds = items.map(i => i.id.videoId).join(',');

    // ── Step 2: videos.list for duration ──────────────────
    const detailsRes = await axios.get<{
      items: Array<{
        id: string;
        contentDetails: { duration: string };
      }>;
    }>(`${YT_BASE}/videos`, {
      params: {
        key: this.apiKey,
        id: videoIds,
        part: 'contentDetails',
      },
    });

    const durationMap = new Map(
      (detailsRes.data.items ?? []).map(d => [d.id, d.contentDetails.duration])
    );

    return items.map(item => ({
      videoId: item.id.videoId,
      title: decodeEntities(item.snippet.title),
      channelTitle: decodeEntities(item.snippet.channelTitle),
      thumbnail:
        item.snippet.thumbnails.medium?.url ??
        item.snippet.thumbnails.default?.url ??
        '',
      duration: parseISO8601Duration(durationMap.get(item.id.videoId) ?? 'PT0S'),
    }));
  }
}

export const youtubeService = new YouTubeService();
