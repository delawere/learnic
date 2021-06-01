/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import React, { memo, useCallback, useState, useEffect } from 'react';
import firebase from 'firebase';
import Fuse from 'fuse.js';
import EditIcon from '@material-ui/icons/EditOutlined';
import DeleteIcon from '@material-ui/icons/DeleteOutlined';
import { useTranslation } from 'react-i18next';
import useMedia from 'react-use/lib/useMedia';
import styles from './styles.module.css';
import Search from './Search';
import NoWord from './NoWord';
import If from '~c/atoms/If';

type Props = {
  words: firebase.firestore.DocumentData &
    {
      id: string;
      word: string;
      translate: string;
    }[];
  onShowNewWord: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onSave: (data: { id?: string; word: string; translate: string }) => void;
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
}: Props) => {
  const { t } = useTranslation();
  const [focused, setFocused] = useState<string>('');
  const [filter, setFilter] = useState<string>('');
  const [filtered, setFiltered] = useState<
    { id: string; word: string; translate: string }[]
  >([]);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const isWide = useMedia('(min-width: 576px)');

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

  const handleKeyDown = useCallback(
    (event, { id, word, translate }) => {
      if (event.key === 'Enter') {
        onClickCard({ id, word, translate });
      }
    },
    [onClickCard]
  );

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

  const handleMouseDown = useCallback((id) => {
    setFocused(id);
  }, []);

  const handleOnFocus = useCallback(() => {
    if (!searchFocused) setSearchFocused(true);
  }, [searchFocused]);

  const handleOnBlur = useCallback(() => {
    if (searchFocused) setSearchFocused(false);
  }, [searchFocused]);

  return (
    <>
      <div className={styles.buttonsContainer}>
        <>
          <Search
            value={filter}
            onChange={handleChangeFilter}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
          <button
            type="button"
            disabled={showNewWord}
            className={`${styles.addNewWordButton} ${
              showNewWord ? styles.disable : ''
            }`}
            onClick={onShowNewWord}
          >
            {isWide ? t('DICTIONARY.NEW_WORD_BUTTON') : '+'}
          </button>
        </>
      </div>

      <div className={styles.cardsContainer}>
        <ul className={styles.cardsList} onMouseLeave={() => setFocused('')}>
          {(filter && filtered.length > 0) || !filter ? (
            (filter ? filtered : words).map(({ id, word, translate }) => {
              const onClick = () => onClickCard({ id, word, translate });

              return (
                <li
                  // TODO Use links or buttons
                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                  role="button"
                  className={styles.cardItem}
                  key={id}
                  onMouseEnter={() => handleMouseDown(id)}
                  tabIndex={0}
                  onKeyDown={(event) =>
                    handleKeyDown(event, { word, translate })
                  }
                >
                  <div className={styles.cardItemContainer}>
                    <div
                      role="button"
                      onClick={onClick}
                      className={`${styles.cardItemTextContainer} ${
                        id === focused
                          ? styles.cardItemTextContainerHovered
                          : ''
                      }`}
                    >
                      <span
                        className={styles.cardButton}
                      >{`${word} - ${translate}`}</span>
                    </div>
                    <If condition={id === focused}>
                      <div className={styles.icons}>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() => {
                            clearFilter();
                            onEdit(id);
                          }}
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          className={styles.actionButton}
                          onClick={() => {
                            clearFilter();
                            onDelete(id);
                          }}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    </If>
                  </div>
                </li>
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
