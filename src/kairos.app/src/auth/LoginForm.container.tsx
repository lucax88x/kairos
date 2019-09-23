import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { LoginFormComponent, LoginDispatches } from './LoginForm';
import { loginAsync } from './login';

const mapDispatchToProps = (dispatch: Dispatch<Actions>): LoginDispatches => ({
  login: () => dispatch(loginAsync.request()),
});

export const LoginForm = connect(
  null,
  mapDispatchToProps,
)(LoginFormComponent);
