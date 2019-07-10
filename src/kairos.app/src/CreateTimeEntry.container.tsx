import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from './actions';
import { CreateTimeEntryComponent, CreateTimeEntryDispatches } from './CreateTimeEntry';
import { createTimeEntryAction } from './shared/create-time-entry';

const mapDispatchToProps = (dispatch: Dispatch<Actions>): CreateTimeEntryDispatches => ({
  createTimeEntry: () => dispatch(createTimeEntryAction()),
});

export const CreateTimeEntry = connect(
  null,
  mapDispatchToProps,
)(CreateTimeEntryComponent);
