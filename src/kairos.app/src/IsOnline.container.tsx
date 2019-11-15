import { connect } from 'react-redux';
import { IsOnlineComponent, IsOnlineInputs } from './IsOnline';
import { selectIsOnline } from './shared/selectors';
import { State } from './state';

const mapStateToProps = (state: State): IsOnlineInputs => ({
  isOnline: selectIsOnline(state),
});
export const IsOnline = connect(mapStateToProps)(IsOnlineComponent);
