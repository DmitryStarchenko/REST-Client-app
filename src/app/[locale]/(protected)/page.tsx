import { useTranslations } from 'next-intl';

import { ReadonlyFC } from '@/types/readonly.types';

const MainPage: ReadonlyFC = () => {
  const t = useTranslations('MainPage');

  return <main>{t('Test')}</main>;
};

export default MainPage;
