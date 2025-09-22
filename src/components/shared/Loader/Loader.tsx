import React from 'react';

import { ReadonlyFC } from '@/types';

import styles from './Loader.module.css';

const Loader: ReadonlyFC = () => {
  return <div data-testid="loader" className={styles.loader}></div>;
};

export default Loader;
