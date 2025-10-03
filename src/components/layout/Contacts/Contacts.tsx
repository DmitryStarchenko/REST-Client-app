import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n';
import { ReadonlyFC } from '@/types/readonly.types';

import styles from './Contacts.module.css';

const Contacts: ReadonlyFC = () => {
  const translationContacts = useTranslations('Contacts');

  return (
    <main className={styles.main}>
      <Typography mb={10} variant="h4">
        {translationContacts('Contacts')}
      </Typography>
      <div className={styles.authors}>
        <Link className={styles.author} href={'https://github.com/DmitryStarchenko'}>
          <div className={styles.logoGH}></div>
          Dmitry Starchenko
        </Link>
        <Link className={styles.author} href={'https://github.com/husanGuru'}>
          <div className={styles.logoGH}></div>
          Husan Abdigafurov
        </Link>
        <Link className={styles.author} href={'https://github.com/Bubnov-Roma'}>
          <div className={styles.logoGH}></div>
          Bubnov Roma
        </Link>
      </div>
      <Link className={styles.logoRS} href={'https://rs.school/courses/reactjs'}></Link>
    </main>
  );
};

export default Contacts;
