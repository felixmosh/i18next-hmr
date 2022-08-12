import { useTranslation } from 'react-i18next';
import { useI18nReport } from '../contexts/I18nReportContext';

export const useReportTranslation = (ns, options) => {
  const i18n = useI18nReport().i18nReport;
  return useTranslation(ns, { ...options, i18n });
};
