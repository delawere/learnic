/* eslint-disable jsx-a11y/media-has-caption */
import React, { memo, useEffect, useCallback, useMemo } from 'react';
import { getDefinition } from 'core/store/api/dictionary';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import useAsyncFn from 'react-use/lib/useAsyncFn';
import styles from './styles.module.css';
import VideosList from '../VideosList';
import { getExamples } from './utils';
import Skeleton from '../../atoms/Skeleton';
import ShowMore from './ShowMore';

type Props = {
  word: string;
  translate: string;
};

const defaultDefinition = {
  examples: [],
  audio: '',
};

const WordsCard: React.FunctionComponent<Props> = ({
  word,
  translate,
}: Props) => {
  const [{ value = defaultDefinition, loading }, fetch] = useAsyncFn(
    async (keyword: string): Promise<{ examples: string[]; audio: string }> => {
      const data = await getDefinition(keyword);

      if (data && Array.isArray(data)) {
        const { examples: resExamples, audio: resAudio } = getExamples(data);

        return {
          examples: resExamples,
          audio: resAudio as string,
        };
      }

      return defaultDefinition;
    },
    [],
    { loading: true }
  );

  useEffect(() => {
    if (word) {
      fetch(word);
    }
  }, [word, fetch]);

  const audio = useMemo((): HTMLAudioElement | null => {
    if (value?.audio) {
      return new Audio(value.audio);
    }
    return null;
  }, [value]);

  const handlePlayAudio = useCallback(() => {
    if (audio && typeof audio.play === 'function') audio.play();
  }, [audio]);

  if (!word) {
    return (
      <div className={styles.container}>
        <div className={styles.noSelectedWord}>
          <span role="img" aria-label="question">
            🤔 Select some word...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wordSection}>
        <div>
          <span>{`${word} - ${translate}`}</span>
        </div>

        <div className={styles.audioButtonContainer}>
          <button
            className={styles.audioButton}
            type="button"
            onClick={handlePlayAudio}
          >
            <VolumeUpIcon />
          </button>
        </div>

        <div className={styles.steps}>
          {Array(7)
            .fill(null)
            .map(() => (
              <span role="img" aria-label="steps">
                🏅
              </span>
            ))}
        </div>
      </div>
      <div className={styles.contextSection}>
        {loading ? (
          <ul className={styles.examplesList}>
            <Skeleton variant="text" width={512} height={40} repeat={3} />
          </ul>
        ) : (
          <>
            <ul className={styles.examplesList}>
              {Array.isArray(value.examples) && value.examples.length
                ? value.examples
                    .filter((def) => def)
                    .splice(0, 3)
                    .map((def) => (
                      <li key={def} className={styles.examplesItem}>
                        <span className={styles.example} key={def}>
                          {def}
                        </span>
                      </li>
                    ))
                : null}
            </ul>
            <ShowMore onShowMore={() => {}} />
          </>
        )}
      </div>
      <div className={styles.videoSection}>
        {word ? <VideosList keyword={word} /> : null}
      </div>
    </div>
  );
};

export default memo(WordsCard);
