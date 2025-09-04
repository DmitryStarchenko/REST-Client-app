'use client';

import { useLocale } from 'next-intl';
import { useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { locales } from '@/i18n/routing';
import { Lang } from '@/types/lang.types';
import { ReadonlyFC } from '@/types/readonly.types';

import styles from './LangSwitcher.module.css';

const LangSwitcher: ReadonlyFC = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const [, startTransition] = useTransition();

  const handleSelectChange = (lang: Lang): void => {
    if (locale === lang) {
      return;
    }

    const searchParams = window.location.search;
    const currentPathname = pathname + searchParams;

    startTransition(() => {
      router.replace(currentPathname, { locale: lang });
    });
  };

  return (
    <div className={styles.langSwitcher}>
      {locales.map((lang) => (
        <button
          key={lang}
          className={lang === locale ? styles.active : ''}
          onClick={() => handleSelectChange(lang as Lang)}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LangSwitcher;
