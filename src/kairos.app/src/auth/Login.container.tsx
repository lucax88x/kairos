import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { LoginComponent, LoginDispatches } from './Login';
import { loginAsync } from './login';

const mapDispatchToProps = (dispatch: Dispatch<Actions>): LoginDispatches => ({
  login: () => dispatch(loginAsync.request()),
});

export const Login = connect(
  null,
  mapDispatchToProps,
)(LoginComponent);
