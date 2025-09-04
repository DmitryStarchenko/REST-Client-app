import React from 'react';

import { ReadonlyFC } from '@/types/readonly.types';

import styles from './ErrorPage.module.css';

interface CustomErrorPageProps {
  title: string;
  message: string;
  children?: React.ReactNode;
}
const CustomErrorPage: ReadonlyFC<CustomErrorPageProps> = ({ title, message, children }) => {
  return (
    <div className={styles.errorPage}>
      <h1>{title}</h1>
      <p>{message}</p>
      {children}
    </div>
  );
};

export default CustomErrorPage;
