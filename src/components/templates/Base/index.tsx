import React from 'react';
import styles from './styles.module.css';
import TopBar from '~c/organisms/TopBar';
import Wrapper from '~c/atoms/Wrapper';

interface Props {
  children: JSX.Element | JSX.Element[];
}

const Base = ({ children }: Props): React.ReactElement => (
  <div className={styles.container}>
    <TopBar />
    <div className={styles.grid}>
      <Wrapper>
        <div className={styles.content}>{children}</div>
      </Wrapper>
    </div>
    <footer className={styles.footer}>© 2021 Dmitriy Zhiganov</footer>
  </div>
);

export default Base;
