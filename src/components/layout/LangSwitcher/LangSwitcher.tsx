'use client';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import React from 'react';
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
  const searchParams = useSearchParams();

  const [, startTransition] = useTransition();

  const handleLangToggle = (): void => {
    const currentIndex = locales.indexOf(locale as Lang);
    const nextIndex = (currentIndex + 1) % locales.length;
    const nextLang = locales[nextIndex] as Lang;

    const currentPathname = pathname + searchParams.toString();

    startTransition(() => {
      router.replace(currentPathname, { locale: nextLang });
    });
  };

  const getButtonText = (): string => {
    switch (locale) {
      case 'en':
        return 'EN';
      case 'ru':
        return 'RU';
      default:
        return locale.toUpperCase();
    }
  };

  return (
    <button className={styles.langToggle} onClick={handleLangToggle}>
      {getButtonText()}
    </button>
  );
};

export default LangSwitcher;
