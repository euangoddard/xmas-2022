import { useSignal } from "@preact/signals";
import type { FunctionalComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { error, isLoading, showCustom, song } from "../signals";
import styles from "./styles.module.css";

async function fetchSong(phrase: string): Promise<string> {
  if (!phrase) {
    return Promise.resolve("");
  }
  const response = await fetch("/api/new-song", {
    method: "POST",
    body: JSON.stringify({ phrase }),
  });

  if (response.ok) {
    const { song } = await response.json();
    return song;
  } else {
    throw new Error(await response.text());
  }
}

let newSongId = 1000;

export const CustomPhrase: FunctionalComponent = () => {
  const phrase = useSignal("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    error.value = "";
    if (phrase.value) {
      song.value = null;
      isLoading.value = true;
    }
    fetchSong(phrase.value)
      .then(
        (latestSong) => {
          song.value = {
            song: latestSong,
            prompt: phrase.value,
            id: ++newSongId,
          };
        },
        (err: any) => {
          error.value = err.message;
        }
      )
      .finally(() => (isLoading.value = false));
  }, [phrase.value]);

  const getSongForCustomPhrase = () => {
    phrase.value = inputRef.current?.value.trim() ?? "";
  };

  return (
    <div class={styles.phraseContainer}>
      <input
        class={styles.input}
        type="text"
        placeholder="your phrase"
        ref={inputRef}
        disabled={isLoading.value}
        onKeyDown={(e) => {
          if (e.key == "Enter") {
            e.preventDefault();
            getSongForCustomPhrase();
          }
        }}
      />
      <button
        type="button"
        onClick={() => getSongForCustomPhrase()}
        disabled={isLoading.value}
      >
        Go
      </button>
      <button type="button" onClick={() => (showCustom.value = false)}>
        &times;
      </button>
    </div>
  );
};
