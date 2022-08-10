import { useTranslation } from 'react-i18next';
import { useI18nSite } from '../contexts/I18nSiteContext';

export const useSiteTranslation = (ns, options) => {
  const i18n = useI18nSite().i18nSite;
  return useTranslation(ns, { ...options, i18n });
};
