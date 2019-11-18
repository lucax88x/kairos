import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { selectIsOnline } from '../shared/selectors';
import { State } from '../state';
import { loginAsync } from './login';
import { LoginDispatches, LoginFormComponent, LoginInputs } from './LoginForm';

const mapStateToProps = (state: State): LoginInputs => ({
  isOnline: selectIsOnline(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): LoginDispatches => ({
  onLogin: () => dispatch(loginAsync.request()),
});

export const LoginForm = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginFormComponent);
