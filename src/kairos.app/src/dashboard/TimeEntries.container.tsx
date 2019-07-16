import { connect } from 'react-redux';

import { State } from '../state';
import { selectTimeEntries, selectIsTimeEntriesBusy } from './selectors';
import { TimeEntriesComponent, TimeEntriesInputs } from './TimeEntries';

const mapStateToProps = (state: State): TimeEntriesInputs => ({
  timeEntries: selectTimeEntries(state),
  isBusy: selectIsTimeEntriesBusy(state),
});

export const TimeEntries = connect(mapStateToProps)(TimeEntriesComponent);
