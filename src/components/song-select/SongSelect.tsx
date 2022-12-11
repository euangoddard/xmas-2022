import type { FunctionalComponent } from "preact";
import { error, showCustom, song, songs } from "../signals";

const customSongId = -1;

export const SongSelect: FunctionalComponent = () => {
  const setSongFromEvent = (e: Event) => {
    error.value = "";
    const id = parseInt((e.target as HTMLSelectElement).value, 10);
    if (!id) {
      song.value = null;
    } else if (id === customSongId) {
      song.value = null;
      showCustom.value = true;
    } else {
      const newSong = songs.value.find((song) => song.id === id);
      if (newSong) {
        song.value = newSong;
      }
    }
  };
  return (
    <select onChange={setSongFromEvent} style={{ "font-size": "inherit" }}>
      <option value={0}>Choose a phrase</option>
      <option value={customSongId}>Custom&hellip;</option>
      <optgroup label="Existing">
        {songs.value.map((s) => (
          <option value={s.id}>{s.prompt}</option>
        ))}
      </optgroup>
    </select>
  );
};
