import { Catalogs, setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import enCatalog from './locales/en/messages';
import itCatalog from './locales/it/messages';
import { selectSelectedLanguage } from './shared/selectors';
import { State } from './state';

export const i18n = setupI18n();

export interface I18nLoaderProps {
  language: string;
}

const I18nLoaderComponent = (props: PropsWithChildren<I18nLoaderProps>) => {
  const { language, children } = props;

  const catalogs = useMemo<Catalogs>(() => ({
    it: itCatalog,
    en: enCatalog,
  }), []);

  const setCatalog = useCallback((language: string) => {
    i18n.load({
      [language]: catalogs[language],
    });
    i18n.activate(language);
  }, [catalogs]);

  useEffect(() => {
    setCatalog(language)
  }, [language, setCatalog]);

  return (
    <I18nProvider i18n={i18n} language={language}>
      {children}
    </I18nProvider>
  )
};

function mapStateToProps(state: State) {
  return {
    language: selectSelectedLanguage(state),
  };
}

export const I18nLoader = connect(mapStateToProps)(I18nLoaderComponent);
