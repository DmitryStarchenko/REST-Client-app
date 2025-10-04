import { Box, Container, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n';
import { ReadonlyFC } from '@/types/readonly.types';

import styles from './Contacts.module.css';

const Contacts: ReadonlyFC = () => {
  const translationContacts = useTranslations('Contacts');

  return (
    <main className={styles.main}>
      <Typography mb={10} variant="h3">
        {translationContacts('Contacts')}
      </Typography>
      <Typography fontSize={22} className={styles.text} mb={3}>
        {translationContacts('textFeedback1')}
        <Link className={styles.link} href={'/contacts/feedback'}>
          {translationContacts('linkFeedback')}
        </Link>
        {translationContacts('textFeedback2')}
      </Typography>
      <Typography fontSize={22} className={styles.text} mb={3}>
        <Link className={styles.email} href={'mailto:support@putman.com'}>
          support@putman.com
        </Link>
        {translationContacts('linkSupport')}
      </Typography>
      <Typography fontSize={22} className={styles.text} mb={10}>
        <Link className={styles.email} href={'mailto:partners@putman.com'}>
          partners@putman.com
        </Link>
        {translationContacts('linkPartners')}
      </Typography>
      <div className={styles.authors}>
        <Typography variant="h4">{translationContacts('Authors')}</Typography>
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
      <Container className={styles.socialMedia}>
        <Link className={`${styles.socialLink} ${styles.x}`} href={'https://x.com/'}></Link>
        <Link
          className={`${styles.socialLink} ${styles.inst}`}
          href={'https://www.instagram.com/'}
        ></Link>
        <Link
          className={`${styles.socialLink} ${styles.tel}`}
          href={'https://web.telegram.org/'}
        ></Link>
      </Container>
    </main>
  );
};

export default Contacts;
