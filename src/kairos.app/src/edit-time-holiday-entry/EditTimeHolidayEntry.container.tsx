import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { selectSelectedLanguage } from '../shared/selectors';
import { State } from '../state';
import {
  EditTimeHolidayEntryComponent,
  EditTimeHolidayEntryDispatches,
  EditTimeHolidayEntryInputs,
} from './EditTimeHolidayEntry';
import {
  selectIsGetTimeHolidayEntryBusy,
  selectIsUpdateTimeHolidayEntryBusy,
  selectTimeHolidayEntry,
} from './selectors';
import { updateTimeHolidayEntryAsync } from './update-time-holiday-entry';

const mapStateToProps = (state: State): EditTimeHolidayEntryInputs => ({
  selectedLanguage: selectSelectedLanguage(state),
  timeHolidayEntry: selectTimeHolidayEntry(state),
  isGetBusy: selectIsGetTimeHolidayEntryBusy(state),
  isUpdateBusy: selectIsUpdateTimeHolidayEntryBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): EditTimeHolidayEntryDispatches => ({
  onUpdate: (model: TimeHolidayEntryModel) =>
    dispatch(updateTimeHolidayEntryAsync.request({ model })),
});

export const EditTimeHolidayEntry = connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditTimeHolidayEntryComponent);
