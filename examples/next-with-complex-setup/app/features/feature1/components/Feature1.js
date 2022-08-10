import { useSiteTranslation } from '../../../core/hooks/useSiteTranslation';

export const Feature1 = () => {
  const { t } = useSiteTranslation();

  return <div>{t('feature1_translation')}</div>;
};
