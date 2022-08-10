import { Router, useRouter } from 'next/router';
import { useSiteTranslation } from '../hooks/useSiteTranslation';

export const Navbar = () => {
  const router = useRouter();
  const { t, i18n } = useSiteTranslation();

  return (
    <div>
      {t('language')}:{' '}
      <select
        defaultValue={router.locale}
        onChange={(event) => {
          const locale = event.target.value;
          i18n.changeLanguage(locale, () => {
            router.push(
              {
                pathname: router.pathname,
                query: {
                  ...router.query,
                },
              },
              undefined,
              { shallow: true, locale }
            );
          });
        }}
      >
        <option value="en">{t('en')}</option>
        <option value="de">{t('de')}</option>
      </select>
    </div>
  );
};
