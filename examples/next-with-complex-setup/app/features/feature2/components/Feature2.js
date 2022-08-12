import { useReportTranslation } from '../../../core/hooks/useReportTranslation';
import { useSiteTranslation } from '../../../core/hooks/useSiteTranslation';

export const Feature2 = () => {
  const { t } = useReportTranslation();

  return <div>{t('feature2_translation')}</div>;
};
