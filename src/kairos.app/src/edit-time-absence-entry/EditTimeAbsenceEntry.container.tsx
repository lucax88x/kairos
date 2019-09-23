import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from '../actions';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { State } from '../state';
import {
  EditTimeAbsenceEntryComponent,
  EditTimeAbsenceEntryDispatches,
  EditTimeAbsenceEntryInputs,
} from './EditTimeAbsenceEntry';
import {
  selectIsGetTimeAbsenceEntryBusy,
  selectIsUpdateTimeAbsenceEntryBusy,
  selectTimeAbsenceEntry,
} from './selectors';
import { updateTimeAbsenceEntryAsync } from './update-time-absence-entry';

const mapStateToProps = (state: State): EditTimeAbsenceEntryInputs => ({
  timeAbsenceEntry: selectTimeAbsenceEntry(state),
  isGetBusy: selectIsGetTimeAbsenceEntryBusy(state),
  isUpdateBusy: selectIsUpdateTimeAbsenceEntryBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): EditTimeAbsenceEntryDispatches => ({
  onUpdate: (model: TimeAbsenceEntryModel) => dispatch(updateTimeAbsenceEntryAsync.request({ model })),
});

export const EditTimeAbsenceEntry = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditTimeAbsenceEntryComponent);
