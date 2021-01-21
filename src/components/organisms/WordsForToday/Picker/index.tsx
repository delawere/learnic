import React, { memo } from 'react';
import styles from './styles.module.css';
import Variant from './Variant';
import type { Variants } from '..';

type Props = {
  currentWord: string;
  variants: Variants;
  pick: (translate: string) => void;
  wordsCount: [number, number];
};

const Picker: React.FunctionComponent<Props> = ({
  currentWord,
  variants,
  pick,
  wordsCount,
}: Props) => {
  console.log('VARIANTS', variants);
  const [completed, all] = wordsCount;
  const left = all - completed;

  return (
    <div className={styles.container}>
      <div className={styles.left}>{`${left}/${all}`}</div>
      <div className={styles.word}>{currentWord}</div>
      <ul className={styles.list}>
        {variants.map((variant, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Variant key={i} variant={variant} pick={pick} />
        ))}
      </ul>
    </div>
  );
};

export default Picker;
