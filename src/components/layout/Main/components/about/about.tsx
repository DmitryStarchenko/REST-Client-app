import { useTranslations } from 'next-intl';
import React from 'react';

import { ReadonlyFC } from '@/types/readonly.types';

import styles from './about.module.css';

const About: ReadonlyFC = () => {
  const translationAbout = useTranslations('About');

  return (
    <div className={styles.about}>
      <h2>{translationAbout('about')}</h2>
      <div className={styles.container}>
        <div className={styles.project}>
          <div className={styles.logoProject}></div>
          <p>{translationAbout('project1')}</p>
          <p>{translationAbout('project2')}</p>
          <p>{translationAbout('project3')}</p>
        </div>
        <div className={styles.rs}>
          <div className={styles.logoRS}></div>
          <p>{translationAbout('rs')}</p>
        </div>
        <div className={styles.authors}>
          <div className={styles.logoAuthors}></div>
          <div className={styles.author}>
            <div className={styles.leadContainer}>
              <h3>{translationAbout('author1Name')}</h3>
              <div className={styles.lead}></div>
            </div>
            <p>{translationAbout('author1Description')}</p>
          </div>
          <div className={styles.author}>
            <h3>{translationAbout('author2Name')}</h3>
            <p>{translationAbout('author2Description')}</p>
          </div>
          <div className={styles.author}>
            <h3>{translationAbout('author3Name')}</h3>
            <p>{translationAbout('author3Description')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
