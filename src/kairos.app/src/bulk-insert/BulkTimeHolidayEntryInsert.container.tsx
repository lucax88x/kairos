import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Actions } from '../actions';
import { State } from '../state';
import { bulkInsertTimeHolidayEntriesAsync } from './bulk-insert-time-holiday-entries';
import {
  BulkTimeHolidayEntryInsertComponent,
  BulkTimeHolidayEntryInsertDispatches,
  BulkTimeHolidayEntryInsertInputs,
} from './BulkTimeHolidayEntryInsert';
import { selectIsBulkTimeHolidayEntriesInsertBusy } from './selectors';

const mapStateToProps = (state: State): BulkTimeHolidayEntryInsertInputs => ({
  isBusy: selectIsBulkTimeHolidayEntriesInsertBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): BulkTimeHolidayEntryInsertDispatches => ({
  onBulkInsert: models => dispatch(bulkInsertTimeHolidayEntriesAsync.request({ models })),
});

export const BulkTimeHolidayEntryInsert = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BulkTimeHolidayEntryInsertComponent);
