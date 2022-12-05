import {
  Component,
  createMemo,
  createResource,
  createSignal,
  Show,
} from "solid-js";
import type { Song, Songs } from "../../models/song";
import { CustomPhrase } from "../custom-phrase/CustomPhrase";
import { SongSelect } from "../song-select/SongSelect";
import { SongText } from "../song-text/SongText";
import styles from "./styles.module.css";

async function fetchData(): Promise<Songs> {
  const response = await fetch("/api/songs");
  const { songs } = await response.json();
  return songs;
}

export const SongGenerator: Component<{}> = () => {
  const [data] = createResource(fetchData);

  const [song, setSong] = createSignal<Song | null>(null);
  const [showCustom, setShowCustom] = createSignal<boolean>(false);
  const [isLoading, setIsLoading] = createSignal<boolean>(false);

  const text = createMemo(() => song()?.song ?? "");
  const allSongs = createMemo(() => data.latest ?? []);

  return (
    <>
      <h2 class={styles.question}>
        Write a Christmas song about&nbsp;
        <Show
          when={showCustom()}
          fallback={
            <SongSelect
              setSong={setSong}
              songs={allSongs}
              setShowCustom={setShowCustom}
            />
          }
        >
          <CustomPhrase
            setShowCustom={setShowCustom}
            setSong={setSong}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </Show>
      </h2>
      <Show when={!!song()}>
        <SongText text={text} />
      </Show>
      <Show when={isLoading()}>
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
