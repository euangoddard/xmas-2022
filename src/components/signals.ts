import { signal } from "@preact/signals";
import type { Song, Songs } from "../models/song";

export const song = signal<Song | null>(null);
export const songs = signal<Songs>([]);
export const isLoading = signal<boolean>(false);
export const showCustom = signal<boolean>(false);
export const error = signal<string>("");
