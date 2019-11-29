import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { selectSelectedLanguage } from '../shared/selectors';
import { State } from '../state';
import {
  NavigatorComponent,
  NavigatorDispatches,
  NavigatorInputs,
} from './Navigator';

const mapStateToProps = (state: State): NavigatorInputs => ({
  selectedLanguage: selectSelectedLanguage(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Actions>,
): NavigatorDispatches => ({});

export const Navigator = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavigatorComponent);
