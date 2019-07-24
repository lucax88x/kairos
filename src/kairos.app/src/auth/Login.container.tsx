import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from '../actions';
import { State } from '../state';
import { LoginComponent, LoginDispatches, LoginInputs } from './Login';
import { loginAsync } from './login';
import { selectIsAuthenticated } from './selectors';

const mapStateToProps = (state: State): LoginInputs => ({
  isAuthenticated: selectIsAuthenticated(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): LoginDispatches => ({
  login: () => dispatch(loginAsync.request()),
});

export const Login = connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginComponent);
