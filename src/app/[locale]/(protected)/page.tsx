import { useTranslations } from 'next-intl';

import { ReadonlyFC } from '@/types/readonly.types';

const MainPage: ReadonlyFC = () => {
  const t = useTranslations('MainPage');

  return <div>{t('Test')}</div>;
};

export default MainPage;
