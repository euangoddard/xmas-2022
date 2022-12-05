import {
  Accessor,
  Component,
  createEffect,
  createMemo,
  createSignal,
  For,
} from "solid-js";
import styles from "./styles.module.css";

interface IndexedWord {
  index: number;
  word: string;
}

interface SongTextProps {
  text: Accessor<string>;
}

export const SongText: Component<SongTextProps> = ({ text }) => {
  const [visibleIndex, setVisibleIndex] = createSignal(0);
  const lines = createMemo(() => {
    const textValue = text();
    if (!textValue) {
      return [];
    }
    const wordLines = textValue.split("\n").map((line) => line.split(" "));

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

  const wordCount = () => (lines()?.at(-1)?.at(-1)?.index ?? -1) + 1;

  const revealWord = () => {
    if (visibleIndex() < wordCount()) {
      setTimeout(revealWord, 100);
      setVisibleIndex((prev) => prev + 1);
    }
  };

  createEffect((prev) => {
    if (prev !== text()) {
      setVisibleIndex(0);
      revealWord();
    }
    return text();
  });

  return (
    <div>
      <For each={lines()}>
        {(words) => (
          <p class={styles.line}>
            <For each={words}>
              {({ word, index }) => (
                <span
                  classList={{
                    [styles.word!]: true,
                    [styles.visible!]: index < visibleIndex(),
                  }}
                >
                  {word}
                </span>
              )}
            </For>
          </p>
        )}
      </For>
    </div>
  );
};
