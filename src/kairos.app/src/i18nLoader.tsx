import { Catalogs, setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import React from 'react';
import enCatalog from './locales/en/messages';
import itCatalog from './locales/it/messages';

export const i18n = setupI18n();

export interface I18nLoaderProps {
  language: string;
}
export interface I18nLoaderState {
  catalogs: Catalogs;
}

export class I18nLoaderComponent extends React.Component<
  I18nLoaderProps,
  I18nLoaderState
> {
  state: I18nLoaderState = {
    catalogs: {
      it: itCatalog,
      en: enCatalog,
    },
  };

  setCatalog = (language: string) => {
    i18n.load({
      [language]: this.state.catalogs[language],
    });
    i18n.activate(language);
  };

  componentDidMount() {
    const { language } = this.props;
    this.setCatalog(language);
  }

  shouldComponentUpdate(nextProps: I18nLoaderProps) {
    const { language } = nextProps;

    if (language !== this.props.language) {
      this.setCatalog(language);
      return false;
    }

    return true;
  }

  render() {
    const { children, language } = this.props;

    return (
      <I18nProvider i18n={i18n} language={language}>
        {children}
      </I18nProvider>
    );
  }
}
