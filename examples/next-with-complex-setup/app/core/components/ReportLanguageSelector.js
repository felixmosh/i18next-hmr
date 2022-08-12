import { useRouter } from 'next/router';
import { useReportTranslation } from '../hooks/useReportTranslation';

export const ReportLanguageSelector = () => {
  const { t, i18n } = useReportTranslation();

  return (
    <div>
      {t('language')}:{' '}
      <select
        defaultValue={i18n.language}
        onChange={(event) => {
          const language = event.target.value;
          i18n.changeLanguage(language);
        }}
      >
        <option value="en">{t('en')}</option>
        <option value="de">{t('de')}</option>
      </select>
    </div>
  );
};
