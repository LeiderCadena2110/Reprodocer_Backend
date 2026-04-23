// ============================================================
// routes.ts – All API routes for MusicFlow
// ============================================================

import { Router, Request, Response } from 'express';
import { playlistService } from './PlaylistService';
import { youtubeService } from './YouTubeService';
import { AddSongBody, ApiResponse } from './types';

const router = Router();

// ── Health ────────────────────────────────────────────────
router.get('/health', (_req, res: Response) => {
  res.json({
    status: 'ok',
    youtube: youtubeService.isConfigured() ? 'configured' : 'not configured',
    timestamp: new Date().toISOString(),
  });
});

// ── Playlist ──────────────────────────────────────────────

router.get('/playlist', (_req, res: Response) => {
  res.json({ success: true, data: playlistService.getState() });
});

router.get('/playlist/current', (_req, res: Response) => {
  const state = playlistService.getState();
  res.json({
    success: true,
    data: {
      song: playlistService.getCurrentSong(),
      currentIndex: state.currentIndex,
      hasNext: state.currentIndex !== null && state.currentIndex < state.totalSongs - 1,
      hasPrevious: state.currentIndex !== null && state.currentIndex > 0,
      isPlaying: state.isPlaying,
    },
  });
});

router.post('/playlist/songs', (req: Request, res: Response) => {
  const body = req.body as Partial<AddSongBody>;
  if (!body.title?.trim() || !body.artist?.trim()) {
    return res.status(400).json({ success: false, error: 'title and artist are required' });
  }
  const song = playlistService.addSong(body as AddSongBody);
  return res.status(201).json({
    success: true,
    data: { song, playlist: playlistService.getState() },
    message: `"${song.title}" added`,
  });
});

router.delete('/playlist/songs/:id', (req: Request, res: Response) => {
  const deleted = playlistService.deleteSong(req.params.id);
  if (!deleted) return res.status(404).json({ success: false, error: 'Song not found' });
  return res.json({ success: true, data: playlistService.getState() });
});

router.post('/playlist/next', (_req, res: Response) => {
  const song = playlistService.nextSong();
  if (!song) return res.status(400).json({ success: false, error: 'No next song' });
  return res.json({ success: true, data: { song, playlist: playlistService.getState() } });
});

router.post('/playlist/previous', (_req, res: Response) => {
  const song = playlistService.previousSong();
  if (!song) return res.status(400).json({ success: false, error: 'No previous song' });
  return res.json({ success: true, data: { song, playlist: playlistService.getState() } });
});

router.post('/playlist/jump/:id', (req: Request, res: Response) => {
  const song = playlistService.jumpTo(req.params.id);
  if (!song) return res.status(404).json({ success: false, error: 'Song not found' });
  playlistService.play();
  return res.json({ success: true, data: { song, playlist: playlistService.getState() } });
});

router.post('/playlist/play', (_req, res: Response) => {
  playlistService.play();
  res.json({ success: true, message: 'Playing' });
});

router.post('/playlist/pause', (_req, res: Response) => {
  playlistService.pause();
  res.json({ success: true, message: 'Paused' });
});

router.post('/playlist/shuffle', (_req, res: Response) => {
  playlistService.shuffle();
  res.json({ success: true, data: playlistService.getState() });
});

router.delete('/playlist', (_req, res: Response) => {
  playlistService.clearPlaylist();
  res.json({ success: true, message: 'Playlist cleared' });
});

// ── YouTube Search ────────────────────────────────────────

router.get('/youtube/search', async (req: Request, res: Response) => {
  const q = (req.query.q as string | undefined)?.trim();
  const maxResults = Math.min(parseInt((req.query.maxResults as string) ?? '10'), 20);

  if (!q) {
    return res.status(400).json({ success: false, error: 'Query parameter "q" is required' });
  }

  if (!youtubeService.isConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'YouTube API key is not configured. Set YOUTUBE_API_KEY in Railway environment variables.',
    });
  }

  try {
    const results = await youtubeService.search(q, maxResults);
    return res.json({ success: true, data: results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'YouTube search failed';
    console.error('[YouTube Search]', message);
    return res.status(502).json({ success: false, error: message });
  }
});

// ── YouTube status check ──────────────────────────────────
router.get('/youtube/status', (_req, res: Response) => {
  res.json({
    success: true,
    data: { configured: youtubeService.isConfigured() },
  });
});

export default router;
