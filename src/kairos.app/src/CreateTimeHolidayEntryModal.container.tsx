import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from './actions';
import {
  CreateTimeHolidayEntryModalComponent,
  CreateTimeHolidayEntryModalDispatches,
  CreateTimeHolidayEntryModalInputs,
} from './CreateTimeHolidayEntryModal';
import { closeTimeHolidayEntryModalAction } from './layout/actions';
import { selectIsTimeHolidayEntryModalOpen } from './layout/selectors';
import { TimeHolidayEntryModel } from './models/time-holiday-entry.model';
import { createTimeHolidayEntryAsync } from './shared/create-time-holiday-entry';
import { selectIsCreateTimeHolidayEntryBusy, selectSelectedLanguage } from './shared/selectors';
import { State } from './state';

const mapStateToProps = (state: State): CreateTimeHolidayEntryModalInputs => ({
  selectedLanguage: selectSelectedLanguage(state),
  isOpen: selectIsTimeHolidayEntryModalOpen(state),
  isBusy: selectIsCreateTimeHolidayEntryBusy(state),
});

const mapDispatchToProps = (
  dispatch: Dispatch<Actions>,
): CreateTimeHolidayEntryModalDispatches => ({
  onCreate: (model: TimeHolidayEntryModel) => dispatch(createTimeHolidayEntryAsync.request(model)),
  onClose: () => dispatch(closeTimeHolidayEntryModalAction()),
});

export const CreateTimeHolidayEntryModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateTimeHolidayEntryModalComponent);
