import { Accessor, Component, For, Setter } from "solid-js";
import type { Song, Songs } from "../../models/song";

interface SongSelectProps {
  songs: Accessor<Songs>;
  setSong: Setter<Song | null>;
  setShowCustom: Setter<boolean>;
}

const customSongId = -1;

export const SongSelect: Component<SongSelectProps> = ({
  songs,
  setSong,
  setShowCustom,
}) => {
  const setSongFromEvent = (e: Event) => {
    const id = parseInt((e.target as HTMLSelectElement).value, 10);
    if (!id) {
      setSong(null);
    } else if (id === customSongId) {
      setSong(null);
      setShowCustom(true);
    } else {
      const newSong = songs().find((song) => song.id === id);
      if (newSong) {
        setSong(() => newSong);
      }
    }
  };
  return (
    <select onChange={setSongFromEvent} style={{ "font-size": "inherit" }}>
      <option value={0}>Choose a phrase</option>
      <optgroup label="Existing">
        <For each={songs()}>
          {(song) => <option value={song.id}>{song.prompt}</option>}
        </For>
      </optgroup>
      <option value={customSongId}>Custom&hellip;</option>
    </select>
  );
};
