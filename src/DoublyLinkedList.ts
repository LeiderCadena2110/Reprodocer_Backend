// ============================================================
// DoublyLinkedList.ts – Core playlist data structure
// ============================================================

import { Song } from './types';

class Node {
  data: Song;
  next: Node | null = null;
  prev: Node | null = null;
  constructor(data: Song) { this.data = data; }
}

export class DoublyLinkedList {
  private head: Node | null = null;
  private tail: Node | null = null;
  private current: Node | null = null;
  private size = 0;

  // ── Getters ──────────────────────────────────────────────
  getSize(): number { return this.size; }
  isEmpty(): boolean { return this.size === 0; }
  getCurrentSong(): Song | null { return this.current?.data ?? null; }
  hasNext(): boolean { return (this.current?.next ?? null) !== null; }
  hasPrevious(): boolean { return (this.current?.prev ?? null) !== null; }

  getCurrentIndex(): number | null {
    if (!this.current) return null;
    let node = this.head;
    let i = 0;
    while (node) {
      if (node === this.current) return i;
      node = node.next;
      i++;
    }
    return null;
  }

  // ── Insert ────────────────────────────────────────────────
  insertAtStart(song: Song): void {
    const node = new Node(song);
    if (this.isEmpty()) {
      this.head = this.tail = this.current = node;
    } else {
      node.next = this.head;
      this.head!.prev = node;
      this.head = node;
    }
    this.size++;
  }

  insertAtEnd(song: Song): void {
    const node = new Node(song);
    if (this.isEmpty()) {
      this.head = this.tail = this.current = node;
    } else {
      node.prev = this.tail;
      this.tail!.next = node;
      this.tail = node;
    }
    this.size++;
  }

  insertAtPosition(song: Song, position: number): void {
    if (position <= 0) { this.insertAtStart(song); return; }
    if (position >= this.size) { this.insertAtEnd(song); return; }
    const node = new Node(song);
    let cur = this.head;
    for (let i = 0; i < position - 1; i++) cur = cur!.next;
    const next = cur!.next;
    node.prev = cur;
    node.next = next;
    cur!.next = node;
    if (next) next.prev = node;
    this.size++;
  }

  // ── Delete ────────────────────────────────────────────────
  deleteById(id: string): boolean {
    let node = this.head;
    while (node) {
      if (node.data.id === id) {
        if (this.current === node) {
          this.current = node.next ?? node.prev ?? null;
        }
        if (node.prev) node.prev.next = node.next;
        else this.head = node.next;
        if (node.next) node.next.prev = node.prev;
        else this.tail = node.prev;
        this.size--;
        return true;
      }
      node = node.next;
    }
    return false;
  }

  // ── Navigation ────────────────────────────────────────────
  next(): Song | null {
    if (!this.current?.next) return null;
    this.current = this.current.next;
    return this.current.data;
  }

  previous(): Song | null {
    if (!this.current?.prev) return null;
    this.current = this.current.prev;
    return this.current.data;
  }

  jumpToId(id: string): Song | null {
    let node = this.head;
    while (node) {
      if (node.data.id === id) { this.current = node; return node.data; }
      node = node.next;
    }
    return null;
  }

  // ── Utility ───────────────────────────────────────────────
  toArray(): Song[] {
    const result: Song[] = [];
    let node = this.head;
    while (node) { result.push(node.data); node = node.next; }
    return result;
  }

  clear(): void {
    this.head = this.tail = this.current = null;
    this.size = 0;
  }

  shuffle(): void {
    const songs = this.toArray();
    const curr = this.getCurrentSong();
    for (let i = songs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [songs[i], songs[j]] = [songs[j], songs[i]];
    }
    this.clear();
    songs.forEach(s => this.insertAtEnd(s));
    if (curr) this.jumpToId(curr.id);
  }
}
