import { useTranslations } from 'next-intl';

import ErrorPage from '@/components/shared/ErrorPage/ErrorPage';
import { ReadonlyFC } from '@/types/readonly.types';

const NotFoundPage: ReadonlyFC = () => {
  const t = useTranslations('NotFoundPage');

  return <ErrorPage title={t('title')} message={t('message')} />;
};

export default NotFoundPage;
