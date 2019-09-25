import { connect } from 'react-redux';
import { I18nLoaderComponent } from './i18nLoader';
import { selectSelectedLanguage } from './shared/selectors';
import { State } from './state';

function mapStateToProps(state: State) {
  return {
    language: selectSelectedLanguage(state),
  };
}

export const I18nLoader = connect(mapStateToProps)(I18nLoaderComponent);
