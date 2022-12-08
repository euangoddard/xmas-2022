import type { FunctionalComponent } from "preact";
import { useEffect } from "preact/hooks";
import type { Songs } from "../../models/song";
import { CustomPhrase } from "../custom-phrase/CustomPhrase";
import { Show } from "../show/Show";
import { isLoading, showCustom, song, songs } from "../signals";
import { SongSelect } from "../song-select/SongSelect";
import { SongText } from "../song-text/SongText";
import styles from "./styles.module.css";

async function fetchData(): Promise<Songs> {
  const response = await fetch("/api/songs");
  const { songs } = await response.json();
  return songs;
}

export const SongGenerator: FunctionalComponent = () => {
  useEffect(() => {
    fetchData().then((value) => {
      songs.value = value;
    });
  }, []);

  return (
    <>
      <h2 class={styles.question}>
        Write a Christmas song about&nbsp;
        <Show when={showCustom.value} fallback={<SongSelect />}>
          <CustomPhrase />
        </Show>
      </h2>
      <Show when={!!song.value}>
        <SongText />
      </Show>
      <Show when={isLoading.value}>
        <aside>
          <h3 class={styles.loading}>The AI is writing your song!</h3>
          <img
            src="/santa.webp"
            alt="AI writing songs"
            class={styles.santaImg}
          />
        </aside>
      </Show>
    </>
  );
};
