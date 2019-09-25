import { Catalogs, setupI18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { SpinnerIcon } from './components/SpinnerIcon';
import React from 'react';

export const i18n = setupI18n();

export interface I18nLoaderProps {
  language: string;
}
export interface I18nLoaderState {
  catalogs: Catalogs;
}

export class I18nLoaderComponent extends React.Component<I18nLoaderProps, I18nLoaderState> {
  state: I18nLoaderState = {
    catalogs: {},
  };

  loadCatalog = async (language: string) => {
    const catalog = await import(
      /* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */
      `./locales/${language}/messages.js`
    );

    this.setState(state => {
      i18n.load({
        [language]: catalog,
      });

      return {
        catalogs: {
          ...state.catalogs,
          [language]: catalog,
        },
      };
    });
  };

  componentDidMount() {
    const { language } = this.props;
    this.loadCatalog(language);
  }

  shouldComponentUpdate(nextProps: I18nLoaderProps, nextState: I18nLoaderState) {
    const { language } = nextProps;
    const { catalogs } = nextState;

    if (language !== this.props.language && !catalogs[language]) {
      this.loadCatalog(language);
      return false;
    }

    return true;
  }

  render() {
    const { children, language } = this.props;
    const { catalogs } = this.state;

    if (!catalogs[language]) return <SpinnerIcon />;

    return (
      <I18nProvider i18n={i18n} language={language}>
        {children}
      </I18nProvider>
    );
  }
}
