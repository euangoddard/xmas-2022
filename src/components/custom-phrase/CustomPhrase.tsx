import {
  Accessor,
  Component,
  createEffect,
  createResource,
  createSignal,
  Setter,
} from "solid-js";
import type { Song } from "../../models/song";
import styles from "./styles.module.css";

interface CustomPhraseProps {
  setShowCustom: Setter<boolean>;
  setSong: Setter<Song>;
  setIsLoading: Setter<boolean>;
  isLoading: Accessor<boolean>;
}

async function fetchSong(phrase: string): Promise<string> {
  if (!phrase) {
    return Promise.resolve("");
  }
  const response = await fetch("/api/new-song", {
    method: "POST",
    body: JSON.stringify({ phrase }),
  });
  const { song } = await response.json();
  return Promise.resolve(song);
}

let newSongId = 1000;

export const CustomPhrase: Component<CustomPhraseProps> = ({
  setShowCustom,
  setSong,
  setIsLoading,
  isLoading,
}) => {
  const [phrase, setPhrase] = createSignal("");

  const [data] = createResource(phrase, fetchSong);

  createEffect(() => {
    const latestSong = data();
    if (latestSong) {
      setSong({
        song: latestSong,
        prompt: phrase(),
        id: ++newSongId,
      });
    }
  });

  createEffect(() => {
    data();
    if (data.loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  });

  let inputRef: HTMLInputElement;

  const getSongForCustomPhrase = () => {
    setPhrase(inputRef!.value.trim());
  };

  return (
    <div class={styles.phraseContainer}>
      <input
        class={styles.input}
        type="text"
        placeholder="your phrase"
        ref={inputRef!}
        disabled={isLoading()}
      />
      <button
        type="button"
        onClick={() => getSongForCustomPhrase()}
        disabled={isLoading()}
      >
        Go
      </button>
      <button type="button" onClick={() => setShowCustom(false)}>
        &times;
      </button>
    </div>
  );
};
