import { computed, effect, useSignal } from "@preact/signals";
import classNames from "classnames";
import type { FunctionalComponent } from "preact";
import { useEffect } from "preact/hooks";
import { song } from "../signals";
import styles from "./styles.module.css";

interface IndexedWord {
  index: number;
  word: string;
}

const lines = computed(() => {
  const text = song.value?.song;
  if (!text) {
    return [];
  }
  const wordLines = text.split("\n").map((line) => line.split(" "));

  let wordCount = 0;
  return wordLines.map((line) => {
    return line.map((word) => {
      const wordObject: IndexedWord = {
        word,
        index: wordCount,
      };
      wordCount++;
      return wordObject;
    });
  });
});

const wordCount = computed(() => {
  return (lines.value.at(-1)?.at(-1)?.index ?? -1) + 1;
});

export const SongText: FunctionalComponent = () => {
  const visibleIndex = useSignal(0);

  const revealWord = () => {
    if (visibleIndex.peek() < wordCount.peek()) {
      setTimeout(revealWord, 100);
      visibleIndex.value += 1;
    }
  };

  useEffect(() => {
    if (song.peek()?.song) {
      visibleIndex.value = 0;
      setTimeout(() => revealWord());
    }
  }, [song.peek()?.song]);

  return (
    <div>
      {lines.value.map((words) => (
        <p class={styles.line}>
          {words.map(({ word, index }) => (
            <span
              class={classNames({
                [styles.word!]: true,
                [styles.visible!]: index < visibleIndex.value,
              })}
            >
              {word}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
};
