import { useTranslations } from 'next-intl';
import React from 'react';

import { ReadonlyFC } from '@/types/readonly.types';

import styles from './about.module.css';

const About: ReadonlyFC = () => {
  const t = useTranslations('About');

  return (
    <div className={styles.about}>
      <h2>{t('about')}</h2>
      <div className={styles.container}>
        <div className={styles.project}>
          <div className={styles.logoProject}></div>
          <p>{t('project1')}</p>
          <p>{t('project2')}</p>
          <p>{t('project3')}</p>
        </div>
        <div className={styles.rs}>
          <div className={styles.logoRS}></div>
          <p>{t('rs')}</p>
        </div>
        <div className={styles.authors}>
          <div className={styles.logoAuthors}></div>
          <div className={styles.author}>
            <div className={styles.leadContainer}>
              <h3>{t('author1Name')}</h3>
              <div className={styles.lead}></div>
            </div>
            <p>{t('author1Description')}</p>
          </div>
          <div className={styles.author}>
            <h3>{t('author2Name')}</h3>
            <p>{t('author2Description')}</p>
          </div>
          <div className={styles.author}>
            <h3>{t('author3Name')}</h3>
            <p>{t('author3Description')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
