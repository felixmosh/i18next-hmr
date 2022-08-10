import { useSiteTranslation } from '../../../core/hooks/useSiteTranslation';

export const Feature2 = () => {
  const { t } = useSiteTranslation();

  return <div>{t('feature2_translation')}</div>;
};
