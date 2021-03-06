import React, { memo, useCallback, useState, useEffect } from 'react';
import firebase from 'firebase';
import Fuse from 'fuse.js';
import { useTranslation } from 'react-i18next';
import Skeleton from '@material-ui/lab/Skeleton';
import styles from './styles.module.css';
import Search from './Search';
import NoWord from './NoWord';
import ListItem from './ListItem';

type Props = {
  words: firebase.firestore.DocumentData &
    {
      id: string;
      word: string;
      translate: string;
    }[];
  onShowNewWord: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSave: (data: {
    id?: string;
    word: string;
    translate: string;
    tags?: string[][];
  }) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onClickCard: ({
    id,
    word,
    translate,
  }: {
    id: string;
    word: string;
    translate: string;
  }) => void;
  showNewWord: boolean;
  setShowNewWord: (state: boolean) => void;
  edited: string;
  onCancelEdit: () => void;
  isLoading?: boolean;
};

const WordsList: React.FunctionComponent<Props> = ({
  words,
  onShowNewWord,
  showNewWord,
  setShowNewWord,
  onSave,
  onDelete,
  onEdit,
  onClickCard,
  edited,
  onCancelEdit,
  isLoading = true,
}: Props) => {
  const { t } = useTranslation();
  const [focused, setFocused] = useState<string>('');
  const [filter, setFilter] = useState<string>('');
  const [filtered, setFiltered] = useState<
    { id: string; word: string; translate: string }[]
  >([]);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);

  const onCancelAddNewWord = useCallback(() => {
    onCancelEdit();
    setShowNewWord(false);
  }, [setShowNewWord, onCancelEdit]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Escape' && (showNewWord || edited)) {
        onCancelAddNewWord();
      }
    },
    [onCancelAddNewWord, showNewWord, edited]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (filter) {
      const options = {
        threshold: 0.1,
        keys: ['word', 'translate'],
      };

      const fuse = new Fuse(words, options);
      const result = fuse.search(filter);
      const mapped = result.map(({ item }) => item);
      setFiltered(mapped);
    }
  }, [filter, words]);

  const handleChangeFilter = useCallback(({ target: { value = '' } = {} }) => {
    setFilter(value);
  }, []);

  const clearFilter = useCallback(() => setFilter(''), []);

  const handleOnFocus = useCallback(() => {
    if (!searchFocused) setSearchFocused(true);
  }, [searchFocused]);

  const handleOnBlur = useCallback(() => {
    if (searchFocused) setSearchFocused(false);
  }, [searchFocused]);

  if (isLoading) {
    return (
      <>
        <div style={{ marginBottom: '20px' }}>
          <Skeleton
            variant="rect"
            width={330}
            height={45}
            style={{ marginRight: '20px', display: 'inline-block' }}
          />
          <Skeleton
            variant="rect"
            width={150}
            height={45}
            style={{ display: 'inline-block' }}
          />
        </div>

        <Skeleton variant="rect" width={500} height={800} />
      </>
    );
  }

  return (
    <>
      <div className={styles.buttonsContainer}>
        <header className={styles.header}>
          <h2 className={styles.headerTitle}>{t('DICTIONARY.TITLE')}</h2>
          <button
            type="button"
            disabled={showNewWord}
            className={`${styles.addNewWordButton} ${
              showNewWord ? styles.disable : ''
            }`}
            onClick={onShowNewWord}
          >
            {t('DICTIONARY.NEW_WORD_BUTTON')}
          </button>
        </header>

        <>
          <Search
            value={filter}
            onChange={handleChangeFilter}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
        </>
      </div>

      <div className={styles.cardsContainer}>
        <ul className={styles.cardsList} onMouseLeave={() => setFocused('')}>
          {(filter && filtered.length > 0) || !filter ? (
            (filter ? filtered : words).map(({ id, word, translate }) => {
              const isFocused = focused === id;
              return (
                <ListItem
                  key={id}
                  id={id}
                  word={word}
                  translate={translate}
                  clearFilter={clearFilter}
                  onClick={onClickCard}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  setFocused={setFocused}
                  isFocused={isFocused}
                />
              );
            })
          ) : (
            <NoWord word={filter} onSave={onSave} clearFilter={clearFilter} />
          )}
        </ul>
      </div>
    </>
  );
};

export default memo(WordsList);
